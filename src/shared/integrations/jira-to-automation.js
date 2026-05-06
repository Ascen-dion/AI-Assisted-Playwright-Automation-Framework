/**
 * 🚀 JIRA TO AUTOMATION - Complete Workflow
 * 
 * This module orchestrates the complete flow:
 * 1. Fetch user story from Jira
 * 2. Generate test plan from acceptance criteria
 * 3. Use AI to create Playwright test script
 * 4. Execute the test
 * 5. Push results to TestRail
 * 6. Update Jira with test status
 * 
 * Usage:
 * node src/integrations/jira-to-automation.js PROJ-123
 */

const { JiraIntegration } = require('./jira-integration');
const { TestRailIntegration } = require('./testrail-integration');
const aiEngine = require('../core/ai-engine');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class JiraToAutomationWorkflow {
  constructor() {
    this.jira = new JiraIntegration();
    this.testRail = new TestRailIntegration();
    this.aiEngine = aiEngine;
  }

  /**
   * Complete workflow: Jira → Test Generation → Execution → Reporting
   * @param {string} issueKey - Jira issue key (e.g., PROJ-123)
   * @param {Object} options - Workflow options
   * @returns {Promise<Object>} Workflow results
   */
  async executeWorkflow(issueKey, options = {}) {
    console.log('\n' + '═'.repeat(90));
    console.log('🚀 JIRA TO AUTOMATION - COMPLETE WORKFLOW');
    console.log('═'.repeat(90) + '\n');

    const startTime = Date.now();
    const workflow = {
      stage: 'initializing',
      story: null,
      testPlan: null,
      script: null,
      executionResult: null,
      testRailResults: null,
      jiraUpdate: null
    };

    try {
      // ──────────────────────────────────────────────────────────
      // STAGE 1: Fetch Jira User Story
      // ──────────────────────────────────────────────────────────
      console.log('📥 STAGE 1: Fetching user story from Jira...\n');
      workflow.stage = 'fetching-story';
      
      workflow.story = await this.jira.fetchUserStory(issueKey);
      
      console.log('✅ Story Details:');
      console.log(`   Key: ${workflow.story.key}`);
      console.log(`   Summary: ${workflow.story.summary}`);
      console.log(`   Status: ${workflow.story.status}`);
      console.log(`   Priority: ${workflow.story.priority}`);
      console.log(`   Acceptance Criteria: ${workflow.story.acceptanceCriteria.length} items\n`);

      // ──────────────────────────────────────────────────────────
      // STAGE 2: Generate Test Plan from Acceptance Criteria
      // ──────────────────────────────────────────────────────────
      console.log('📋 STAGE 2: Generating test plan from acceptance criteria...\n');
      workflow.stage = 'generating-test-plan';
      
      workflow.testPlan = await this.jira.generateTestPlan(issueKey);
      
      console.log('✅ Test Plan Generated:');
      workflow.testPlan.testCases.forEach((tc, i) => {
        console.log(`   ${i + 1}. ${tc.id}: ${tc.title}`);
      });
      console.log('');

      // ──────────────────────────────────────────────────────────
      // STAGE 3: AI-Powered Test Script Generation
      // ──────────────────────────────────────────────────────────
      console.log('🤖 STAGE 3: Generating Playwright test script with AI...\n');
      workflow.stage = 'generating-script';
      
      const aiPrompt = this.buildAIPrompt(workflow.story, workflow.testPlan);
      
      console.log('   🧠 Sending to AI engine...');
      workflow.script = await this.aiEngine.generateTestScript(aiPrompt);
      
      // Save the generated script
      const fileName = `${issueKey.toLowerCase().replace('-', '_')}.spec.js`;
      const filePath = path.join(__dirname, '..', 'tests', fileName);
      
      fs.writeFileSync(filePath, workflow.script);
      console.log(`   ✅ Script saved: ${fileName}\n`);

      // ──────────────────────────────────────────────────────────
      // STAGE 4: Execute the Generated Test
      // ──────────────────────────────────────────────────────────
      if (options.execute !== false) {
        console.log('🎬 STAGE 4: Executing generated test...\n');
        workflow.stage = 'executing-test';
        
        try {
          const output = execSync(
            `npx playwright test ${filePath} --reporter=json`,
            { cwd: path.join(__dirname, '..', '..'), encoding: 'utf8' }
          );
          
          workflow.executionResult = {
            status: 'passed',
            output: output
          };
          console.log('   ✅ Test execution completed successfully\n');
        } catch (error) {
          workflow.executionResult = {
            status: 'failed',
            output: error.stdout,
            error: error.message
          };
          console.log('   ❌ Test execution failed\n');
        }
      }

      // ──────────────────────────────────────────────────────────
      // STAGE 5: Push Results to TestRail
      // ──────────────────────────────────────────────────────────
      if (options.pushToTestRail && options.testRailProjectId) {
        console.log('📤 STAGE 5: Pushing results to TestRail...\n');
        workflow.stage = 'pushing-testrail';
        
        // Create or find suite
        let suiteId = options.testRailSuiteId;
        if (!suiteId) {
          const suite = await this.testRail.createTestSuite(
            options.testRailProjectId,
            `Jira Story: ${issueKey}`,
            workflow.story.summary
          );
          suiteId = suite.id;
        }

        // Push test cases
        const testRailCases = workflow.testPlan.testCases.map(tc => ({
          title: tc.title,
          priority: this.mapPriorityToTestRail(workflow.story.priority),
          steps: tc.steps.join('\n'),
          expected: tc.expectedResult,
          refs: issueKey
        }));

        // Get section ID from options or environment
        const sectionId = options.testRailSectionId || process.env.TESTRAIL_SECTION_ID;

        workflow.testRailResults = await this.testRail.batchPushTestCases(
          options.testRailProjectId,
          suiteId,
          testRailCases,
          sectionId ? parseInt(sectionId) : null
        );

        console.log(`   ✅ Pushed ${workflow.testRailResults.length} test cases to TestRail\n`);
      }

      // ──────────────────────────────────────────────────────────
      // STAGE 6: Update Jira with Test Status
      // ──────────────────────────────────────────────────────────
      if (options.updateJira !== false) {
        console.log('🔗 STAGE 6: Updating Jira with test results...\n');
        workflow.stage = 'updating-jira';
        
        const testResult = {
          testName: workflow.testPlan.testCases[0]?.title || 'Automated Test',
          status: workflow.executionResult?.status || 'generated',
          duration: Date.now() - startTime,
          error: workflow.executionResult?.error || null
        };

        workflow.jiraUpdate = await this.jira.updateTestResults(issueKey, testResult);
        console.log('   ✅ Jira updated with test results\n');
      }

      // ──────────────────────────────────────────────────────────
      // WORKFLOW COMPLETE
      // ──────────────────────────────────────────────────────────
      workflow.stage = 'complete';
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log('═'.repeat(90));
      console.log('🎉 WORKFLOW COMPLETE!');
      console.log('═'.repeat(90));
      console.log(`\n⏱️  Total Duration: ${duration}s`);
      console.log(`📊 Test Cases Generated: ${workflow.testPlan.testCases.length}`);
      console.log(`📝 Script File: ${fileName}`);
      if (workflow.executionResult) {
        console.log(`🎬 Execution: ${workflow.executionResult.status.toUpperCase()}`);
      }
      console.log('\n✨ Key Achievements:');
      console.log('   ✅ Fetched user story from Jira');
      console.log('   ✅ Generated test plan from acceptance criteria');
      console.log('   ✅ AI-generated Playwright test script');
      if (workflow.executionResult) {
        console.log(`   ${workflow.executionResult.status === 'passed' ? '✅' : '⚠️'} Executed automated test`);
      }
      if (workflow.testRailResults) {
        console.log('   ✅ Pushed test cases to TestRail');
      }
      if (workflow.jiraUpdate) {
        console.log('   ✅ Updated Jira with results');
      }
      console.log('\n' + '═'.repeat(90) + '\n');

      return workflow;
    } catch (error) {
      console.error('\n❌ Workflow failed at stage:', workflow.stage);
      console.error('Error:', error.message);
      throw error;
    }
  }

  /**
   * Build AI prompt from story and test plan
   * @param {Object} story - User story
   * @param {Object} testPlan - Generated test plan
   * @returns {string} AI prompt
   */
  buildAIPrompt(story, testPlan) {
    return `
You are an expert test automation engineer. Generate a complete Playwright test script for the following user story.

**USER STORY: ${story.key}**
${story.summary}

**ACCEPTANCE CRITERIA:**
${story.acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

**TEST CASES TO IMPLEMENT:**
${testPlan.testCases.map((tc, i) => `
Test Case ${i + 1}: ${tc.title}
Steps:
${tc.steps.map((step, j) => `  ${j + 1}. ${step}`).join('\n')}
Expected Result: ${tc.expectedResult}
`).join('\n')}

**REQUIREMENTS:**
1. Use Playwright's best practices
2. Include proper test structure with describe/test blocks
3. Add meaningful assertions for all acceptance criteria
4. Include error handling and logging
5. Use page object model if applicable
6. Add comments explaining key test logic
7. Use async/await properly
8. Include setup and teardown if needed

Generate the complete test script now:
    `.trim();
  }

  /**
   * Map Jira priority to TestRail priority ID
   * @param {string} jiraPriority - Jira priority (Highest, High, Medium, Low, Lowest)
   * @returns {number} TestRail priority ID
   */
  mapPriorityToTestRail(jiraPriority) {
    const priorityMap = {
      'Highest': 5,   // Critical
      'High': 4,      // High
      'Medium': 3,    // Medium
      'Low': 2,       // Low
      'Lowest': 1     // Low
    };
    return priorityMap[jiraPriority] || 3;
  }
}

// CLI execution
if (require.main === module) {
  const issueKey = process.argv[2];
  
  if (!issueKey) {
    console.error('\n❌ Usage: node jira-to-automation.js <JIRA-ISSUE-KEY>');
    console.error('Example: node jira-to-automation.js PROJ-123\n');
    process.exit(1);
  }

  const workflow = new JiraToAutomationWorkflow();
  
  const options = {
    execute: true,
    updateJira: true,
    pushToTestRail: process.env.TESTRAIL_PROJECT_ID ? true : false,
    testRailProjectId: parseInt(process.env.TESTRAIL_PROJECT_ID) || null,
    testRailSuiteId: parseInt(process.env.TESTRAIL_SUITE_ID) || null
  };

  workflow.executeWorkflow(issueKey, options)
    .then(result => {
      console.log('✅ Complete! Check the generated test file and results.');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Workflow failed:', error.message);
      process.exit(1);
    });
}

module.exports = { JiraToAutomationWorkflow };
