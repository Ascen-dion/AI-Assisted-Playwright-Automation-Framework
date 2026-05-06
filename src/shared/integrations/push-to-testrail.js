/**
 * Push acceptance-criteria-derived test cases to TestRail.
 *
 * Usage:
 *   node src/integrations/push-to-testrail.js
 *
 * Required env vars (.env):
 *   TESTRAIL_HOST=https://yourcompany.testrail.io
 *   TESTRAIL_USER=you@company.com
 *   TESTRAIL_API_KEY=your-api-key
 *   TESTRAIL_PROJECT_ID=<numeric project id>
 *   TESTRAIL_SUITE_ID=<numeric suite id>
 *
 * Optional:
 *   TESTRAIL_SECTION_NAME=StarHub Mobile Purchase  (default shown)
 *   JIRA_REF=AU-1                                  (Jira story key for traceability)
 *
 * Output:
 *   Writes src/integrations/testrail-case-map.json  — maps spec test titles → TestRail case IDs
 *   This file is consumed by testrail-reporter.js to post results after each test run.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const fs   = require('fs');
const path = require('path');
const { TestRailIntegration } = require('./testrail-integration');

// ── Configuration ──────────────────────────────────────────────────────────
const PROJECT_ID   = parseInt(process.env.TESTRAIL_PROJECT_ID, 10);
const SUITE_ID     = parseInt(process.env.TESTRAIL_SUITE_ID, 10);
// Use TESTRAIL_SECTION_ID from .env if set; push-to-testrail does not need to
// create/look up sections — just use an existing one.
const SECTION_ID   = process.env.TESTRAIL_SECTION_ID
  ? parseInt(process.env.TESTRAIL_SECTION_ID, 10)
  : null;
const JIRA_REF     = process.env.JIRA_REF || '';

if (!PROJECT_ID || !SUITE_ID) {
  console.error('❌ TESTRAIL_PROJECT_ID and TESTRAIL_SUITE_ID must be set in .env');
  process.exit(1);
}

// ── Test case definitions — loaded from testrail-test-cases.json ────────────
// To add a new story: append an entry to testrail-test-cases.json and re-run this script.
// The `specTitle` value MUST match the exact string passed to test() in the spec.
const TEST_CASES_RAW = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'testrail-test-cases.json'), 'utf8')
);

// Map jiraRef from JSON; override with JIRA_REF env var if set for the current run
const TEST_CASES = TEST_CASES_RAW.map(tc => ({
  ...tc,
  refs: JIRA_REF || tc.jiraRef || ''
}));

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const testrail = new TestRailIntegration();

  console.log('\n🚀 Pushing 5 test cases to TestRail...');
  console.log(`   Project: ${PROJECT_ID}  |  Suite: ${SUITE_ID}  |  Section: ${SECTION_ID || '(none — cases go to suite root)'}\n`);

  const caseMap = {}; // specTitle → TestRail case ID

  for (const tc of TEST_CASES) {
    const existing = await testrail.findTestCaseByTitle(PROJECT_ID, SUITE_ID, tc.title, SECTION_ID);

    let result;
    if (existing) {
      console.log(`   ⟳  Updating existing case ${existing.id}: ${tc.title}`);
      result = await testrail.updateTestCase(existing.id, tc);
    } else {
      result = await testrail.pushTestCase(PROJECT_ID, SUITE_ID, tc, SECTION_ID);
    }

    caseMap[tc.specTitle] = result.id;
  }

  // Save the case map so the reporter can reference it
  const mapPath = path.resolve(__dirname, 'testrail-case-map.json');
  fs.writeFileSync(
    mapPath,
    JSON.stringify({ sectionId: SECTION_ID, cases: caseMap }, null, 2),
    'utf8'
  );

  console.log(`\n✅ Done. Case map written to: ${mapPath}`);
  console.log('\n📋 TestRail case IDs (update [C0] in the spec with these):');
  for (const [specTitle, caseId] of Object.entries(caseMap)) {
    console.log(`   C${caseId}  →  ${specTitle}`);
  }
  console.log('');
}

main().catch(err => {
  console.error('❌ Unhandled error:', err.message);
  process.exit(1);
});
