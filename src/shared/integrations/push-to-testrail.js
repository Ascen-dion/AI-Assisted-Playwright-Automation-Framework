/**
 * Generic TestRail case pusher — reads testrail-test-cases.json and pushes
 * any entries that don't yet have a real CID to TestRail.
 *
 * Usage:
 *   node src/shared/integrations/push-to-testrail.js
 *
 * Workflow (no one-off scripts needed):
 *   1. Add a new story to testrail-test-cases.json with "cid": null
 *   2. Run this script — it creates/finds the case in TestRail and writes
 *      the real CID back into testrail-test-cases.json automatically
 *   3. testrail-case-map.json is rebuilt from all entries every run
 *
 * Skips entries that already have a real CID (anything other than null or "C0").
 * Safe to re-run at any time — never creates duplicates.
 *
 * Required env vars (.env):
 *   TESTRAIL_HOST, TESTRAIL_USER, TESTRAIL_API_KEY
 *   TESTRAIL_PROJECT_ID, TESTRAIL_SUITE_ID, TESTRAIL_SECTION_ID
 *
 * Optional:
 *   JIRA_REF=ED-85   override jiraRef for all cases in this run
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const fs   = require('fs');
const path = require('path');
const { TestRailIntegration } = require('./testrail-integration');

// ── Configuration ──────────────────────────────────────────────────────────
const PROJECT_ID = parseInt(process.env.TESTRAIL_PROJECT_ID, 10);
const SUITE_ID   = parseInt(process.env.TESTRAIL_SUITE_ID, 10);
const SECTION_ID = process.env.TESTRAIL_SECTION_ID
  ? parseInt(process.env.TESTRAIL_SECTION_ID, 10)
  : null;
const JIRA_REF   = process.env.JIRA_REF || '';

if (!PROJECT_ID || !SUITE_ID) {
  console.error('❌ TESTRAIL_PROJECT_ID and TESTRAIL_SUITE_ID must be set in .env');
  process.exit(1);
}

// ── Paths ──────────────────────────────────────────────────────────────────
const TEST_CASES_PATH = path.resolve(__dirname, '../traceability/testrail-test-cases.json');
const CASE_MAP_PATH   = path.resolve(__dirname, '../traceability/testrail-case-map.json');

// ── Helpers ─────────────────────────────────────────────────────────────────
/** Strip [Cxxx] prefix from a test title so it reads cleanly in TestRail. */
function cleanTitle(title) {
  return title.replace(/^\[C\d+\]\s*/i, '').trim();
}

/** Return true if this entry already has a real (non-placeholder) CID. */
function hasRealCid(cid) {
  if (!cid) return false;
  if (cid === 'C0') return false;
  return /^C\d+$/i.test(String(cid));
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const testrail  = new TestRailIntegration();
  const testCases = JSON.parse(fs.readFileSync(TEST_CASES_PATH, 'utf8'));

  const pending = testCases.filter(tc => !hasRealCid(tc.cid));
  const already = testCases.filter(tc =>  hasRealCid(tc.cid));

  console.log(`\n🚀 push-to-testrail`);
  console.log(`   Project: ${PROJECT_ID}  |  Suite: ${SUITE_ID}  |  Section: ${SECTION_ID ?? '—'}`);
  console.log(`   ${already.length} already have CIDs (skipping) | ${pending.length} to push\n`);

  // ── Push pending cases ───────────────────────────────────────────────────
  for (const tc of pending) {
    const trTitle = cleanTitle(tc.title);
    const refs    = JIRA_REF || tc.jiraRef || '';

    // Find-or-create (avoids duplicates on re-runs)
    const existing = await testrail.findTestCaseByTitle(PROJECT_ID, SUITE_ID, trTitle, SECTION_ID);
    let result;
    if (existing) {
      console.log(`   ⟳  Found existing case ${existing.id}: ${trTitle}`);
      result = existing;
    } else {
      result = await testrail.pushTestCase(PROJECT_ID, SUITE_ID, {
        title:        trTitle,
        preconditions: `Navigate to the application. Jira: ${refs || 'n/a'}`,
        steps:        tc.ac || trTitle,
        expected:     tc.ac || trTitle,
        refs
      }, SECTION_ID);
    }

    // Write the real CID back into the entry immediately
    tc.cid   = `C${result.id}`;
    tc.title = `[C${result.id}] ${trTitle}`;
    console.log(`   ✅ C${result.id}  →  ${trTitle}`);
  }

  // ── Write updated testrail-test-cases.json ───────────────────────────────
  if (pending.length > 0) {
    fs.writeFileSync(TEST_CASES_PATH, JSON.stringify(testCases, null, 2) + '\n', 'utf8');
    console.log(`\n💾 Updated ${TEST_CASES_PATH} with real CIDs`);
    console.log('   ⚠️  Update your spec file test() titles to use the new [Cxxx] prefixes above.');
  }

  // ── Rebuild testrail-case-map.json from ALL entries ──────────────────────
  const cases = {};
  for (const tc of testCases) {
    if (!hasRealCid(tc.cid)) continue; // skip anything still without a CID
    cases[tc.cid] = {
      specTitle: cleanTitle(tc.title),
      specFile:  tc.specFile || '',
      jiraRef:   tc.jiraRef  || null,
      ac:        tc.ac       || ''
    };
  }

  fs.writeFileSync(
    CASE_MAP_PATH,
    JSON.stringify({ sectionId: SECTION_ID, cases }, null, 2) + '\n',
    'utf8'
  );
  console.log(`\n📋 Rebuilt ${CASE_MAP_PATH}  (${Object.keys(cases).length} entries)\n`);
}

main().catch(err => {
  console.error('❌ Unhandled error:', err.message);
  process.exit(1);
});
