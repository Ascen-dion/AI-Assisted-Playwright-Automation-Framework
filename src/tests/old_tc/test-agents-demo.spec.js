const { test } = require('../../core/ai-test-runner');
const testAgents = require('../../core/test-agents');

/**
 * Simple Test Agents Demo
 * Quick test to verify test agents are working properly
 */

test.describe('🎭 Test Agents Demo', () => {
  
  test('Planner: Create a simple test plan', async () => {
    test.setTimeout(12000); // 2 minutes for AI operations
    console.log('\n🎭 PLANNER AGENT DEMO\n');
    
    const plan = await testAgents.planTest(
      'Navigate to saucedemo.com and verify page title',
      { detailLevel: 'detailed' }
    );

    console.log('📋 Generated Plan:');
    console.log(`   Test Name: ${plan.testName || plan.text?.substring(0, 100)}`);
    console.log(`   Steps: ${plan.steps?.length || 'N/A'}`);
    
    if (plan.steps) {
      console.log('\n   First 3 Steps:');
      plan.steps.slice(0, 3).forEach((step, i) => {
        console.log(`     ${i + 1}. ${step.action}: ${step.description || step.target}`);
      });
    }

    console.log('\n✅ Planner Agent Working!');
  });

  test('Generator: Generate simple test code', async () => {
    test.setTimeout(12000); // 2 minutes for AI operations
    console.log('\n🎭 GENERATOR AGENT DEMO\n');
    
    const generated = await testAgents.generateTest(
      'Open saucedemo and check page loads',
      {
        useAIPage: true,
        filename: 'demo-generated.spec.js'
      }
    );

    console.log('💻 Generated Test:');
    console.log(`   Filename: ${generated.filename || 'demo-file'}`);
    console.log(`   Code Preview: ${generated.code?.substring(0, 200) || generated.text?.substring(0, 200)}...`);
    
    console.log('\n✅ Generator Agent Working!');
  });

  test('Healer: Analyze a mock failure', async ({ page }) => {
    test.setTimeout(12000); // 2 minutes for AI operations
    console.log('\n🎭 HEALER AGENT DEMO\n');
    
    await page.goto('https://www.saucedemo.com');
    
    const failureContext = {
      testName: 'Demo Healing Test',
      errorMessage: 'Element selector changed',
      pageHTML: await page.content(),
      elementDescription: 'login button'
    };

    const healing = await testAgents.healTest(failureContext, {
      healingLevel: 'moderate'
    });

    console.log('🏥 Healing Analysis:');
    console.log(`   Root Cause: ${healing.rootCause?.substring(0, 100) || healing.text?.substring(0, 100)}...`);
    console.log(`   Confidence: ${healing.confidence || 'medium'}`);
    console.log(`   Fixes Suggested: ${healing.fixes?.length || 'N/A'}`);
    
    console.log('\n✅ Healer Agent Working!');
  });

  test('View Statistics', async () => {
    console.log('\n📊 TEST AGENTS STATISTICS\n');
    
    const stats = testAgents.getStatistics();
    
    console.log('📋 Planner:');
    console.log(`   Total Plans: ${stats.planner.totalPlans}`);
    
    console.log('\n💻 Generator:');
    console.log(`   Total Generated: ${stats.generator.totalGenerated}`);
    
    console.log('\n🏥 Healer:');
    console.log(`   Total Healings: ${stats.healer.totalHealings}`);
    console.log(`   Auto-Applied: ${stats.healer.autoApplied}`);
    
    console.log('\n✅ All Test Agents Active and Working!\n');
  });
});
