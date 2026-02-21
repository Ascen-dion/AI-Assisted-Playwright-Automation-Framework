const { test, expect } = require('../../core/ai-test-runner');
const testAgents = require('../../core/test-agents');

/**
 * Playwright Test Agents Examples
 * Demonstrates 🎭 Planner, 🎭 Generator, and 🎭 Healer agents
 */

test.describe('🎭 Test Agents - Planner Examples', () => {
  
  test('Planner: Generate test plan from description', async () => {
    // Use the planner to create a test plan
    const plan = await testAgents.planTest(
      'Test login functionality on saucedemo with valid credentials',
      {
        includeSetup: true,
        includeTeardown: true,
        detailLevel: 'detailed'
      }
    );

    console.log('\n📋 Generated Test Plan:');
    console.log(JSON.stringify(plan, null, 2));

    // Verify plan was created
    expect(plan).toBeDefined();
    expect(plan.testName).toBeDefined();
    expect(plan.steps).toBeDefined();
    expect(plan.steps.length).toBeGreaterThan(0);
  });

  test('Planner: Execute generated plan', async ({ aiPage, page }) => {
    // Generate a test plan
    const plan = await testAgents.planTest(
      'Navigate to saucedemo and verify the page loads',
      { detailLevel: 'detailed' }
    );

    console.log('\n🎬 Executing Plan:', plan.testName);

    // Execute the plan
    const results = await testAgents.executePlan(plan, page, aiPage);

    console.log('\n📊 Execution Results:');
    console.log(`  Passed: ${results.passed}`);
    console.log(`  Failed: ${results.failed}`);
    console.log(`  Duration: ${results.duration}ms`);

    // Verify execution
    expect(results.passed).toBeGreaterThan(0);
  });
});

test.describe('🎭 Test Agents - Generator Examples', () => {
  
  test('Generator: Generate test from description', async () => {
    // Generate test code from high-level description
    const generated = await testAgents.generateTest(
      'Test user login with standard_user and secret_sauce password',
      {
        useAIPage: true,
        includeComments: true,
        saveToFile: true,
        filename: 'ai-generated-login.spec.js'
      }
    );

    console.log('\n💻 Generated Test Code:');
    console.log(generated.code);

    // Verify generation
    expect(generated.code).toBeDefined();
    expect(generated.code).toContain('test');
    expect(generated.filename).toBe('ai-generated-login.spec.js');
  });

  test('Generator: Generate test from plan', async () => {
    // First create a plan
    const plan = await testAgents.planTest(
      'Add product to cart and verify cart count',
      { detailLevel: 'granular' }
    );

    // Then generate code from the plan
    const generated = await testAgents.generateTest(plan, {
      useAIPage: true,
      language: 'javascript',
      filename: 'ai-cart-test.spec.js'
    });

    console.log('\n📝 Test Plan Summary:');
    console.log(`  Steps: ${plan.steps?.length || 0}`);
    console.log('\n💾 Generated Test:');
    console.log(`  Filename: ${generated.filename}`);
    console.log(`  Lines: ${generated.code?.split('\n').length || 0}`);

    expect(generated.code).toBeDefined();
  });
});

test.describe('🎭 Test Agents - Healer Examples', () => {
  
  test('Healer: Analyze and fix failing selector', async ({ aiPage, page }) => {
    await page.goto('https://www.saucedemo.com');

    // Simulate a test failure scenario
    const failureContext = {
      testName: 'Login Test',
      errorMessage: 'Element not found: #old-username-field',
      stackTrace: 'TimeoutError: Timeout 30000ms exceeded...',
      failedStep: 'Fill username field',
      pageHTML: await page.content(),
      lastKnownGoodSelector: '#old-username-field',
      elementDescription: 'username input field'
    };

    // Let the healer analyze and suggest fixes
    const healing = await testAgents.healTest(failureContext, {
      healingLevel: 'moderate',
      autoApply: false
    });

    console.log('\n🏥 Healing Analysis:');
    console.log(`  Root Cause: ${healing.rootCause}`);
    console.log(`  Confidence: ${healing.confidence}`);
    console.log(`  Fixes Suggested: ${healing.fixes?.length || 0}`);
    
    if (healing.fixes && healing.fixes.length > 0) {
      console.log('\n🔧 Top Fix:');
      console.log(`  Type: ${healing.fixes[0].type}`);
      console.log(`  Description: ${healing.fixes[0].description}`);
      console.log(`  Confidence: ${healing.fixes[0].confidence}`);
      console.log(`  Risk: ${healing.fixes[0].risk}`);
    }

    expect(healing).toBeDefined();
    expect(healing.rootCause).toBeDefined();
  });

  test('Healer: Auto-heal with high confidence', async ({ aiPage, page }) => {
    await page.goto('https://www.saucedemo.com');

    const failureContext = {
      testName: 'Click Login Button',
      errorMessage: 'Element not clickable',
      failedStep: 'Click login button',
      pageHTML: await page.content(),
      elementDescription: 'login submit button'
    };

    // Auto-apply healing if confidence is high
    const healing = await testAgents.healTest(failureContext, {
      autoApply: true,
      healingLevel: 'aggressive',
      maxAttempts: 3
    });

    console.log('\n⚡ Auto-Healing Results:');
    console.log(`  Applied: ${healing.applied}`);
    
    if (healing.applied) {
      console.log(`  Applied Fix: ${healing.appliedFix.description}`);
    }
    
    console.log(`  Total Fixes Available: ${healing.fixes?.length || 0}`);

    expect(healing).toBeDefined();
  });
});

