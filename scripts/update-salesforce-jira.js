/**
 * Update Salesforce JIRA Stories with Test Results
 * Posts test execution results to DZ-1, DZ-2, DZ-3, DZ-4
 */

require('dotenv').config();
const { JiraIntegration } = require('../src/shared/integrations/jira-integration');

async function updateSalesforceJira() {
  console.log('\n🔗 Updating Salesforce JIRA Stories with Test Results...\n');
  
  const jira = new JiraIntegration();
  
  // Test results from TestRail run 53 (2 passed / 21 failed - 44.4 minutes)
  const testResults = {
    'DZ-1': {
      testName: '[DZ-1] Scenario 1: Create a Lead and Convert to Opportunity',
      status: 'partial',
      duration: 2664000, // 44.4 minutes total run time
      totalTests: 4,
      passed: 1,
      failed: 3,
      testDetails: [
        '✅ [C001][AC1] Should create a new Lead successfully',
        '❌ [C002][AC2] Should validate mandatory fields during Lead creation',
        '❌ [C003][AC3] Should convert Lead to Opportunity successfully',
        '❌ [C004][AC4] Should verify Opportunity creation after Lead conversion'
      ],
      testrailRun: 'https://aava-testrail.avateam.io/index.php?/runs/view/53',
      notes: 'Date format fix implemented (MM/DD/YYYY). Lead creation passing. Conversion tests failing on form validation/Opportunity interaction.'
    },
    'DZ-2': {
      testName: '[DZ-2] Scenario 2: Create a Quote with Validation Rules',
      status: 'failed',
      duration: 2664000,
      totalTests: 5,
      passed: 0,
      failed: 5,
      testDetails: [
        '❌ [C005][AC5] Should create a Quote successfully with valid data',
        '❌ [C006][AC6] Should prevent saving Quote when discount >15% without justification',
        '❌ [C007][AC7] Should allow saving Quote when discount >15% with justification',
        '❌ [C008][AC8] Should prevent saving Quote when quantity is zero or negative',
        '❌ [C009][AC9] Should allow saving Quote with valid quantity'
      ],
      testrailRun: 'https://aava-testrail.avateam.io/index.php?/runs/view/53',
      notes: 'All tests failing in beforeEach hook during Opportunity prerequisite creation. Save button visibility issues.'
    },
    'DZ-3': {
      testName: '[DZ-3] Scenario 3: Create a Quote with Approval Process',
      status: 'failed',
      duration: 2664000,
      totalTests: 4,
      passed: 0,
      failed: 4,
      testDetails: [
        '❌ [C010][AC10] Should submit Quote for approval when discount >20%',
        '❌ [C011][AC11] Should allow manager to approve Quote',
        '❌ [C012][AC12] Should allow manager to reject Quote',
        '❌ [C013][AC13] Should not require approval for discounts ≤20%'
      ],
      testrailRun: 'https://aava-testrail.avateam.io/index.php?/runs/view/53',
      notes: 'All tests failing in beforeEach hook during Opportunity prerequisite creation. Test timeout issues.'
    },
    'DZ-4': {
      testName: '[DZ-4] Scenario 4: Create a Quote with Two-Level Approval Process',
      status: 'failed',
      duration: 2664000,
      totalTests: 7,
      passed: 0,
      failed: 7,
      testDetails: [
        '❌ [C014][AC14] Should submit Quote for first-level approval when discount >50%',
        '❌ [C015][AC15] Should route to Level 2 when Level 1 manager approves',
        '❌ [C016][AC16] Should route to Level 2 when Level 1 manager rejects',
        '❌ [C017][AC17] Should finalize approval when Level 2 manager approves',
        '❌ [C018][AC18] Should finalize rejection when Level 2 manager rejects',
        '❌ [C019][AC19] Should maintain complete approval history',
        '❌ [C020][AC20] Should not require two-level approval for discounts ≤50%'
      ],
      testrailRun: 'https://aava-testrail.avateam.io/index.php?/runs/view/53',
      notes: 'All tests failing in beforeEach hook during Opportunity prerequisite creation. Combobox and Save button interaction issues.'
    }
  };

  try {
    for (const [issueKey, result] of Object.entries(testResults)) {
      console.log(`\n📝 Updating ${issueKey}...`);
      
      // Format comment with detailed results
      const comment = formatSalesforceTestComment(result);
      
      await jira.client.post(`/issue/${issueKey}/comment`, {
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: comment
                }
              ]
            }
          ]
        }
      });

      console.log(`✅ Updated ${issueKey} - ${result.passed}/${result.totalTests} tests passed`);
    }
    
    console.log(`\n✅ Successfully updated all Salesforce JIRA tickets`);
    console.log(`📊 Overall: 2 passed / 21 failed`);
    console.log(`⏱️  Duration: 44.4 minutes`);
    console.log(`🔗 TestRail Run: https://aava-testrail.avateam.io/index.php?/runs/view/53\n`);
    
  } catch (error) {
    console.error('❌ Failed to update JIRA:', error.response?.data || error.message);
    process.exit(1);
  }
}

function formatSalesforceTestComment(result) {
  const emoji = result.status === 'passed' ? '✅' : result.status === 'partial' ? '⚠️' : '❌';
  const timestamp = new Date().toISOString().split('T')[0];
  
  const testDetailsFormatted = result.testDetails.join('\n');
  
  return `
${emoji} Salesforce Automated Test Execution - ${timestamp}

Test Suite: ${result.testName}
Status: ${result.status.toUpperCase()}
Results: ${result.passed}/${result.totalTests} tests passed
Duration: ${(result.duration / 60000).toFixed(1)} minutes

Test Details:
${testDetailsFormatted}

TestRail Run: ${result.testrailRun}

Notes:
${result.notes}

Framework: Playwright with Salesforce Lightning Experience
Environment: ${process.env.SALESFORCE_ORG_URL}
`.trim();
}

// Run the update
updateSalesforceJira();
