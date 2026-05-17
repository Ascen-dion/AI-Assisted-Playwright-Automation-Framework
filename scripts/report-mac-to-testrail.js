/**
 * report-mac-to-testrail.js
 *
 * Posts HP Smart macOS (WDIO) test results to TestRail after a CI run.
 *
 * How it works:
 *  1. Reads the freshest report-N-N.json from wdio-html-nice-reporter output.
 *  2. Resolves TestRail case IDs for each test in priority order:
 *       a) [C<id>] tag embedded directly in the test title, e.g. "[C2001] should…"
 *       b) Lookup by title in src/shared/traceability/testrail-case-map-mac.json
 *  3. Creates a timestamped TestRail test run for this execution.
 *  4. Adds results for every mapped test case and closes the run.
 *
 * Called by GitHub Actions — safe to run locally too (needs .env).
 *
 * Required env vars:
 *   TESTRAIL_HOST         https://yourcompany.testrail.io
 *   TESTRAIL_USER         you@company.com
 *   TESTRAIL_API_KEY      your-api-key
 *   TESTRAIL_PROJECT_ID   numeric project ID
 *   TESTRAIL_SUITE_ID     numeric suite ID
 *
 * Optional env vars:
 *   TESTRAIL_RUN_NAME_PREFIX   (default: "HP Smart macOS Smoke")
 *   GITHUB_RUN_NUMBER          appended to the run name if set
 *   GITHUB_REF_NAME            branch name
 *   GITHUB_SHA                 commit SHA
 *   GITHUB_ACTOR               committer
 */
'use strict';
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const fs    = require('fs');
const path  = require('path');
const glob  = require('glob');
const https = require('https');
const http  = require('http');

// ── Config ────────────────────────────────────────────────────────────────────
const HOST       = (process.env.TESTRAIL_HOST || '').replace(/\/$/, '');
const USER       = process.env.TESTRAIL_USER     || '';
const API_KEY    = process.env.TESTRAIL_API_KEY  || '';
const PROJECT_ID = parseInt(process.env.TESTRAIL_PROJECT_ID || '0', 10);
const SUITE_ID   = parseInt(process.env.TESTRAIL_SUITE_ID   || '0', 10);
const PREFIX     = process.env.TESTRAIL_RUN_NAME_PREFIX || 'HP Smart macOS Smoke';
const RUN_NUM    = process.env.GITHUB_RUN_NUMBER || '';
const BRANCH     = process.env.GITHUB_REF_NAME  || '';
const SHA        = (process.env.GITHUB_SHA || '').slice(0, 7);
const ACTOR      = process.env.GITHUB_ACTOR || '';

const CASE_MAP_PATH = path.resolve(
  __dirname, '../src/shared/traceability/testrail-case-map-mac.json'
);

// TestRail status IDs
const STATUS = { passed: 1, failed: 5, skipped: 2, pending: 4, untested: 3 };

// ── Guard — skip gracefully when secrets are not configured ───────────────────
if (!HOST || !USER || !API_KEY || !PROJECT_ID || !SUITE_ID) {
  console.log('ℹ️  TestRail credentials not configured — skipping results upload.');
  console.log('   Set TESTRAIL_HOST, TESTRAIL_USER, TESTRAIL_API_KEY,');
  console.log('   TESTRAIL_PROJECT_ID, and TESTRAIL_SUITE_ID to enable.');
  process.exit(0);
}

