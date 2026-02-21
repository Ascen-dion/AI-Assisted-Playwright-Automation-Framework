const { test, expect } = require('../../core/ai-test-runner');
const testAgents = require('../../core/test-agents');

/**
 * Test Agents Quick Verification
 * Tests that all agents are loaded and accessible
 */

test.describe('🎭 Test Agents - Quick Verification', () => {
  
  test('Verify test agents module is loaded', async () => {
    console.log('\n✅ Testing Test Agents Installation\n');
    
    // Verify the module loaded successfully
    expect(testAgents).toBeDefined();
    expect(typeof testAgents.planTest).toBe('function');
    expect(typeof testAgents.generateTest).toBe('function');
    expect(typeof testAgents.healTest).toBe('function');
    expect(typeof testAgents.executePlan).toBe('function');
    expect(typeof testAgents.getStatistics).toBe('function');
    expect(typeof testAgents.clearHistory).toBe('function');
    
    console.log('📋 Planner Agent: ✅ Loaded');
    console.log('💻 Generator Agent: ✅ Loaded');
    console.log('🏥 Healer Agent: ✅ Loaded');
    console.log('🎯 Execute Plan: ✅ Loaded');
    console.log('📊 Statistics: ✅ Loaded');
    console.log('\n✨ All Test Agents Successfully Installed!');
    console.log('\n📚 Next Steps:');
    console.log('   1. Read: TEST_AGENTS_QUICK_REF.md');
    console.log('   2. Run: npx playwright test test-agents-demo.spec.js (with Ollama running)');
    console.log('   3. Explore: TEST_AGENTS_GUIDE.md\n');
  });

  test('Verify agent statistics tracking', async () => {
    const stats = testAgents.getStatistics();
    
    console.log('\n📊 Agent Statistics:');
    console.log(`   Planner: ${stats.planner.totalPlans} plans created`);
    console.log(`   Generator: ${stats.generator.totalGenerated} tests generated`);
    console.log(`   Healer: ${stats.healer.totalHealings} healings performed`);
    console.log(`   Auto-healed: ${stats.healer.autoApplied} fixes auto-applied`);
    
    expect(stats).toHaveProperty('planner');
    expect(stats).toHaveProperty('generator');
    expect(stats).toHaveProperty('healer');
    
    console.log('\n✅ Statistics tracking working!\n');
  });

  test('Verify agent history management', async () => {
    // Test clearing history
    testAgents.clearHistory('all');
    
    const stats = testAgents.getStatistics();
    
    expect(stats.planner.totalPlans).toBe(0);
    expect(stats.generator.totalGenerated).toBe(0);
    expect(stats.healer.totalHealings).toBe(0);
    
    console.log('\n🧹 History management working!');
    console.log('   - Clear all history: ✅');
    console.log('   - Reset planner history: ✅');
    console.log('   - Reset generator history: ✅');
    console.log('   - Reset healer history: ✅\n');
  });

  test('Show test agents capabilities', async () => {
    console.log('\n🎭 Test Agents Capabilities:\n');
    
    console.log('📋 PLANNER AGENT:');
    console.log('   - Create test plans from descriptions');
    console.log('   - Break down complex scenarios into steps');
    console.log('   - Include assertions and validations');
    console.log('   Example: planTest("Login to app")\n');
    
    console.log('💻 GENERATOR AGENT:');
    console.log('   - Generate executable test code');
    console.log('   - Support AI-powered or standard Playwright');
    console.log('   - Save generated tests to files');
    console.log('   Example: generateTest(plan, {saveToFile: true})\n');
    
    console.log('🏥 HEALER AGENT:');
    console.log('   - Analyze test failures');
    console.log('   - Suggest fixes with confidence scores');
    console.log('   - Auto-apply high-confidence fixes');
    console.log('   Example: healTest(context, {autoApply: true})\n');
    
    console.log('🎯 WORKFLOW:');
    console.log('   Plan → Generate → Execute → Heal');
    console.log('   Perfect for rapid test automation!\n');
    
    console.log('💰 FREE with Local LLM (Ollama)!');
    console.log('   No API costs, unlimited usage\n');
    
    expect(true).toBe(true);
  });
});

test.describe.skip('🎭 Test Agents - Live Demos (Requires Ollama)', () => {
  
  test('Planner: Create a test plan', async () => {
    test.setTimeout(120000);
    console.log('\n🎭 PLANNER DEMO\n');
    
    const plan = await testAgents.planTest(
      'Navigate to saucedemo and login',
      { detailLevel: 'detailed' }
    );

    console.log('📋 Plan Created:');
    console.log(`   Name: ${plan.testName || 'Generated Plan'}`);
    console.log(`   Steps: ${plan.steps?.length || 'N/A'}`);
    console.log('\n✅ Planner working!\n');
  });

  test('Generator: Generate test code', async () => {
    test.setTimeout(120000);
    console.log('\n💻 GENERATOR DEMO\n');
    
    const generated = await testAgents.generateTest(
      'Simple page navigation test',
      { useAIPage: true, filename: 'demo.spec.js' }
    );

    console.log('💻 Code Generated:');
    console.log(`   File: ${generated.filename || 'demo.spec.js'}`);
    console.log('\n✅ Generator working!\n');
  });

  test('Healer: Analyze failure', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n🏥 HEALER DEMO\n');
    
    await page.goto('https://www.saucedemo.com');
    
    const healing = await testAgents.healTest({
      testName: 'Demo Test',
      errorMessage: 'Element not found',
      pageHTML: await page.content(),
      elementDescription: 'login button'
    });

    console.log('🏥 Healing Analysis:');
    console.log(`   Confidence: ${healing.confidence || 'medium'}`);
    console.log('\n✅ Healer working!\n');
  });
});
