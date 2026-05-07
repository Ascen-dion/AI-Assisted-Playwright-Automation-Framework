/**
 * Push OrangeHRM test cases to TestRail.
 *
 * Usage:
 *   node src/shared/integrations/push-orangehrm-to-testrail.js
 *
 * Reads from: src/shared/traceability/orangehrm-test-cases.json
 * Writes to:  src/shared/traceability/testrail-case-map.json (appends OrangeHRM entries)
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const fs   = require('fs');
const path = require('path');
const { TestRailIntegration } = require('./testrail-integration');

// ── Configuration ──────────────────────────────────────────────────────────
const PROJECT_ID   = parseInt(process.env.TESTRAIL_PROJECT_ID, 10);
const SUITE_ID     = parseInt(process.env.TESTRAIL_SUITE_ID, 10);
const SECTION_ID   = process.env.TESTRAIL_SECTION_ID
  ? parseInt(process.env.TESTRAIL_SECTION_ID, 10)
  : null;

if (!PROJECT_ID || !SUITE_ID) {
  console.error('❌ TESTRAIL_PROJECT_ID and TESTRAIL_SUITE_ID must be set in .env');
  process.exit(1);
}

// ── Load OrangeHRM test cases ──────────────────────────────────────────────
const TEST_CASES_RAW = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../traceability/orangehrm-test-cases.json'), 'utf8')
);

const TEST_CASES = TEST_CASES_RAW.map(tc => ({
  ...tc,
  refs: tc.jiraRef || ''
}));

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const testrail = new TestRailIntegration();

  console.log(`\n🚀 Pushing ${TEST_CASES.length} OrangeHRM test cases to TestRail...`);
  console.log(`   Project: ${PROJECT_ID}  |  Suite: ${SUITE_ID}  |  Section: ${SECTION_ID || '(none)'}\n`);

  // Load existing case map if present
  const mapPath = path.resolve(__dirname, '../traceability/testrail-case-map.json');
  let existingMap = { sectionId: SECTION_ID, cases: {} };
  if (fs.existsSync(mapPath)) {
    existingMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  }

  const caseMap = { ...existingMap.cases };

  for (const tc of TEST_CASES) {
    // Skip if already in case map
    if (caseMap[tc.specTitle]) {
      console.log(`   ⏭️  Already mapped: C${caseMap[tc.specTitle]} → ${tc.specTitle}`);
      continue;
    }

    const existing = await testrail.findTestCaseByTitle(PROJECT_ID, SUITE_ID, tc.title, SECTION_ID);

    let result;
    if (existing) {
      console.log(`   🔄 Updating existing case ${existing.id}: ${tc.title}`);
      result = await testrail.updateTestCase(existing.id, tc);
    } else {
      result = await testrail.pushTestCase(PROJECT_ID, SUITE_ID, tc, SECTION_ID);
    }

    caseMap[tc.specTitle] = result.id;
  }

  // Save the updated case map
  fs.writeFileSync(
    mapPath,
    JSON.stringify({ sectionId: SECTION_ID, cases: caseMap }, null, 2),
    'utf8'
  );

  console.log(`\n✅ Done. Case map written to: ${mapPath}`);
  console.log('\n📋 OrangeHRM TestRail Case IDs:');
  for (const tc of TEST_CASES) {
    const caseId = caseMap[tc.specTitle];
    if (caseId) {
      console.log(`   C${caseId}  →  ${tc.specTitle}`);
    }
  }
  console.log('');
}

main().catch(err => {
  console.error('❌ Unhandled error:', err.message);
  process.exit(1);
});