// ── HTTP helper ───────────────────────────────────────────────────────────────
function testrailRequest(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const url     = `${HOST}/index.php?/api/v2/${endpoint}`;
    const parsed  = new URL(url);
    const lib     = parsed.protocol === 'https:' ? https : http;
    const payload = body ? JSON.stringify(body) : null;
    const auth    = Buffer.from(`${USER}:${API_KEY}`).toString('base64');

    const options = {
      hostname: parsed.hostname,
      port:     parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path:     parsed.pathname + parsed.search,
      method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type':  'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`TestRail API ${res.statusCode}: ${parsed.error || data}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`TestRail response parse error: ${e.message} — ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ── Load case map ─────────────────────────────────────────────────────────────
let caseMap = {};
if (fs.existsSync(CASE_MAP_PATH)) {
  try {
    const raw = JSON.parse(fs.readFileSync(CASE_MAP_PATH, 'utf8'));
    caseMap = raw.cases || {};
    console.log(`[TestRail] Loaded ${Object.keys(caseMap).length} macOS case mappings`);
  } catch (e) {
    console.warn('[TestRail] Could not parse testrail-case-map-mac.json:', e.message);
  }
} else {
  console.warn(
    '[TestRail] testrail-case-map-mac.json not found.\n' +
    '  Add [Cxxx] tags to test titles or populate src/shared/traceability/testrail-case-map-mac.json.'
  );
}

// ── Load WDIO test results ────────────────────────────────────────────────────
const htmlDir   = path.resolve(__dirname, '../test-results/mac/html');
const jsonFiles = glob.sync('report-*-*.json', { cwd: htmlDir, absolute: true });

if (jsonFiles.length === 0) {
  console.error('[TestRail] No report-N-N.json files found. Was the test run complete?');
  process.exit(0); // exit 0 so CI is not blocked
}

const latest = jsonFiles
  .map(f => ({ f, mtime: fs.statSync(f).mtimeMs }))
  .sort((a, b) => b.mtime - a.mtime)[0].f;

let report;
try {
  report = JSON.parse(fs.readFileSync(latest, 'utf8'));
} catch (e) {
  console.error('[TestRail] Could not parse report JSON:', e.message);
  process.exit(0);
}

// ── Collect test results ──────────────────────────────────────────────────────
const results = [];

const walkSuite = (suite) => {
  for (const test of (suite.tests || [])) {
    const title = test.title || '';
    const state = test.state || 'unknown';
    const dur   = test._duration || 0;

    let caseId = null;

    // Priority 1: [Cxxx] embedded in test title
    const cMatch = title.match(/\[C(\d+)\]/i);
    if (cMatch) caseId = parseInt(cMatch[1], 10);

    // Priority 2: case map lookup (full title, then bare title without prefix)
    if (!caseId) {
      const bare   = title.replace(/^\[.*?\]\s*/, '').trim();
      const mapped = caseMap[title] || caseMap[bare];
      if (mapped) caseId = parseInt(mapped, 10);
    }

    if (!caseId) continue;

    const errEvents = (test.events || []).filter(e => e.type && e.type.toLowerCase().includes('error'));
    const errText   = errEvents
      .map(e => `${(e.value || {}).message || ''}\n${(e.value || {}).stack || ''}`.trim())
      .filter(Boolean)
      .join('\n\n')
      .substring(0, 3000);

    const stateToStatus = { passed: 'passed', failed: 'failed', pending: 'pending' };
    const statusKey     = stateToStatus[state] || 'untested';
    const statusId      = STATUS[statusKey];

    const comment = state === 'passed'
      ? `✅ Passed in WDIO run #${RUN_NUM} on macOS.`
      : state === 'failed'
        ? `❌ Failed in WDIO run #${RUN_NUM} on macOS.\n\n${errText}`
        : `⏭️  Skipped in WDIO run #${RUN_NUM} on macOS.`;

    results.push({ caseId, statusId, comment: comment.trim(), elapsed: dur >= 1000 ? `${Math.ceil(dur / 1000)}s` : '' });
  }

  for (const child of (suite.suites || [])) walkSuite(child);
};

for (const suite of (report.suites || [])) walkSuite(suite);

if (results.length === 0) {
  console.log('[TestRail] No mapped test cases found — nothing to post.');
  console.log('  To map cases, add [C<id>] to test titles or populate testrail-case-map-mac.json.');
  process.exit(0);
}

// ── Post to TestRail ──────────────────────────────────────────────────────────
async function main() {
  const metrics = report.metrics || {};
  const runName = `${PREFIX}${RUN_NUM ? ` — Run #${RUN_NUM}` : ''}`;
  const runDesc = [
    `Branch: ${BRANCH || 'unknown'}`,
    `Commit: ${SHA || 'unknown'}`,
    `Actor: ${ACTOR || 'unknown'}`,
    `Passed: ${metrics.passed || 0} / Failed: ${metrics.failed || 0} / Skipped: ${metrics.skipped || 0}`,
    `Duration: ${((metrics.duration || 0) / 1000).toFixed(1)}s`,
    `Platform: macOS (GitHub Actions macos-latest)`,
    `Driver: Appium + mac2 Driver (XCTest)`,
    `App: com.hp.SmartForDesktop`,
  ].join('\n');

  const caseIds = [...new Set(results.map(r => r.caseId))];

  console.log(`\n[TestRail] Creating test run: "${runName}"`);
  console.log(`[TestRail] Project ${PROJECT_ID} | Suite ${SUITE_ID} | ${caseIds.length} case(s)\n`);

  const run = await testrailRequest('POST', `add_run/${PROJECT_ID}`, {
    suite_id:    SUITE_ID,
    name:        runName,
    description: runDesc,
    case_ids:    caseIds,
    include_all: false,
  });

  console.log(`[TestRail] ✅ Run created: ${HOST}/index.php?/runs/view/${run.id}`);

  const payload = results.map(r => ({
    case_id:   r.caseId,
    status_id: r.statusId,
    comment:   r.comment,
    ...(r.elapsed ? { elapsed: r.elapsed } : {}),
  }));

  await testrailRequest('POST', `add_results_for_cases/${run.id}`, { results: payload });
  console.log(`[TestRail] ✅ ${results.length} result(s) posted`);

  await testrailRequest('POST', `close_run/${run.id}`, {});
  console.log(`[TestRail] ✅ Run closed`);
  console.log(`[TestRail] View: ${HOST}/index.php?/runs/view/${run.id}`);
}

main().catch(e => {
  console.error('[TestRail] ❌ Error (non-blocking):', e.message);
  process.exit(0); // always exit 0 so CI continues even if TestRail is unreachable
});
