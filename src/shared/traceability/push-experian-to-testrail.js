/**
 * Push all Experian test cases to TestRail.
 *
 * Usage:
 *   node src/shared/traceability/push-experian-to-testrail.js
 *
 * Reads all 14 Experian test case definitions from
 * experian-testrail-test-cases.json, pushes them to the configured
 * TestRail section (46), updates the case map, and embeds real [Cxxx] IDs
 * in spec file test titles.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const fs   = require('fs');
const path = require('path');
const { TestRailIntegration } = require('../integrations/testrail-integration');

const PROJECT_ID = parseInt(process.env.TESTRAIL_PROJECT_ID, 10);
const SUITE_ID   = parseInt(process.env.TESTRAIL_SUITE_ID, 10);
const SECTION_ID = process.env.TESTRAIL_SECTION_ID
  ? parseInt(process.env.TESTRAIL_SECTION_ID, 10)
  : null;

if (!PROJECT_ID || !SUITE_ID) {
  console.error('❌ TESTRAIL_PROJECT_ID and TESTRAIL_SUITE_ID must be set in .env');
  process.exit(1);
}

// Load all Experian test case definitions (14 cases)
const TEST_CASES = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'experian-testrail-test-cases.json'), 'utf8')
);

// All Experian spec files to update with real case IDs
const SPEC_FILES = [
  path.resolve(__dirname, '../../web/tests/nav/experian-homepage.spec.js'),
];

async function main() {
  const testrail = new TestRailIntegration();

  console.log(`\n🚀 Pushing ${TEST_CASES.length} Experian test cases to TestRail...`);
  console.log(`   Project: ${PROJECT_ID}  |  Suite: ${SUITE_ID}  |  Section: ${SECTION_ID || '(suite root)'}\n`);

  // Load existing case map (preserve non-Experian entries)
  const mapPath = path.resolve(__dirname, 'testrail-case-map.json');
  let existingMap = { sectionId: SECTION_ID, cases: {} };
  if (fs.existsSync(mapPath)) {
    existingMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  }

  const newCaseMap = {};  // specTitle → TestRail case ID (Experian only)
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const tc of TEST_CASES) {
    // Check if already exists in the current case map
    if (existingMap.cases[tc.specTitle]) {
      console.log(`   ⏭️  Already mapped: C${existingMap.cases[tc.specTitle]} → ${tc.specTitle}`);
      newCaseMap[tc.specTitle] = existingMap.cases[tc.specTitle];
      skipped++;
      continue;
    }

    // Check if case exists in TestRail by title
    const existing = await testrail.findTestCaseByTitle(PROJECT_ID, SUITE_ID, tc.title, SECTION_ID);

    let result;
    if (existing) {
      console.log(`   ⟳  Updating existing case C${existing.id}: ${tc.title}`);
      result = await testrail.updateTestCase(existing.id, tc);
      updated++;
    } else {
      result = await testrail.pushTestCase(PROJECT_ID, SUITE_ID, tc, SECTION_ID);
      created++;
    }

    newCaseMap[tc.specTitle] = result.id;
  }

  // Merge new Experian cases into existing map (preserves other project cases)
  const mergedCases = { ...existingMap.cases, ...newCaseMap };
  fs.writeFileSync(
    mapPath,
    JSON.stringify({ sectionId: SECTION_ID, cases: mergedCases }, null, 2),
    'utf8'
  );

  console.log(`\n✅ Done. Created: ${created} | Updated: ${updated} | Skipped: ${skipped}`);
  console.log(`   Case map written to: ${mapPath}`);

  // ── Update spec files with real [Cxxx] IDs ──────────────────────────────
  console.log('\n📝 Updating spec files with real TestRail case IDs...\n');
  for (const specFile of SPEC_FILES) {
    if (!fs.existsSync(specFile)) {
      console.log(`   ⚠️  Spec file not found: ${specFile}`);
      continue;
    }

    let content = fs.readFileSync(specFile, 'utf8');
    let updatedCount = 0;

    for (const [specTitle, caseId] of Object.entries(newCaseMap)) {
      // Match test titles with placeholder [C00] or existing [Cxxx]
      const escapedTitle = specTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\[C\\d+\\](\\s*${escapedTitle})`, 'g');
      const replacement = `[C${caseId}]$1`;

      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      fs.writeFileSync(specFile, content, 'utf8');
      console.log(`   ✅ Updated ${updatedCount} case IDs in ${path.basename(specFile)}`);
    } else {
      console.log(`   ℹ️  No placeholder IDs to update in ${path.basename(specFile)}`);
    }
  }

  console.log('\n🎉 Experian TestRail push complete!');
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
