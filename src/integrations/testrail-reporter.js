/**
 * Playwright custom reporter — posts test results to TestRail after each run.
 *
 * How it works:
 *  1. Reads src/integrations/testrail-case-map.json (written by push-to-testrail.js)
 *     to resolve spec test titles → TestRail case IDs.
 *  2. For each spec test, looks for a "TestRail" annotation on the test
 *     (set via test.info().annotations.push({ type: 'TestRail', value: 'C<id>' })).
 *     If the annotation is missing, falls back to the case map lookup by title.
 *  3. Creates a TestRail test run for this execution.
 *  4. Posts pass/fail/skip results for each mapped case.
 *
 * Wired into config/playwright.config.js as a custom reporter.
 * Only runs when TESTRAIL_PROJECT_ID + TESTRAIL_SUITE_ID are set in the environment.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs   = require('fs');
const path = require('path');
const { TestRailIntegration } = require('./testrail-integration');

const CASE_MAP_PATH = path.resolve(__dirname, 'testrail-case-map.json');

class TestRailReporter {
  constructor() {
    this.testrail   = new TestRailIntegration();
    this.projectId  = parseInt(process.env.TESTRAIL_PROJECT_ID, 10);
    this.suiteId    = parseInt(process.env.TESTRAIL_SUITE_ID, 10);
    this.enabled    = !!(this.projectId && this.suiteId &&
                         process.env.TESTRAIL_HOST &&
                         process.env.TESTRAIL_USER  &&
                         process.env.TESTRAIL_API_KEY);

    // Map: specTitle → TestRail case ID (loaded from file)
    this.caseMap    = {};
    this.results    = []; // { caseId, status, comment, elapsed }
    this.runId      = null;
    this.startTime  = null;

    if (this.enabled) {
      if (fs.existsSync(CASE_MAP_PATH)) {
        const raw = JSON.parse(fs.readFileSync(CASE_MAP_PATH, 'utf8'));
        this.caseMap = raw.cases || {};
        console.log(`[TestRail Reporter] Loaded ${Object.keys(this.caseMap).length} case mappings`);
      } else {
        console.warn(
          '[TestRail Reporter] testrail-case-map.json not found. ' +
          'Run "node src/integrations/push-to-testrail.js" first to create test cases in TestRail.'
        );
        this.enabled = false;
      }
    }
  }

  // Called once when the test run starts
  onBegin(_config, suite) {
    this.startTime = Date.now();
    if (this.enabled) {
      console.log(`\n[TestRail Reporter] Test run started — will post results to TestRail project ${this.projectId}`);
    }
  }

  // Called after each individual test completes
  onTestEnd(test, result) {
    if (!this.enabled) return;

    // Resolve the TestRail case ID:
    // Priority 1 — parse [Cxxxx] from the test title, e.g. "[C1001] Test Case 1: ..."
    let caseId = null;
    const titleMatch = test.title.match(/\[C(\d+)\]/i);
    if (titleMatch) {
      caseId = parseInt(titleMatch[1], 10);
    }

    // Priority 2 — fall back to case map lookup by title (strips the [Cxxxx] prefix first)
    if (!caseId) {
      const strippedTitle = test.title.replace(/^\[C\d+\]\s*/i, '');
      const mapped = this.caseMap[strippedTitle];
      if (mapped) caseId = mapped;
    }

    if (!caseId) {
      // No mapping found — skip silently (test not pushed to TestRail)
      return;
    }

    const elapsed = result.duration
      ? `${Math.ceil(result.duration / 1000)}s`
      : '';

    const errorMessage = result.error
      ? `${result.error.message || ''}\n\n${result.error.stack || ''}`.substring(0, 2000)
      : '';

    const comment = result.status === 'failed'
      ? `❌ Failed in Playwright run.\n\n${errorMessage}`
      : result.status === 'skipped'
        ? '⏭️  Skipped in Playwright run.'
        : '✅ Passed in Playwright run.';

    this.results.push({
      caseId,
      status:  result.status,         // passed | failed | skipped | timedOut
      comment: comment.trim(),
      elapsed
    });
  }

  // Called once all tests have finished — create the run and post all results
  async onEnd(result) {
    if (!this.enabled || this.results.length === 0) return;

    const runName = `OCBC Bank Automation — ${new Date().toISOString().split('T')[0]}`;
    const caseIds = [...new Set(this.results.map(r => r.caseId))];

    console.log(`\n[TestRail Reporter] Creating test run "${runName}" with ${caseIds.length} case(s)...`);

    try {
      const run = await this.testrail.createTestRun(
        this.projectId,
        this.suiteId,
        runName,
        caseIds
      );
      this.runId = run.id;

      console.log(`[TestRail Reporter] Posting ${this.results.length} result(s) to run ${this.runId}...`);

      for (const r of this.results) {
        await this.testrail.updateTestResult(this.runId, r.caseId, {
          status:  r.status,
          comment: r.comment,
          elapsed: r.elapsed
        });
      }

      const passed  = this.results.filter(r => r.status === 'passed').length;
      const failed  = this.results.filter(r => r.status === 'failed').length;
      const skipped = this.results.filter(r => r.status === 'skipped').length;

      console.log(
        `\n[TestRail Reporter] ✅ Results posted to TestRail run ${this.runId}` +
        ` — ${passed} passed, ${failed} failed, ${skipped} skipped\n` +
        `   View: ${process.env.TESTRAIL_HOST}/index.php?/runs/view/${this.runId}\n`
      );
    } catch (err) {
      console.error('[TestRail Reporter] ❌ Failed to post results:', err.message);
    }
  }
}

module.exports = TestRailReporter;
