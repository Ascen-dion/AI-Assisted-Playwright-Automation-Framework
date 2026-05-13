/**
 * Push TIIS-driven E-Shop test cases (TC51-TC65) to TestRail.
 * These cases were generated based on the TIIS impact analysis of PR#2
 * (Navbar updated — Profile link added) against karansethiascendion/aava-ecom-demo.
 *
 * Usage:
 *   node src/shared/integrations/push-eshop-tiis-driven-to-testrail.js
 *
 * Reads from: src/shared/traceability/eshop-tiis-driven-test-cases.json
 * Appends to: src/shared/traceability/testrail-case-map.json
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const fs   = require('fs');
const path = require('path');
const { TestRailIntegration } = require('./testrail-integration');

// ── Configuration ─────────────────────────────────────────────────────────
const PROJECT_ID = parseInt(process.env.TESTRAIL_PROJECT_ID, 10);
const SUITE_ID   = parseInt(process.env.TESTRAIL_SUITE_ID, 10);
const SECTION_ID = process.env.TESTRAIL_SECTION_ID
  ? parseInt(process.env.TESTRAIL_SECTION_ID, 10)
  : null;

if (!PROJECT_ID || !SUITE_ID) {
  console.error('❌ TESTRAIL_PROJECT_ID and TESTRAIL_SUITE_ID must be set in .env');
  process.exit(1);
}

// ── Load test cases ────────────────────────────────────────────────────────
const TEST_CASES = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../traceability/eshop-tiis-driven-test-cases.json'),
    'utf8'
  )
).map(tc => ({
  ...tc,
  refs: tc.jiraRef || '',
  // TestRail expects custom_steps as a plain string, not an array
  steps: Array.isArray(tc.steps) ? tc.steps.join('\n') : (tc.steps || ''),
}));

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const testrail = new TestRailIntegration();

  console.log(`\n🚀 Pushing ${TEST_CASES.length} TIIS-driven E-Shop test cases to TestRail...`);
  console.log(`   Project: ${PROJECT_ID}  |  Suite: ${SUITE_ID}  |  Section: ${SECTION_ID || '(none)'}`);
  console.log(`   Source: TIIS PR#2 impact analysis — Navigation (Profile link)\n`);

  // Load existing case map
  const mapPath = path.resolve(__dirname, '../traceability/testrail-case-map.json');
  let existingMap = { sectionId: SECTION_ID, cases: {} };
  if (fs.existsSync(mapPath)) {
    existingMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  }
  const caseMap = { ...existingMap.cases };

  for (const tc of TEST_CASES) {
    // Skip if title is already in the case map
    if (caseMap[tc.title]) {
      console.log(`   ⏭️  Already mapped: C${caseMap[tc.title]} → ${tc.title}`);
      continue;
    }

    const existing = await testrail.findTestCaseByTitle(PROJECT_ID, SUITE_ID, tc.title, SECTION_ID);

    let result;
    if (existing) {
      console.log(`   🔄 Updating existing case C${existing.id}: ${tc.title}`);
      result = await testrail.updateTestCase(existing.id, tc);
    } else {
      result = await testrail.pushTestCase(PROJECT_ID, SUITE_ID, tc, SECTION_ID);
    }

    caseMap[tc.title] = result.id;
    console.log(`   ✅ C${result.id}  →  ${tc.title}`);
  }

  // Write updated case map
  fs.writeFileSync(
    mapPath,
    JSON.stringify({ sectionId: SECTION_ID, cases: caseMap }, null, 2),
    'utf8'
  );

  console.log('\n✅ testrail-case-map.json updated.');
  console.log('═'.repeat(60));
  console.log(`  ${TEST_CASES.length} cases processed`);
  console.log('═'.repeat(60) + '\n');
}

main().catch(err => {
  console.error('❌ Push failed:', err.message);
  process.exit(1);
});
