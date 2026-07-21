/**
 * Verify and Update JIRA Links in TestRail Cases
 * This script checks if TestRail cases have proper JIRA references and updates them if missing
 */

require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

// TestRail Configuration
const TESTRAIL_URL = process.env.TESTRAIL_URL;
const TESTRAIL_EMAIL = process.env.TESTRAIL_EMAIL;
const TESTRAIL_API_KEY = process.env.TESTRAIL_API_KEY;
const TESTRAIL_PROJECT_ID = process.env.TESTRAIL_PROJECT_ID || '1';
const TESTRAIL_SUITE_ID = process.env.TESTRAIL_SUITE_ID || '1';
const TESTRAIL_SECTION_ID = process.env.TESTRAIL_SECTION_ID || '9';

/**
 * Make HTTPS request to TestRail API
 */
function makeTestRailRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${TESTRAIL_EMAIL}:${TESTRAIL_API_KEY}`).toString('base64');
    const url = new URL(`/index.php?/api/v2/${endpoint}`, TESTRAIL_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0'
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(responseData);
            resolve(parsed);
          } catch (error) {
            resolve(responseData);
          }
        } else {
          reject(new Error(`TestRail API Error: ${res.statusCode} - ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Get a specific test case from TestRail
 */
async function getTestCase(caseId) {
  try {
    const result = await makeTestRailRequest('GET', `get_case/${caseId}`);
    return result;
  } catch (error) {
    console.error(`   ❌ Error getting case ${caseId}: ${error.message}`);
    return null;
  }
}

/**
 * Update a test case in TestRail
 */
async function updateTestCase(caseId, updateData) {
  try {
    const result = await makeTestRailRequest('POST', `update_case/${caseId}`, updateData);
    return result;
  } catch (error) {
    console.error(`   ❌ Error updating case ${caseId}: ${error.message}`);
    throw error;
  }
}

/**
 * Main verification and update function
 */
async function main() {
  console.log('🔍 Verifying JIRA Links in TestRail Cases\n');
  console.log('📋 Configuration:');
  console.log(`   TestRail URL: ${TESTRAIL_URL}`);
  console.log(`   TestRail Project: ${TESTRAIL_PROJECT_ID}`);
  console.log(`   TestRail Suite: ${TESTRAIL_SUITE_ID}`);
  console.log(`   TestRail Section: ${TESTRAIL_SECTION_ID}\n`);

  // Load TestRail mapping
  const mappingPath = path.join(__dirname, '..', 'testrail-mapping.json');
  if (!fs.existsSync(mappingPath)) {
    console.error('❌ TestRail mapping file not found:', mappingPath);
    process.exit(1);
  }

  const testRailMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  console.log(`📊 Found ${testRailMapping.length} test cases in mapping\n`);

  const results = {
    total: testRailMapping.length,
    verified: 0,
    updated: 0,
    alreadyLinked: 0,
    errors: []
  };

  for (const testCase of testRailMapping) {
    console.log(`\n🔍 Checking ${testCase.caseId} (TestRail ID: ${testCase.testRailId})`);
    console.log(`   Expected JIRA Link: ${testCase.jiraKey}`);

    // Get current case data from TestRail
    const currentCase = await getTestCase(testCase.testRailId);
    
    if (!currentCase) {
      results.errors.push({
        caseId: testCase.caseId,
        testRailId: testCase.testRailId,
        error: 'Could not retrieve case from TestRail'
      });
      continue;
    }

    results.verified++;

    // Check if JIRA reference exists
    const currentRefs = currentCase.refs || '';
    console.log(`   Current refs field: "${currentRefs}"`);

    if (currentRefs.includes(testCase.jiraKey)) {
      console.log(`   ✅ JIRA link already exists`);
      results.alreadyLinked++;
    } else {
      console.log(`   🔄 Updating JIRA reference...`);
      
      try {
        // Update the refs field
        const updateData = {
          refs: testCase.jiraKey
        };

        await updateTestCase(testCase.testRailId, updateData);
        console.log(`   ✅ Updated refs field with ${testCase.jiraKey}`);
        results.updated++;
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`   ❌ Failed to update: ${error.message}`);
        results.errors.push({
          caseId: testCase.caseId,
          testRailId: testCase.testRailId,
          jiraKey: testCase.jiraKey,
          error: error.message
        });
      }
    }
  }

  // Print summary
  console.log('\n\n═══════════════════════════════════════════════════════════════════════════════');
  console.log('📊 Verification & Update Summary\n');
  console.log(`   Total Cases: ${results.total}`);
  console.log(`   ✅ Verified: ${results.verified}`);
  console.log(`   🔗 Already Linked: ${results.alreadyLinked}`);
  console.log(`   🔄 Updated: ${results.updated}`);
  console.log(`   ❌ Errors: ${results.errors.length}\n`);

  if (results.errors.length > 0) {
    console.log('⚠️  Errors encountered:\n');
    results.errors.forEach(err => {
      console.log(`   ${err.caseId} (ID: ${err.testRailId}): ${err.error}`);
    });
    console.log('');
  }

  if (results.updated > 0) {
    console.log('✅ JIRA links have been updated in TestRail!');
    console.log(`   View cases at: ${TESTRAIL_URL}/index.php?/suites/view/${TESTRAIL_SUITE_ID}&group_by=cases:section_id&group_order=asc&group_id=${TESTRAIL_SECTION_ID}\n`);
  } else if (results.alreadyLinked === results.verified) {
    console.log('✅ All test cases already have correct JIRA links!\n');
  }

  // Show JIRA story links
  console.log('📝 JIRA Stories:\n');
  const jiraStories = [...new Set(testRailMapping.map(tc => tc.jiraKey))];
  jiraStories.forEach(jiraKey => {
    const casesForStory = testRailMapping.filter(tc => tc.jiraKey === jiraKey);
    console.log(`   ${jiraKey}: ${casesForStory.length} test cases`);
    console.log(`      https://aavademo.atlassian.net/browse/${jiraKey}`);
  });
  console.log('');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
});
