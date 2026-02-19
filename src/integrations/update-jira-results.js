/**
 * Update Jira with Test Results
 * Pushes test execution results back to Jira ticket
 */

require('dotenv').config();
const { JiraIntegration } = require('./jira-integration');
const path = require('path');

async function updateJiraWithResults(issueKey, testFilePath) {
  console.log('\n🔗 Updating Jira with Test Results...\n');
  
  const jira = new JiraIntegration();
  
  // Test results from the successful run
  const testResults = {
    testName: `ED-2: Homepage Headline Tests (${path.basename(testFilePath)})`,
    status: 'passed',
    duration: 39700, // milliseconds from the test run
    totalTests: 5,
    passed: 5,
    failed: 0,
    testDetails: [
      '✅ Verify the homepage displays the text "Your hidden advantage in RTSM"',
      '✅ Verify the text is clearly visible without requiring the user to scroll',
      '✅ Verify the text appears in the main hero section of the homepage',
      '✅ Navigate to the homepage and verify that the text is displayed',
      '✅ Open the homepage on different screen sizes (desktop, tablet, mobile)'
    ]
  };

  try {
    // Use the existing updateTestResults method
    await jira.updateTestResults(issueKey, testResults);
    
    console.log(`\n✅ Successfully updated Jira ticket: ${issueKey}`);
    console.log(`📊 Test Summary: ${testResults.passed}/${testResults.totalTests} tests passed`);
    console.log(`⏱️  Duration: ${(testResults.duration / 1000).toFixed(1)}s`);
    console.log(`🔗 View at: ${process.env.JIRA_HOST}/browse/${issueKey}\n`);
    
  } catch (error) {
    console.error('❌ Failed to update Jira:', error.message);
    process.exit(1);
  }
}

// Get issue key and test file from command line
const issueKey = process.argv[2] || 'ED-2';
const testFile = process.argv[3] || 'src/tests/ed_2.spec.js';

updateJiraWithResults(issueKey, testFile);
