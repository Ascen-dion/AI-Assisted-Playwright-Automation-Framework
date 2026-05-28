/**
 * Push all Medtronic India test cases to TestRail.
 *
 * Usage:
 *   node src/shared/traceability/push-medtronic-to-testrail.js
 *
 * Reads all 32 Medtronic test case definitions from
 * medtronic-testrail-test-cases.json, pushes them to the configured
 * TestRail section, updates the case map, and embeds real [Cxxx] IDs
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

// Load all Medtronic test case definitions (32 cases)
const TEST_CASES = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'medtronic-testrail-test-cases.json'), 'utf8')
);

// All Medtronic spec files to update with real case IDs
const SPEC_FILES = [
  path.resolve(__dirname, '../../web/tests/nav/medtronic-homepage.spec.js'),
  path.resolve(__dirname, '../../web/tests/nav/medtronic-patients.spec.js'),
  path.resolve(__dirname, '../../web/tests/nav/medtronic-our-company.spec.js'),
  path.resolve(__dirname, '../../web/tests/nav/medtronic-our-impact.spec.js'),
  path.resolve(__dirname, '../../web/tests/nav/medtronic-footer.spec.js'),
  path.resolve(__dirname, '../../web/tests/nav/medtronic-hcp.spec.js'),
];

async function main() {
  const testrail = new TestRailIntegration();

  console.log(`\n🚀 Pushing ${TEST_CASES.length} Medtronic test cases to TestRail...`);
  console.log(`   Project: ${PROJECT_ID}  |  Suite: ${SUITE_ID}  |  Section: ${SECTION_ID || '(suite root)'}\n`);

  // Load existing case map (preserve non-Medtronic entries)
  const mapPath = path.resolve(__dirname, 'testrail-case-map.json');
  let existingMap = { sectionId: SECTION_ID, cases: {} };
  if (fs.existsSync(mapPath)) {
    existingMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  }

  const newCaseMap = {};  // specTitle → TestRail case ID (Medtronic only)
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

  // Merge new Medtronic cases into existing map (preserves UD cases)
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
      console.log(`   ⚠️  Spec not found: ${specFile}`);
      continue;
    }

    let content = fs.readFileSync(specFile, 'utf8');
    let replacements = 0;

    for (const [specTitle, caseId] of Object.entries(newCaseMap)) {
      // Match test titles like: '[C0] Test Case N: ...'
      // Replace [C0] with [C<real_id>]
      const escapedTitle = specTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\[C0\\]\\s*${escapedTitle}`, 'g');
      const replacement = `[C${caseId}] ${specTitle}`;

      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        replacements++;
      }
    }

    if (replacements > 0) {
      fs.writeFileSync(specFile, content, 'utf8');
      console.log(`   ✅ Updated ${replacements} test title(s) in ${path.basename(specFile)}`);
    } else {
      console.log(`   ℹ️  No [C0] placeholders found in ${path.basename(specFile)} (already updated?)`);
    }
  }

  // ── Print summary ────────────────────────────────────────────────────────
  console.log('\n📋 Medtronic TestRail case IDs:');
  for (const [specTitle, caseId] of Object.entries(newCaseMap)) {
    console.log(`   C${caseId}  →  ${specTitle}`);
  }
  console.log('');
}

main().catch(err => {
  console.error('❌ Unhandled error:', err.message);
  process.exit(1);
});
