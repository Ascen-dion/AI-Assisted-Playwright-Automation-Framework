/**
 * Report Salesforce Test Results to TestRail
 * 
 * This script reads the Playwright test results and reports them to TestRail,
 * updating the test cases with pass/fail status and attaching screenshots for failures.
 * 
 * Usage: node scripts/report-salesforce-to-testrail.js [test-results-path]
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// TestRail Configuration
const TESTRAIL_HOST = process.env.TESTRAIL_HOST;
const TESTRAIL_USER = process.env.TESTRAIL_USER;
const TESTRAIL_API_KEY = process.env.TESTRAIL_API_KEY;
const TESTRAIL_PROJECT_ID = process.env.TESTRAIL_PROJECT_ID;

// TestRail API client
const testrailClient = axios.create({
  baseURL: `${TESTRAIL_HOST}/index.php?/api/v2`,
  auth: {
    username: TESTRAIL_USER,
    password: TESTRAIL_API_KEY,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Create a test run in TestRail
 */
async function createTestRun(name, description) {
  try {
    const response = await testrailClient.post(`/add_run/${TESTRAIL_PROJECT_ID}`, {
      suite_id: process.env.TESTRAIL_SUITE_ID,
      name: name,
      description: description,
      include_all: false,
    });
    
    console.log(`✅ Created Test Run: ${response.data.name} (ID: ${response.data.id})`);
    return response.data.id;
  } catch (error) {
    console.error('❌ Failed to create test run:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Extract TestRail case ID from test title
 * Example: "[C005] Valid data - all fields correct" → "C005"
 */
function extractCaseId(testTitle) {
  const match = testTitle.match(/\[([A-Z0-9-]+)\]/);
  return match ? match[1] : null;
}

/**
 * Get TestRail case ID by custom test ID
 */
async function getTestRailCaseId(customTestId) {
  try {
    const response = await testrailClient.get(
      `/get_cases/${TESTRAIL_PROJECT_ID}&suite_id=${process.env.TESTRAIL_SUITE_ID}`
    );
    
    const testCase = response.data.find(tc => tc.title.includes(`[${customTestId}]`));
    return testCase ? testCase.id : null;
  } catch (error) {
    console.error(`❌ Failed to get case ID for ${customTestId}:`, error.message);
    return null;
  }
}

/**
 * Add test result to TestRail
 */
async function addTestResult(runId, caseId, status, comment, elapsed) {
  try {
    const statusId = status === 'passed' ? 1 : status === 'failed' ? 5 : 3; // 1=Passed, 5=Failed, 3=Retest
    
    const response = await testrailClient.post(`/add_result_for_case/${runId}/${caseId}`, {
      status_id: statusId,
      comment: comment,
      elapsed: elapsed ? `${Math.round(elapsed / 1000)}s` : null,
    });
    
    console.log(`  ✅ Reported Case C${caseId}: ${status.toUpperCase()}`);
    return response.data;
  } catch (error) {
    console.error(`  ❌ Failed to report Case C${caseId}:`, error.response?.data || error.message);
    return null;
  }
}

/**
 * Parse Playwright test results
 */
function parsePlaywrightResults(resultsPath) {
  const resultsFile = path.join(resultsPath, 'results.json');
  
  if (!fs.existsSync(resultsFile)) {
    console.error(`❌ Results file not found: ${resultsFile}`);
    process.exit(1);
  }

  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
  
  const testResults = [];
  results.suites.forEach(suite => {
    suite.specs.forEach(spec => {
      spec.tests.forEach(test => {
        testResults.push({
          title: test.title,
          status: test.status,
          duration: test.results[0]?.duration || 0,
          error: test.results[0]?.error?.message || '',
        });
      });
    });
  });

  return testResults;
}

/**
 * Main function
 */
async function main() {
  const resultsPath = process.argv[2] || path.join(__dirname, '../test-results');
  
  console.log('🚀 Reporting Salesforce Test Results to TestRail...\n');
  console.log(`📁 Results Path: ${resultsPath}`);
  console.log(`🎯 TestRail: ${TESTRAIL_HOST}\n`);

  // Verify environment variables
  if (!TESTRAIL_HOST || !TESTRAIL_USER || !TESTRAIL_API_KEY) {
    console.error('❌ ERROR: TestRail credentials not found in .env file');
    process.exit(1);
  }

  // Parse test results
  const testResults = parsePlaywrightResults(resultsPath);
  console.log(`📋 Found ${testResults.length} test results\n`);

  // Create test run
  const runName = `Salesforce Quote Validation - ${new Date().toISOString().split('T')[0]}`;
  const runDescription = `Automated test execution for JIRA story DZ-1\nTotal Tests: ${testResults.length}`;
  const runId = await createTestRun(runName, runDescription);

  console.log('\n📊 Reporting Results:\n');

  // Report each test result
  const reportedResults = [];
  for (const result of testResults) {
    const customTestId = extractCaseId(result.title);
    if (!customTestId) {
      console.log(`  ⚠️  Skipping test (no case ID): ${result.title}`);
      continue;
    }

    console.log(`  📝 [${customTestId}] ${result.title}`);
    
    // Get TestRail case ID
    const caseId = await getTestRailCaseId(customTestId);
    if (!caseId) {
      console.log(`    ⚠️  Case not found in TestRail, skipping...`);
      continue;
    }

    // Add result
    const comment = result.status === 'failed' 
      ? `Automated test failed:\n\n${result.error}`
      : 'Automated test passed successfully';
    
    const reported = await addTestResult(runId, caseId, result.status, comment, result.duration);
    reportedResults.push(reported);

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${testResults.length}`);
  console.log(`Reported to TestRail: ${reportedResults.filter(r => r !== null).length}`);
  console.log(`Failed to Report: ${reportedResults.filter(r => r === null).length}`);
  console.log(`\n🔗 View Test Run: ${TESTRAIL_HOST}/index.php?/runs/view/${runId}`);
  console.log('='.repeat(60));
}

// Run
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
