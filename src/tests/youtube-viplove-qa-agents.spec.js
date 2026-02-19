const { test } = require('../core/ai-test-runner');
const testAgents = require('../core/test-agents');
const path = require('path');
const fs = require('fs').promises;

/**
 * YouTube Test using Test Agents
 * Demonstrates: Planner Agent → Generator Agent → Execution
 * 
 * Test Objective: Search for "Viplove QA - SDET" on YouTube and open a video
 */

test.describe('🎭 YouTube - Viplove QA with Test Agents', () => {

  test('Use Test Agents: Plan → Generate → Execute', async ({ page, aiPage }) => {
    test.setTimeout(180000); // 3 minutes for AI operations + execution
    
    console.log('\n🎬 YOUTUBE TEST WITH TEST AGENTS\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 1: PLANNER AGENT - Create Test Plan
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('🎭 STEP 1: PLANNER AGENT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const testDescription = `
Test YouTube Search and Video Opening:
1. Navigate to https://www.youtube.com/
2. Search for "Viplove QA - SDET"
3. Verify search results are displayed
4. Click on the first video from search results
5. Verify video page loads successfully
6. Verify video player is visible
    `;

    console.log('📝 Test Description:');
    console.log(testDescription);
    console.log('\n⏳ Generating test plan with AI...\n');

    const plan = await testAgents.planTest(testDescription, {
      includeSetup: true,
      includeTeardown: false,
      detailLevel: 'detailed'
    });

    console.log('✅ Test Plan Generated!\n');
    console.log('📋 Plan Details:');
    console.log(`   Test Name: ${plan.testName || 'YouTube Search Test'}`);
    console.log(`   Description: ${plan.description || 'N/A'}`);
    console.log(`   Steps: ${plan.steps?.length || 0}`);
    console.log(`   Assertions: ${plan.assertions?.length || 0}`);
    console.log(`   Estimated Time: ${plan.estimatedTime || 'N/A'}\n`);

    if (plan.steps && plan.steps.length > 0) {
      console.log('📍 Test Steps:');
      plan.steps.forEach((step, index) => {
        console.log(`   ${index + 1}. ${step.action}: ${step.description || step.target}`);
      });
      console.log('');
    }

    // Save the plan
    const planPath = path.join(process.cwd(), 'test-results', 'agents', 'youtube-viplove-qa-plan.json');
    await fs.mkdir(path.dirname(planPath), { recursive: true });
    await fs.writeFile(planPath, JSON.stringify(plan, null, 2));
    console.log(`💾 Plan saved to: ${planPath}\n`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 2: GENERATOR AGENT - Generate Test Code
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎭 STEP 2: GENERATOR AGENT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('⏳ Generating executable test code from plan...\n');

    const generated = await testAgents.generateTest(testDescription, {
      useAIPage: true,
      filename: 'youtube-viplove-qa-generated.spec.js',
      fromPlan: plan
    });

    console.log('✅ Test Code Generated!\n');
    console.log('💻 Generated Code Preview:');
    const codePreview = (generated.code || generated.text || '').substring(0, 300);
    console.log(codePreview + '...\n');

    // Save generated code
    const generatedPath = path.join(process.cwd(), 'src', 'tests', 'youtube-viplove-qa-generated.spec.js');
    const codeToSave = generated.code || generated.text || generated;
    await fs.writeFile(generatedPath, codeToSave);
    console.log(`💾 Generated code saved to: ${generatedPath}\n`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 3: EXECUTE THE TEST PLAN
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎭 STEP 3: EXECUTE TEST PLAN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('⏳ Executing test plan with AI-powered page actions...\n');

    const executionResults = await testAgents.executePlan(plan, page, aiPage);

    console.log('\n✅ Execution Complete!\n');
    console.log('📊 Execution Results:');
    console.log(`   Total Steps: ${executionResults.total || 0}`);
    console.log(`   Passed: ${executionResults.passed || 0}`);
    console.log(`   Failed: ${executionResults.failed || 0}`);
    console.log(`   Skipped: ${executionResults.skipped || 0}`);
    console.log(`   Duration: ${executionResults.duration || 'N/A'}\n`);

    if (executionResults.stepResults && executionResults.stepResults.length > 0) {
      console.log('📝 Step-by-Step Results:');
      executionResults.stepResults.forEach((result, index) => {
        const icon = result.success ? '✅' : '❌';
        console.log(`   ${icon} Step ${index + 1}: ${result.description || result.step?.description}`);
        if (result.error) {
          console.log(`      Error: ${result.error}`);
        }
      });
      console.log('');
    }

    // Save execution results
    const resultsPath = path.join(process.cwd(), 'test-results', 'agents', 'youtube-viplove-qa-results.json');
    await fs.writeFile(resultsPath, JSON.stringify(executionResults, null, 2));
    console.log(`💾 Results saved to: ${resultsPath}\n`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4: HEALING (IF NEEDED)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (executionResults.failed > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎭 STEP 4: HEALER AGENT (Optional)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      console.log('⏳ Analyzing failures and suggesting fixes...\n');

      const failureContext = {
        testName: 'YouTube Viplove QA Test',
        plan: plan,
        executionResults: executionResults,
        pageHTML: await page.content(),
        pageURL: page.url()
      };

      const healing = await testAgents.healTest(failureContext, {
        healingLevel: 'moderate',
        autoApply: false
      });

      console.log('🏥 Healing Analysis:');
      console.log(`   Root Cause: ${healing.rootCause || healing.text?.substring(0, 200) || 'N/A'}`);
      console.log(`   Confidence: ${healing.confidence || 'medium'}`);
      console.log(`   Fixes: ${healing.fixes?.length || 0}`);
      
      if (healing.fixes && healing.fixes.length > 0) {
        console.log('\n🔧 Suggested Fixes:');
        healing.fixes.forEach((fix, index) => {
          console.log(`   ${index + 1}. ${fix.description || fix}`);
        });
      }
      console.log('');
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FINAL SUMMARY
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 TEST AGENTS WORKFLOW COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📊 Final Summary:');
    console.log(`   ✅ Test Plan Created: ${plan.steps?.length || 0} steps`);
    console.log(`   ✅ Test Code Generated: ${generatedPath}`);
    console.log(`   ✅ Test Executed: ${executionResults.passed || 0}/${executionResults.total || 0} passed`);
    console.log(`   ✅ Test Status: ${(executionResults.failed || 0) === 0 ? 'PASSED ✅' : 'FAILED ❌'}\n`);

    console.log('📁 Artifacts Generated:');
    console.log(`   📄 Test Plan: test-results/agents/youtube-viplove-qa-plan.json`);
    console.log(`   💻 Generated Code: src/tests/youtube-viplove-qa-generated.spec.js`);
    console.log(`   📊 Results: test-results/agents/youtube-viplove-qa-results.json\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Take final screenshot
    await page.screenshot({ 
      path: 'test-results/youtube-viplove-qa-agents-final.png',
      fullPage: false 
    });
    console.log('Screenshot saved: test-results/youtube-viplove-qa-agents-final.png\n');

    // Assertions
    if (executionResults.failed === 0) {
      console.log('All test steps passed successfully!\n');
    } else {
      console.log('Some steps failed. See healing suggestions above.\n');
    }
  });

});
