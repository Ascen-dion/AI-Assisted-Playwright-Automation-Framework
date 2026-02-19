/**
 * 🎬 DEMO: Complete Jira to Automation Workflow
 * 
 * This script demonstrates the full power of the integration:
 * Jira → Test Generation → Execution → TestRail → Jira Update
 */

require('dotenv').config();
const { JiraToAutomationWorkflow } = require('./src/integrations/jira-to-automation');

// Example Jira story key - replace with your own
const DEMO_STORY_KEY = 'PROJ-123';

async function runDemo() {
  console.log('\n' + '═'.repeat(90));
  console.log('🎬 DEMO: JIRA → TESTRAIL INTEGRATION');
  console.log('═'.repeat(90) + '\n');

  // Check if credentials are configured
  if (!process.env.JIRA_HOST || !process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN) {
    console.log('⚠️  Jira credentials not configured. This is a demo of what\'s possible.\n');
    console.log('📋 What this integration can do:\n');
    console.log('   1️⃣  Fetch user story from Jira (PROJ-123)');
    console.log('   2️⃣  Extract acceptance criteria automatically');
    console.log('   3️⃣  Generate test plan with test cases');
    console.log('   4️⃣  Use AI to create Playwright test script');
    console.log('   5️⃣  Execute the generated test');
    console.log('   6️⃣  Push test cases to TestRail');
    console.log('   7️⃣  Update Jira with test results\n');
    
    console.log('🔧 To enable this workflow:\n');
    console.log('   1. Create .env file in project root');
    console.log('   2. Add credentials:');
    console.log('      JIRA_HOST=https://your-domain.atlassian.net');
    console.log('      JIRA_EMAIL=your-email@domain.com');
    console.log('      JIRA_API_TOKEN=your-api-token');
    console.log('      TESTRAIL_HOST=https://your-domain.testrail.io');
    console.log('      TESTRAIL_USER=your-email@domain.com');
    console.log('      TESTRAIL_API_KEY=your-api-key');
    console.log('      TESTRAIL_PROJECT_ID=1');
    console.log('      TESTRAIL_SUITE_ID=1\n');
    
    console.log('   3. Run: npm install axios dotenv');
    console.log('   4. Run: node demo-integration.js\n');
    
    console.log('📖 See INTEGRATION_SETUP.md for detailed instructions');
    console.log('\n' + '═'.repeat(90) + '\n');
    return;
  }

  try {
    // Initialize workflow
    const workflow = new JiraToAutomationWorkflow();

    // Execute complete workflow
    const result = await workflow.executeWorkflow(DEMO_STORY_KEY, {
      execute: true,              // Execute the generated test
      updateJira: true,           // Update Jira with results
      pushToTestRail: process.env.TESTRAIL_PROJECT_ID ? true : false,
      testRailProjectId: parseInt(process.env.TESTRAIL_PROJECT_ID) || null,
      testRailSuiteId: parseInt(process.env.TESTRAIL_SUITE_ID) || null
    });

    console.log('\n✅ Demo completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Story: ${result.story.key} - ${result.story.summary}`);
    console.log(`   Test Cases: ${result.testPlan.testCases.length}`);
    console.log(`   Script Generated: ✅`);
    console.log(`   Test Executed: ${result.executionResult ? '✅' : '⊝'}`);
    console.log(`   TestRail Updated: ${result.testRailResults ? '✅' : '⊝'}`);
    console.log(`   Jira Updated: ${result.jiraUpdate ? '✅' : '⊝'}`);

  } catch (error) {
    console.error('\n❌ Demo failed:', error.message);
    console.error('\nℹ️  This is expected if:');
    console.error('   - Jira story doesn\'t exist');
    console.error('   - API credentials are incorrect');
    console.error('   - You don\'t have access to the story\n');
  }
}

// Example: Manual Integration Usage
async function manualExamples() {
  const { JiraIntegration } = require('./src/integrations/jira-integration');
  const { TestRailIntegration } = require('./src/integrations/testrail-integration');

  console.log('\n📚 EXAMPLE: Manual Integration Usage\n');

  // Example 1: Fetch Jira Story
  console.log('1️⃣  Fetching Jira Story:');
  console.log('   const jira = new JiraIntegration();');
  console.log('   const story = await jira.fetchUserStory("PROJ-123");');
  console.log('   console.log(story.acceptanceCriteria);\n');

  // Example 2: Generate Test Plan
  console.log('2️⃣  Generate Test Plan:');
  console.log('   const testPlan = await jira.generateTestPlan("PROJ-123");');
  console.log('   // Returns test cases from acceptance criteria\n');

  // Example 3: Push to TestRail
  console.log('3️⃣  Push Test Case to TestRail:');
  console.log('   const testRail = new TestRailIntegration();');
  console.log('   await testRail.pushTestCase(projectId, suiteId, {');
  console.log('     title: "User can login",');
  console.log('     steps: "1. Navigate\\n2. Enter credentials\\n3. Submit",');
  console.log('     expected: "User logged in successfully",');
  console.log('     refs: "PROJ-123"');
  console.log('   });\n');

  // Example 4: Update Test Results
  console.log('4️⃣  Update Test Results:');
  console.log('   await testRail.updateTestResult(runId, caseId, {');
  console.log('     status: "passed",');
  console.log('     elapsed: "30s",');
  console.log('     comment: "Test passed successfully"');
  console.log('   });\n');

  // Example 5: Update Jira
  console.log('5️⃣  Update Jira with Results:');
  console.log('   await jira.updateTestResults("PROJ-123", {');
  console.log('     testName: "Login Test",');
  console.log('     status: "passed",');
  console.log('     duration: 5000');
  console.log('   });\n');

  console.log('📖 See INTEGRATION_SETUP.md for complete examples');
  console.log('─'.repeat(90) + '\n');
}

// Run the demo
if (require.main === module) {
  console.log('\n🚀 Starting Integration Demo...\n');
  
  runDemo()
    .then(() => manualExamples())
    .then(() => {
      console.log('✅ Demo complete!\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}

module.exports = { runDemo, manualExamples };
