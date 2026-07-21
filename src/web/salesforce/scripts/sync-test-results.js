/**
 * TestRail and JIRA Results Sync Script
 * Syncs Playwright test execution results to TestRail and updates JIRA stories
 */

require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration from .env
const TESTRAIL_URL = process.env.TESTRAIL_URL;
const TESTRAIL_EMAIL = process.env.TESTRAIL_EMAIL;
const TESTRAIL_API_KEY = process.env.TESTRAIL_API_KEY;
const TESTRAIL_PROJECT_ID = process.env.TESTRAIL_PROJECT_ID || '1';
const TESTRAIL_SUITE_ID = process.env.TESTRAIL_SUITE_ID || '1';

const JIRA_URL = process.env.JIRA_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'DZ';

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
 * Make HTTPS request to JIRA API
 */
function makeJiraRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
    const url = new URL(`/rest/api/3/${endpoint}`, JIRA_URL);
    
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
          reject(new Error(`JIRA API Error: ${res.statusCode} - ${responseData}`));
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
 * Parse Playwright JSON report
 */
function parsePlaywrightReport(reportPath) {
  try {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const results = [];
    
    for (const suite of report.suites || []) {
      for (const spec of suite.specs || []) {
        const title = spec.title;
        
        // Extract case ID from title like [C001][AC1]
        const match = title.match(/\[C(\d+)\]\[AC(\d+)\]/);
        if (match) {
          const caseId = `C${match[1]}`;
          const status = spec.tests?.[0]?.results?.[0]?.status || 'skipped';
          const duration = spec.tests?.[0]?.results?.[0]?.duration || 0;
          const error = spec.tests?.[0]?.results?.[0]?.error?.message || '';
          
          results.push({
            caseId,
            title: title.replace(/\[C\d+\]\[AC\d+\]\s*/, ''),
            status,
            duration,
            error
          });
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error parsing Playwright report:', error.message);
    return [];
  }
}

/**
 * Create test run in TestRail
 */
async function createTestRun(name, description) {
  console.log('\n📋 Creating TestRail Test Run...');
  
  const runData = {
    suite_id: parseInt(TESTRAIL_SUITE_ID),
    name: name,
    description: description,
    include_all: false,
    case_ids: [] // Will be populated with test case IDs
  };
  
  // Load TestRail mapping to get case IDs
  const mappingPath = path.join(__dirname, '..', 'testrail-mapping.json');
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  runData.case_ids = mapping.map(tc => tc.testRailId);
  
  try {
    const result = await makeTestRailRequest(
      'POST',
      `add_run/${TESTRAIL_PROJECT_ID}`,
      runData
    );
    
    console.log(`   ✅ Test Run Created: ${result.id} - ${result.name}`);
    console.log(`   🔗 ${TESTRAIL_URL}/index.php?/runs/view/${result.id}`);
    
    return result.id;
  } catch (error) {
    console.error(`   ❌ Error creating test run: ${error.message}`);
    throw error;
  }
}

/**
 * Map Playwright status to TestRail status
 */
function mapStatusToTestRail(playwrightStatus) {
  const statusMap = {
    'passed': 1,    // Passed
    'failed': 5,    // Failed
    'skipped': 3,   // Untested
    'timedOut': 5   // Failed
  };
  
  return statusMap[playwrightStatus] || 3;
}

/**
 * Add test results to TestRail run
 */
async function addTestResults(runId, testResults, testRailMapping) {
  console.log('\n📊 Adding Test Results to TestRail...\n');
  
  const results = [];
  
  for (const testResult of testResults) {
    const mapping = testRailMapping.find(m => m.caseId === testResult.caseId);
    if (!mapping) {
      console.warn(`   ⚠️  No mapping found for ${testResult.caseId}`);
      continue;
    }
    
    const resultData = {
      case_id: mapping.testRailId,
      status_id: mapStatusToTestRail(testResult.status),
      comment: testResult.error ? `❌ Error: ${testResult.error}` : '✅ Test passed successfully',
      elapsed: `${Math.round(testResult.duration / 1000)}s`,
      version: '1.0.0'
    };
    
    results.push(resultData);
    
    console.log(`   ${testResult.status === 'passed' ? '✅' : '❌'} ${testResult.caseId}: ${testResult.title} (${resultData.elapsed})`);
  }
  
  try {
    const response = await makeTestRailRequest(
      'POST',
      `add_results_for_cases/${runId}`,
      { results }
    );
    
    console.log(`\n   ✅ ${results.length} results added to TestRail`);
    return response;
  } catch (error) {
    console.error(`   ❌ Error adding results: ${error.message}`);
    throw error;
  }
}

/**
 * Update JIRA story with test execution summary
 */
async function updateJiraStory(jiraKey, testResults, scenarioId) {
  console.log(`\n🔄 Updating JIRA story ${jiraKey}...`);
  
  const scenarioResults = testResults.filter(tr => {
    // Determine scenario from case ID range
    const caseNum = parseInt(tr.caseId.substring(1));
    if (scenarioId === 'S1') return caseNum >= 1 && caseNum <= 4;
    if (scenarioId === 'S2') return caseNum >= 5 && caseNum <= 9;
    if (scenarioId === 'S3') return caseNum >= 10 && caseNum <= 13;
    if (scenarioId === 'S4') return caseNum >= 14 && caseNum <= 20;
    return false;
  });
  
  const passed = scenarioResults.filter(r => r.status === 'passed').length;
  const failed = scenarioResults.filter(r => r.status === 'failed').length;
  const total = scenarioResults.length;
  
  const commentText = `*Test Execution Summary*\n\n` +
    `✅ Passed: ${passed}/${total}\n` +
    `❌ Failed: ${failed}/${total}\n` +
    `📊 Success Rate: ${Math.round((passed / total) * 100)}%\n\n` +
    `_Automated test execution completed on ${new Date().toLocaleString()}_`;
  
  try {
    await makeJiraRequest(
      'POST',
      `issue/${jiraKey}/comment`,
      {
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: commentText.replace(/\*/g, '').replace(/_/g, '')
                }
              ]
            }
          ]
        }
      }
    );
    
    console.log(`   ✅ Comment added to ${jiraKey}`);
    
    // Update story status if all tests passed
    if (failed === 0 && total > 0) {
      console.log(`   ℹ️  All tests passed! Consider updating story status to Done`);
    }
    
  } catch (error) {
    console.error(`   ❌ Error updating JIRA: ${error.message}`);
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Syncing Playwright Test Results to TestRail and JIRA\n');
  
  // Check for Playwright report
  const reportPath = path.join(__dirname, '..', '..', '..', '..', 'playwright-report', 'report.json');
  
  if (!fs.existsSync(reportPath)) {
    console.error('❌ Playwright report not found at:', reportPath);
    console.log('\n💡 Run tests first:');
    console.log('   npx playwright test src/web/salesforce/tests --reporter=json');
    process.exit(1);
  }
  
  console.log('📄 Parsing Playwright test results...');
  const testResults = parsePlaywrightReport(reportPath);
  
  if (testResults.length === 0) {
    console.error('❌ No test results found in report');
    process.exit(1);
  }
  
  console.log(`   ✅ Found ${testResults.length} test results`);
  
  // Load mappings
  const testRailMappingPath = path.join(__dirname, '..', 'testrail-mapping.json');
  const testRailMapping = JSON.parse(fs.readFileSync(testRailMappingPath, 'utf8'));
  
  const jiraMappingPath = path.join(__dirname, '..', 'jira-mapping.json');
  const jiraMapping = JSON.parse(fs.readFileSync(jiraMappingPath, 'utf8'));
  
  // Create test run in TestRail
  const runName = `Salesforce Automation - ${new Date().toLocaleDateString()}`;
  const runDescription = `Automated test execution for Salesforce Lightning - Lead Conversion, Quote Validation, and Approval Processes`;
  
  const runId = await createTestRun(runName, runDescription);
  
  // Add results to TestRail
  await addTestResults(runId, testResults, testRailMapping);
  
  // Update JIRA stories with results
  console.log('\n📝 Updating JIRA Stories...');
  for (const jiraStory of jiraMapping) {
    await updateJiraStory(jiraStory.jiraKey, testResults, jiraStory.scenarioId);
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
  }
  
  // Print final summary
  const passed = testResults.filter(r => r.status === 'passed').length;
  const failed = testResults.filter(r => r.status === 'failed').length;
  
  console.log('\n\n✅ Sync Complete!\n');
  console.log('📊 Overall Summary:');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log(`   Total Tests: ${testResults.length}`);
  console.log(`   ✅ Passed: ${passed} (${Math.round((passed / testResults.length) * 100)}%)`);
  console.log(`   ❌ Failed: ${failed} (${Math.round((failed / testResults.length) * 100)}%)`);
  console.log(`\n   🔗 TestRail Run: ${TESTRAIL_URL}/index.php?/runs/view/${runId}`);
  console.log(`   🔗 JIRA Project: ${JIRA_URL}/browse/${JIRA_PROJECT_KEY}`);
  console.log('\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Sync failed:', error);
  process.exit(1);
});
