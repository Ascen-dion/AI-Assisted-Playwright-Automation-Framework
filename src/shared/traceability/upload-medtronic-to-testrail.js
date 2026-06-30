/**
 * Create/Upload Medtronic Test Cases to TestRail
 * 
 * This script creates all Medtronic test cases in TestRail if they don't exist.
 * Note: TestRail auto-assigns case IDs, so the IDs may differ from the [C##] in test titles.
 * After running this script, you may need to update the test spec files with the new IDs.
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

// Verify credentials
if (!TESTRAIL_HOST || !TESTRAIL_USER || !TESTRAIL_API_KEY) {
  console.error('❌ TestRail credentials not configured in .env');
  console.error('   Required: TESTRAIL_HOST, TESTRAIL_USER, TESTRAIL_API_KEY');
  process.exit(1);
}

// Create axios instance with proper auth
const testrail = axios.create({
  baseURL: `${TESTRAIL_HOST}/index.php?/api/v2`,
  auth: {
    username: TESTRAIL_USER,
    password: TESTRAIL_API_KEY
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

// Load the JIRA-TestRail mapping
const mappingPath = path.resolve(__dirname, 'medtronic-jira-testrail-map.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Flatten all test cases
const testCases = [];
mapping.forEach(story => {
  story.testCases.forEach(tc => {
    // Extract steps from test file comments if available
    const steps = `1. Navigate to the Medtronic India website
2. Execute test scenario as described in title
3. Verify expected results`;

    const expected = `All assertions pass as described in test case title`;

    testCases.push({
      title: tc.specTitle,
      currentCaseId: tc.caseId,
      jiraKey: story.jiraKey,
      type_id: 1, // Automated
      priority_id: story.labels.includes('smoke') ? 3 : 2, // High for smoke, Medium otherwise
      estimate: '5m',
      refs: story.jiraKey,
      custom_automation_type: 1, // Playwright
      custom_steps: steps,
      custom_expected: expected,
      custom_preconds: 'User has access to https://www.medtronic.com/in-en/',
    });
  });
});

async function testConnection() {
  try {
    console.log('\n🔌 Testing TestRail connection...');
    const response = await testrail.get(`/get_projects`);
    console.log(`   ✅ Connected to TestRail successfully`);
    return true;
  } catch (error) {
    console.error('   ❌ Connection failed:', error.response?.data?.error || error.message);
    console.error('   Check your TESTRAIL_HOST, TESTRAIL_USER, and TESTRAIL_API_KEY in .env');
    return false;
  }
}

async function getExistingCases() {
  try {
    const url = `/get_cases/${PROJECT_ID}&suite_id=${SUITE_ID}&section_id=${SECTION_ID}`;
    const response = await testrail.get(url);
    return response.data.cases || response.data || [];
  } catch (error) {
    console.error('⚠️  Could not fetch existing cases:', error.response?.data?.error || error.message);
    return [];
  }
}

async function createTestCase(testCase) {
  try {
    // Create in the specified section
    const response = await testrail.post(`/add_case/${SECTION_ID}`, testCase);
    return response.data;
  } catch (error) {
    console.error(`   ❌ Failed to create case: ${error.response?.data?.error || error.message}`);
    throw error;
  }
}

async function main() {
  console.log('\n📤 Uploading Medtronic Test Cases to TestRail...\n');
  console.log(`   TestRail Host: ${TESTRAIL_HOST}`);
  console.log(`   Project ID: ${PROJECT_ID}`);
  console.log(`   Suite ID: ${SUITE_ID}`);
  console.log(`   Section ID: ${SECTION_ID}`);
  console.log(`   Total Test Cases: ${testCases.length}\n`);

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('\n❌ Cannot proceed without valid TestRail connection.');
    console.error('   Please verify your credentials in .env file:\n');
    console.error(`   TESTRAIL_HOST=${TESTRAIL_HOST}`);
    console.error(`   TESTRAIL_USER=${TESTRAIL_USER}`);
    console.error(`   TESTRAIL_API_KEY=***\n`);
    process.exit(1);
  }

  // Get existing cases
  console.log('\n📥 Fetching existing TestRail cases...');
  const existingCases = await getExistingCases();
  console.log(`   Found ${existingCases.length} existing cases in section ${SECTION_ID}\n`);

  // Create a map of existing case titles
  const existingTitlesMap = new Map();
  existingCases.forEach(c => {
    existingTitlesMap.set(c.title, c);
  });

  let created = 0;
  let skipped = 0;
  let errors = 0;

  const caseIdMapping = {}; // Map old IDs to new IDs

  console.log('🚀 Creating test cases...\n');

  for (const tc of testCases) {
    try {
      if (existingTitlesMap.has(tc.title)) {
        const existing = existingTitlesMap.get(tc.title);
        console.log(`   ⏭️  Already exists: [C${existing.id}] ${tc.title}`);
        caseIdMapping[tc.currentCaseId] = `C${existing.id}`;
        skipped++;
      } else {
        const createdCase = await createTestCase(tc);
        console.log(`   ✅ Created: [C${createdCase.id}] ${tc.title}`);
        caseIdMapping[tc.currentCaseId] = `C${createdCase.id}`;
        created++;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`   ❌ Error: ${tc.title}`);
      errors++;
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('📊 UPLOAD SUMMARY');
  console.log('═'.repeat(70));
  console.log(`   ✅ Created:          ${created}`);
  console.log(`   ⏭️  Already existed:  ${skipped}`);
  console.log(`   ❌ Errors:           ${errors}`);
  console.log(`   📝 Total Processed:  ${testCases.length}`);
  console.log('');

  // Save ID mapping
  const mappingFilePath = path.resolve(__dirname, 'testrail-case-id-mapping.json');
  fs.writeFileSync(mappingFilePath, JSON.stringify(caseIdMapping, null, 2), 'utf8');
  console.log(`💾 Case ID mapping saved to: ${mappingFilePath}`);
  console.log('');

  if (created > 0) {
    console.log('⚠️  Important: TestRail auto-assigned new case IDs.');
    console.log('   You may need to update the test spec files with the new IDs.');
    console.log('   Check the mapping file above for the old → new ID mapping.');
    console.log('');
  }

  if (errors === 0 && (created + skipped) === testCases.length) {
    console.log('✅ All test cases are now in TestRail!');
    console.log('');
  }
}

main().catch(err => {
  console.error('❌ Unhandled error:', err.message);
  if (err.response?.data) {
    console.error('   TestRail API response:', JSON.stringify(err.response.data, null, 2));
  }
  process.exit(1);
});