test.describe('🎭 Test Agents - Combined Workflow', () => {
  
  test('End-to-end: Plan → Generate → Execute', async ({ aiPage, page }) => {
    console.log('\n🎯 Complete AI Test Workflow Demo\n');

    // Step 1: Plan the test
    console.log('📋 Step 1: Planning...');
    const plan = await testAgents.planTest(
      'Login to saucedemo with standard user credentials',
      { detailLevel: 'detailed' }
    );
    console.log(`✅ Plan created with ${plan.steps?.length || 0} steps`);

    // Step 2: Generate test code
    console.log('\n💻 Step 2: Generating code...');
    const generated = await testAgents.generateTest(plan, {
      useAIPage: true,
      includeComments: true,
      filename: 'complete-workflow-test.spec.js'
    });
    console.log(`✅ Code generated (${generated.code?.split('\n').length || 0} lines)`);

    // Step 3: Execute the plan
    console.log('\n🎬 Step 3: Executing...');
    const results = await testAgents.executePlan(plan, page, aiPage);
    console.log(`✅ Execution complete (${results.passed} passed, ${results.failed} failed)`);

    // Step 4: If there were failures, heal them
    if (results.failed > 0) {
      console.log('\n🏥 Step 4: Healing failures...');
      const failedStep = results.steps.find(s => s.status === 'failed');
      
      if (failedStep) {
        const healing = await testAgents.healTest({
          testName: plan.testName,
          errorMessage: failedStep.error,
          failedStep: failedStep,
          elementDescription: failedStep.target
        }, { autoApply: true });
        
        console.log(`✅ Healing analysis complete (${healing.fixes?.length || 0} fixes)`);
      }
    }

    // Verify the workflow completed
    expect(plan).toBeDefined();
    expect(generated).toBeDefined();
    expect(results).toBeDefined();
  });
});

test.describe('🎭 Test Agents - Statistics & Management', () => {
  
  test('View agent statistics', async () => {
    // Get statistics for all agents
    const stats = testAgents.getStatistics();

    console.log('\n📊 Test Agents Statistics:');
    console.log(JSON.stringify(stats, null, 2));

    expect(stats).toBeDefined();
    expect(stats.planner).toBeDefined();
    expect(stats.generator).toBeDefined();
    expect(stats.healer).toBeDefined();
  });

  test('Clear agent history', async () => {
    // Clear all agent history
    testAgents.clearHistory('all');

    const stats = testAgents.getStatistics();

    console.log('\n🧹 History cleared');
    console.log(`  Planner plans: ${stats.planner.totalPlans}`);
    console.log(`  Generated tests: ${stats.generator.totalGenerated}`);
    console.log(`  Healings: ${stats.healer.totalHealings}`);

    expect(stats.planner.totalPlans).toBe(0);
    expect(stats.generator.totalGenerated).toBe(0);
    expect(stats.healer.totalHealings).toBe(0);
  });
});

test.describe('🎭 Test Agents - Advanced Usage', () => {
  
  test('Custom healing levels comparison', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    
    const failureContext = {
      testName: 'Advanced Healing Test',
      errorMessage: 'Selector failed after DOM update',
      pageHTML: await page.content(),
      lastKnownGoodSelector: '.btn-old-class',
      elementDescription: 'primary action button'
    };

    // Test different healing levels
    const levels = ['conservative', 'moderate', 'aggressive'];
    
    console.log('\n🔬 Comparing Healing Levels:\n');
    
    for (const level of levels) {
      const healing = await testAgents.healTest(failureContext, {
        healingLevel: level,
        autoApply: false
      });
      
      console.log(`${level.toUpperCase()}:`);
      console.log(`  Fixes: ${healing.fixes?.length || 0}`);
      console.log(`  Confidence: ${healing.confidence}`);
      console.log(`  Recommendations: ${healing.recommendations?.length || 0}`);
      console.log('');
    }
  });

  test('Generate tests with different frameworks', async () => {
    const plan = await testAgents.planTest('Simple login test');

    const frameworks = [
      { framework: 'playwright', useAIPage: true },
      { framework: 'playwright', useAIPage: false }
    ];

    console.log('\n🔧 Comparing Test Generation Styles:\n');

    for (const config of frameworks) {
      const generated = await testAgents.generateTest(plan, {
        ...config,
        filename: `test-${config.useAIPage ? 'ai' : 'standard'}.spec.js`
      });

      console.log(`${config.useAIPage ? 'AI-Powered' : 'Standard'} Playwright:`);
      console.log(`  Lines: ${generated.code?.split('\n').length || 0}`);
      console.log(`  Dependencies: ${generated.dependencies?.length || 0}`);
      console.log('');
    }
  });
});
