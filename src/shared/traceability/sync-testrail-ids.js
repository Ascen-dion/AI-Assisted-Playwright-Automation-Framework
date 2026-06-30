/**
 * Sync TestRail IDs from actual TestRail cases to spec files
 * 
 * This script:
 * 1. Fetches all cases from TestRail Section 51
 * 2. Matches them by title to the expected test cases
 * 3. Creates an ID mapping (old → new)
 * 4. Updates spec files with the correct TestRail IDs
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const TESTRAIL_HOST = process.env.TESTRAIL_HOST;
const TESTRAIL_USER = process.env.TESTRAIL_USER;
const TESTRAIL_API_KEY = process.env.TESTRAIL_API_KEY;
const PROJECT_ID = parseInt(process.env.TESTRAIL_PROJECT_ID, 10);
const SUITE_ID = parseInt(process.env.TESTRAIL_SUITE_ID, 10);
const SECTION_ID = parseInt(process.env.TESTRAIL_SECTION_ID, 10);

const testrail = axios.create({
  baseURL: `${TESTRAIL_HOST}/index.php?/api/v2`,
  auth: { username: TESTRAIL_USER, password: TESTRAIL_API_KEY },
  headers: { 'Content-Type': 'application/json' }
});

// Load the mapping file
const mappingPath = path.resolve(__dirname, 'medtronic-jira-testrail-map.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Flatten all test cases
const expectedCases = [];
mapping.forEach(story => {
  story.testCases.forEach(tc => {
    expectedCases.push({
      title: tc.specTitle,
      oldCaseId: tc.caseId,
      jiraKey: story.jiraKey,
    });
  });
});

async function getTestRailCases() {
  try {
    const url = `/get_cases/${PROJECT_ID}&suite_id=${SUITE_ID}&section_id=${SECTION_ID}`;
    const response = await testrail.get(url);
    return response.data.cases || response.data || [];
  } catch (error) {
    console.error('❌ Failed to fetch TestRail cases:', error.response?.data?.error || error.message);
    return [];
  }
}

async function updateTestCase(caseId, jiraKey) {
  try {
    await testrail.post(`/update_case/${caseId}`, { refs: jiraKey });
    return true;
  } catch (error) {
    console.error(`   ⚠️  Failed to update C${caseId}:`, error.response?.data?.error || error.message);
    return false;
  }
}

async function main() {
  console.log('\n🔄 Syncing TestRail IDs...\n');
  
  // Get all existing cases from TestRail
  console.log('📥 Fetching existing TestRail cases...');
  const trCases = await getTestRailCases();
  console.log(`   Found ${trCases.length} cases in TestRail\n`);

  // Create a map by title
  const trByTitle = new Map();
  trCases.forEach(c => trByTitle.set(c.title, c));

  // Build ID mapping
  const idMapping = {}; // old ID → new ID
  const titleToNewId = {}; // title → new ID
  let matched = 0;
  let unmatched = 0;
  let updated = 0;

  console.log('🔍 Matching test cases by title...\n');

  for (const expected of expectedCases) {
    const trCase = trByTitle.get(expected.title);
    
    if (trCase) {
      const newId = `C${trCase.id}`;
      idMapping[expected.oldCaseId] = newId;
      titleToNewId[expected.title] = newId;
      console.log(`   ✓  ${expected.oldCaseId} → ${newId}: ${expected.title.substring(0, 60)}...`);
      matched++;

      // Update JIRA reference in TestRail if not already set
      if (!trCase.refs || !trCase.refs.includes(expected.jiraKey)) {
        const success = await updateTestCase(trCase.id, expected.jiraKey);
        if (success) {
          updated++;
        }
      }
    } else {
      console.log(`   ✗  ${expected.oldCaseId} NOT FOUND: ${expected.title.substring(0, 60)}...`);
      unmatched++;
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log('MATCHING SUMMARY');
  console.log('═'.repeat(70));
  console.log(`   ✅ Matched:   ${matched}`);
  console.log(`   ❌ Unmatched: ${unmatched}`);
  console.log(`   🔗 Updated JIRA refs: ${updated}`);
  console.log('');

  if (unmatched > 0) {
    console.error('❌ Some test cases could not be matched!');
    console.error('   Check that the test titles in spec files match TestRail exactly.');
    console.error('');
    return;
  }

  // Save the ID mapping
  const idMappingPath = path.resolve(__dirname, 'testrail-case-id-mapping.json');
  fs.writeFileSync(idMappingPath, JSON.stringify(idMapping, null, 2), 'utf8');
  console.log(`💾 ID mapping saved to: ${idMappingPath}\n`);

  // Update the medtronic-jira-testrail-map.json file
  console.log('📝 Updating medtronic-jira-testrail-map.json...');
  mapping.forEach(story => {
    story.testCases.forEach(tc => {
      if (idMapping[tc.caseId]) {
        tc.caseId = idMapping[tc.caseId];
      }
    });
  });
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8');
  console.log('   ✅ Updated medtronic-jira-testrail-map.json\n');

  // Now update spec files
  console.log('📝 Updating spec files with new TestRail IDs...\n');

  const specFiles = [
    'src/web/tests/nav/medtronic-homepage.spec.js',
    'src/web/tests/nav/medtronic-footer.spec.js',
    'src/web/tests/nav/medtronic-hcp.spec.js',
    'src/web/tests/nav/medtronic-our-company.spec.js',
    'src/web/tests/nav/medtronic-our-impact.spec.js',
    'src/web/tests/nav/medtronic-patients.spec.js',
  ];

  let filesUpdated = 0;

  for (const specFile of specFiles) {
    const fullPath = path.resolve(__dirname, '../../../', specFile);
    if (!fs.existsSync(fullPath)) {
      console.log(`   ⚠️  File not found: ${specFile}`);
      continue;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // Replace all [Cxx] patterns with new IDs
    for (const [oldId, newId] of Object.entries(idMapping)) {
      const regex = new RegExp(`\\[${oldId}\\]`, 'g');
      if (content.includes(`[${oldId}]`)) {
        content = content.replace(regex, `[${newId}]`);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`   ✅ Updated ${specFile}`);
      filesUpdated++;
    } else {
      console.log(`   ⏭️  No changes needed: ${specFile}`);
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log('SYNC COMPLETE');
  console.log('═'.repeat(70));
  console.log(`   Spec files updated: ${filesUpdated}`);
  console.log(`   Test cases synced:  ${matched}`);
  console.log('');
  console.log('✅ All TestRail IDs are now in sync!');
  console.log('');
}

main().catch(err => {
  console.error('❌ Unhandled error:', err.message);
  process.exit(1);
});
