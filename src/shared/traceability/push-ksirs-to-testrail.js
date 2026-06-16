/**
 * Push Ksirs Admission Application Form test cases to TestRail.
 *
 * Usage:
 *   node src/shared/traceability/push-ksirs-to-testrail.js
 *
 * Creates a "Ksirs - Admission Application Form" section if it doesn't exist,
 * pushes 5 test cases (AC1-AC5), updates testrail-case-map.json with the
 * returned case IDs, and prints the IDs for embedding in spec titles.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const axios = require('axios');
const fs    = require('fs');
const path  = require('path');

const HOST       = process.env.TESTRAIL_HOST;
const USER       = process.env.TESTRAIL_USER;
const API_KEY    = process.env.TESTRAIL_API_KEY;
const PROJECT_ID = parseInt(process.env.TESTRAIL_PROJECT_ID, 10);
const SUITE_ID   = parseInt(process.env.TESTRAIL_SUITE_ID, 10);

if (!HOST || !USER || !API_KEY || !PROJECT_ID || !SUITE_ID) {
  console.error('❌ Missing TestRail credentials in .env');
  process.exit(1);
}

const client = axios.create({
  baseURL: `${HOST.replace(/\/$/, '')}/index.php?/api/v2`,
  auth:    { username: USER, password: API_KEY },
  headers: { 'Content-Type': 'application/json' },
});

const TEST_CASES = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'ksirs-testrail-test-cases.json'), 'utf8')
);

async function getSections() {
  const res = await client.get(`/get_sections/${PROJECT_ID}&suite_id=${SUITE_ID}`);
  return res.data.sections || res.data || [];
}

async function createSection(name) {
  const res = await client.post(`/add_section/${PROJECT_ID}`, {
    suite_id: SUITE_ID,
    name,
  });
  return res.data;
}

async function getCasesInSection(sectionId) {
  const res = await client.get(`/get_cases/${PROJECT_ID}&suite_id=${SUITE_ID}&section_id=${sectionId}`);
  return res.data.cases || res.data || [];
}

async function addCase(sectionId, tc) {
  const res = await client.post(`/add_case/${sectionId}`, {
    title:            tc.title,
    type_id:          1,      // Automated
    priority_id:      2,      // High
    custom_steps:     tc.steps,
    custom_expected:  tc.expected,
    custom_preconds:  tc.preconditions,
    refs:             tc.jiraRef || '',
  });
  return res.data;
}

async function updateCase(caseId, tc) {
  const res = await client.post(`/update_case/${caseId}`, {
    title:           tc.title,
    custom_steps:    tc.steps,
    custom_expected: tc.expected,
    custom_preconds: tc.preconditions,
    refs:            tc.jiraRef || '',
  });
  return res.data;
}

async function main() {
  console.log('\n🚀 Pushing Ksirs test cases to TestRail...\n');

  // 1. Find or create the Ksirs section
  const SECTION_NAME = 'Ksirs - Admission Application Form';
  const sections = await getSections();
  let section = sections.find(s => s.name === SECTION_NAME);
  if (!section) {
    console.log(`📁 Creating section: "${SECTION_NAME}"`);
    section = await createSection(SECTION_NAME);
    console.log(`   ✅ Section created: ID=${section.id}`);
  } else {
    console.log(`📁 Reusing existing section: "${SECTION_NAME}" (ID=${section.id})`);
  }
  const sectionId = section.id;

  // 2. Load existing case map
  const mapPath = path.resolve(__dirname, 'testrail-case-map.json');
  let caseMap   = { sectionId, cases: {} };
  if (fs.existsSync(mapPath)) {
    caseMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  }

  // 3. Get existing cases in section to avoid duplicates
  const existingCases = await getCasesInSection(sectionId);

  const resultIds = {};
  let created = 0, updated = 0, skipped = 0;

  for (const tc of TEST_CASES) {
    // Check local map first
    if (caseMap.cases[tc.specTitle]) {
      console.log(`   ⏭️  Already mapped: C${caseMap.cases[tc.specTitle]} → ${tc.specTitle}`);
      resultIds[tc.specTitle] = caseMap.cases[tc.specTitle];
      skipped++;
      continue;
    }

    // Check TestRail for matching title
    const existing = existingCases.find(c => c.title === tc.title);
    let result;
    if (existing) {
      console.log(`   🔄 Updating: C${existing.id} — ${tc.title}`);
      result = await updateCase(existing.id, tc);
      updated++;
    } else {
      console.log(`   ➕ Creating: ${tc.title}`);
      result = await addCase(sectionId, tc);
      created++;
    }

    const caseId = result.id;
    console.log(`      → C${caseId}`);
    resultIds[tc.specTitle] = caseId;
    caseMap.cases[tc.specTitle] = caseId;
  }

  // 4. Save updated case map
  caseMap.sectionId = sectionId;
  fs.writeFileSync(mapPath, JSON.stringify(caseMap, null, 2));
  console.log(`\n✅ testrail-case-map.json updated.`);
  console.log(`   📝 Created: ${created}  🔄 Updated: ${updated}  ⏭️  Skipped: ${skipped}\n`);

  // 5. Print IDs for spec embedding
  console.log('📋 Case IDs to embed in spec titles:');
  TEST_CASES.forEach(tc => {
    const id = resultIds[tc.specTitle];
    console.log(`   [C${id}] ${tc.specTitle}`);
  });
}

main().catch(err => {
  console.error('❌ Fatal error:', err.response?.data || err.message);
  process.exit(1);
});
