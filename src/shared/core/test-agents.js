const aiEngine = require('./ai-engine');
const logger = require('../../utils/logger');
const fs = require('fs').promises;
const path = require('path');

/**
 * Playwright Test Agents - AI-powered test planning, generation, and healing
 * Includes: 🎭 Planner, 🎭 Generator, 🎭 Healer
 */
class TestAgents {
  constructor() {
    this.plannerHistory = [];
    this.generatorHistory = [];
    this.healerHistory = [];
    this.testResultsDir = path.join(process.cwd(), 'test-results', 'agents');
  }

  /**
   * 🎭 PLANNER AGENT
   * Plans test steps from a high-level test description
   * @param {string} testDescription - What you want to test (e.g., "login to saucedemo")
   * @param {Object} options - Planning options
   * @returns {Promise<Object>} - Test plan with steps
   */
  async planTest(testDescription, options = {}) {
    try {
      logger.info(`🎭 Planner Agent: Planning test for "${testDescription}"`);
      
      const { 
        includeSetup = true, 
        includeTeardown = true,
        detailLevel = 'detailed' // 'high-level' | 'detailed' | 'granular'
      } = options;

      const prompt = `You are a test planning expert. Create a comprehensive test plan for the following test scenario:

Test Description: ${testDescription}

Requirements:
- Include setup steps: ${includeSetup}
- Include teardown steps: ${includeTeardown}
- Detail level: ${detailLevel}

Return a JSON response with this structure:
{
  "testName": "descriptive test name",
  "description": "what this test validates",
  "setup": ["setup step 1", "setup step 2"],
  "steps": [
    {
      "action": "navigate|click|fill|verify|wait|etc",
      "target": "element or URL description",
      "value": "value if applicable",
      "description": "what this step does"
    }
  ],
  "assertions": [
    {
      "type": "visible|text|url|count|etc",
      "target": "what to check",
      "expected": "expected value",
      "description": "what this validates"
    }
  ],
  "teardown": ["cleanup step 1", "cleanup step 2"],
  "estimatedTime": "estimated execution time",
  "prerequisites": ["list any prerequisites"],
  "testData": {
    "required": "any test data needed"
  }
}

Make the plan detailed and actionable.`;

      const response = await aiEngine.query(prompt, { maxTokens: 2000 });
      
      // Parse the AI response
      const plan = this._parseAIResponse(response);
      
      // Store in history
      plan.timestamp = new Date().toISOString();
      plan.originalDescription = testDescription;
      this.plannerHistory.push(plan);
      
      // Save to file
      await this._savePlan(plan);
      
      logger.info(`✅ Test plan created with ${plan.steps?.length || 0} steps`);
      
      return plan;
      
    } catch (error) {
      logger.error(`❌ Planner Agent error: ${error.message}`);
      throw error;
    }
  }

  /**
   * 🎭 GENERATOR AGENT
   * Generates executable Playwright test code from a test plan or description
   * @param {Object|string} planOrDescription - Test plan object or description string
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} - Generated test code
   */
  async generateTest(planOrDescription, options = {}) {
    try {
      logger.info(`🎭 Generator Agent: Generating test code...`);
      
      const {
        framework = 'playwright', // 'playwright' | 'playwright-test'
        language = 'javascript', // 'javascript' | 'typescript'
        useAIPage = true, // Use AI-powered aiPage methods
        includeComments = true,
        filename = 'generated-test.spec.js'
      } = options;

      // If input is a string, plan it first
      let plan = planOrDescription;
      if (typeof planOrDescription === 'string') {
        plan = await this.planTest(planOrDescription);
      }

      const prompt = `You are a Playwright test code generator. Generate a complete and executable Playwright test based on this plan:

${JSON.stringify(plan, null, 2)}

Requirements:
- Framework: ${framework}
- Language: ${language}
- Use AI-powered methods (aiPage): ${useAIPage}
- Include helpful comments: ${includeComments}

Test structure should be:
1. Import statements
2. Test describe block
3. Setup (beforeEach if needed)
4. Test case with all steps
5. Cleanup (afterEach if needed)

${useAIPage ? `
Use AI-powered methods like:
- await aiPage.navigateTo(url)
- await aiPage.clickElement(description)
- await aiPage.fillField(description, value)
- await aiPage.verifyElement(description)
` : `
Use standard Playwright methods like:
- await page.goto(url)
- await page.click(selector)
- await page.fill(selector, value)
- await expect(page.locator(selector)).toBeVisible()
`}

Return the code as a JSON object:
{
  "code": "full test code here",
  "filename": "${filename}",
  "dependencies": ["list of required packages"],
  "setup": "any setup instructions",
  "description": "what this test does"
}

Make the code production-ready, clean, and well-commented.`;

      const response = await aiEngine.query(prompt, { maxTokens: 3000 });
      
      const generatedTest = this._parseAIResponse(response);
      
      // Store in history
      generatedTest.timestamp = new Date().toISOString();
      generatedTest.plan = plan;
      this.generatorHistory.push(generatedTest);
      
      // Optionally save the generated code to a file
      if (options.saveToFile) {
        await this._saveGeneratedTest(generatedTest);
      }
      
      logger.info(`✅ Test code generated: ${generatedTest.filename}`);
      
      return generatedTest;
      
    } catch (error) {
      logger.error(`❌ Generator Agent error: ${error.message}`);
      throw error;
    }
  }

  /**
   * 🎭 HEALER AGENT  
   * Analyzes test failures and suggests/applies fixes
   * @param {Object} failureContext - Information about the test failure
   * @param {Object} options - Healing options
   * @returns {Promise<Object>} - Healing suggestions and fixes
   */
  async healTest(failureContext, options = {}) {
    try {
      logger.info(`🎭 Healer Agent: Analyzing test failure...`);
      
      const {
        autoApply = false, // Automatically apply fixes
        healingLevel = 'conservative', // 'conservative' | 'moderate' | 'aggressive'
        maxAttempts = 3
      } = options;

      const {
        testName,
        errorMessage,
        stackTrace,
        failedStep,
        pageHTML,
        screenshot,
        lastKnownGoodSelector,
        elementDescription
      } = failureContext;

      const prompt = `You are a test healing expert. Analyze this test failure and provide fixes:

Test Name: ${testName}
Failed Step: ${failedStep}
Error Message: ${errorMessage}

${stackTrace ? `Stack Trace:\n${stackTrace}\n` : ''}
${pageHTML ? `Page HTML (truncated):\n${pageHTML.substring(0, 2000)}...\n` : ''}
${lastKnownGoodSelector ? `Last Known Good Selector: ${lastKnownGoodSelector}\n` : ''}
${elementDescription ? `Element Description: ${elementDescription}\n` : ''}

Healing Level: ${healingLevel}
- conservative: Only suggest safe, low-risk fixes
- moderate: Suggest common fixes and alternatives
- aggressive: Suggest multiple alternatives and workarounds

Analyze the failure and provide:
1. Root cause analysis
2. Recommended fixes (ranked by confidence)
3. Code changes needed
4. Alternative selectors if applicable
5. Test stability improvements

Return as JSON:
{
  "rootCause": "detailed analysis of what went wrong",
  "confidence": "high|medium|low",
  "fixes": [
    {
      "type": "selector|timing|logic|assertion|etc",
      "description": "what this fix does",
      "code": "code to apply",
      "confidence": 0.95,
      "risk": "low|medium|high",
      "reasoning": "why this should work"
    }
  ],
  "alternativeSelectors": ["selector1", "selector2"],
  "recommendations": ["improve wait strategy", "add retry logic", "etc"],
  "preventiveMeasures": ["how to prevent this in future"]
}

Be specific and actionable.`;

      const response = await aiEngine.query(prompt, { maxTokens: 2000 });
      
      const healing = this._parseAIResponse(response);
      
      // Store in history
      healing.timestamp = new Date().toISOString();
      healing.failureContext = failureContext;
      healing.applied = false;
      this.healerHistory.push(healing);
      
      // Auto-apply fix if requested and confidence is high
      if (autoApply && healing.fixes?.length > 0) {
        const topFix = healing.fixes[0];
        if (topFix.confidence >= 0.7 && topFix.risk !== 'high') {
          logger.info(`🔧 Auto-applying fix: ${topFix.description}`);
          healing.applied = true;
          healing.appliedFix = topFix;
        }
      }
      
      // Save healing report
      await this._saveHealingReport(healing);
      
      logger.info(`✅ Healing analysis complete. ${healing.fixes?.length || 0} fixes suggested`);
      
      return healing;
      
    } catch (error) {
      logger.error(`❌ Healer Agent error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute a generated test plan step by step
   * @param {Object} plan - Test plan from planner
   * @param {Object} page - Playwright page object
   * @param {Object} aiPage - AI-enhanced page object
   * @returns {Promise<Object>} - Execution results
   */
  async executePlan(plan, page, aiPage) {
    try {
      logger.info(`🎬 Executing test plan: ${plan.testName}`);
      
      const results = {
        testName: plan.testName,
        startTime: new Date().toISOString(),
        steps: [],
        passed: 0,
        failed: 0,
        skipped: 0
      };

      // Execute setup
      if (plan.setup && plan.setup.length > 0) {
        logger.info(`📋 Running setup steps...`);
        for (const step of plan.setup) {
          logger.info(`  - ${step}`);
        }
      }

      // Execute test steps
      for (let i = 0; i < plan.steps.length; i++) {
        const step = plan.steps[i];
        const stepResult = {
          stepNumber: i + 1,
          action: step.action,
          target: step.target,
          value: step.value,
          description: step.description,
          status: 'pending'
        };

        try {
          logger.info(`📍 Step ${i + 1}: ${step.description}`);
          
          // Execute the step based on action type
          await this._executeStep(step, page, aiPage);
          
          stepResult.status = 'passed';
          results.passed++;
          
        } catch (error) {
          stepResult.status = 'failed';
          stepResult.error = error.message;
          results.failed++;
          
          logger.error(`❌ Step ${i + 1} failed: ${error.message}`);
          
          // Attempt to heal if healing is enabled
          if (plan.enableHealing !== false) {
            const healing = await this.healTest({
              testName: plan.testName,
              errorMessage: error.message,
              failedStep: step,
              elementDescription: step.target
            }, { autoApply: true });
            
            stepResult.healing = healing;
          }
        }
        
        results.steps.push(stepResult);
      }

      // Execute teardown
      if (plan.teardown && plan.teardown.length > 0) {
        logger.info(`🧹 Running teardown steps...`);
        for (const step of plan.teardown) {
          logger.info(`  - ${step}`);
        }
      }

      results.endTime = new Date().toISOString();
      results.duration = new Date(results.endTime) - new Date(results.startTime);
      results.success = results.failed === 0;
      
      logger.info(`
📊 Execution Summary:
   Test: ${results.testName}
   Passed: ${results.passed}
   Failed: ${results.failed}
   Duration: ${results.duration}ms
   Status: ${results.success ? '✅ PASSED' : '❌ FAILED'}
      `);
      
      return results;
      
    } catch (error) {
      logger.error(`❌ Plan execution error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute a single step
   * @private
   */
  async _executeStep(step, page, aiPage) {
    const { action, target, value } = step;
    
    switch (action.toLowerCase()) {
      case 'navigate':
        await aiPage.navigateTo(target);
        break;
        
      case 'click':
        await aiPage.clickElement(target);
        break;
        
      case 'fill':
      case 'type':
        await aiPage.fillField(target, value);
        break;
        
      case 'verify':
      case 'assert':
        await aiPage.verifyElement(target);
        break;
        
      case 'wait':
        await page.waitForTimeout(parseInt(value) || 1000);
        break;
        
      case 'screenshot':
        await aiPage.takeScreenshot(value || target);
        break;
        
      default:
        logger.warn(`⚠️  Unknown action: ${action}`);
    }
  }

  /**
   * Parse AI response (handles both JSON and text responses)
   * @private
   */
  _parseAIResponse(response) {
    try {
      // If response is already an object, return it
      if (typeof response === 'object' && response !== null) {
        return response;
      }
      
      // Try to parse as JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If not JSON, return as text
      return { text: response };
      
    } catch (error) {
      logger.warn(`Could not parse AI response as JSON: ${error.message}`);
      return { text: response };
    }
  }

  /**
   * Save test plan to file
   * @private
   */
  async _savePlan(plan) {
    try {
      const dir = path.join(this.testResultsDir, 'plans');
      await fs.mkdir(dir, { recursive: true });
      
      const filename = `plan-${Date.now()}.json`;
      const filepath = path.join(dir, filename);
      
      await fs.writeFile(filepath, JSON.stringify(plan, null, 2));
      logger.info(`📄 Plan saved: ${filepath}`);
      
    } catch (error) {
      logger.warn(`Could not save plan: ${error.message}`);
    }
  }

  /**
   * Save generated test to file
   * @private
   */
  async _saveGeneratedTest(generatedTest) {
    try {
      const dir = path.join(this.testResultsDir, 'generated');
      await fs.mkdir(dir, { recursive: true });
      
      const filepath = path.join(dir, generatedTest.filename);
      await fs.writeFile(filepath, generatedTest.code);
      
      logger.info(`💾 Generated test saved: ${filepath}`);
      
      // Also save metadata
      const metaPath = path.join(dir, `${generatedTest.filename}.meta.json`);
      await fs.writeFile(metaPath, JSON.stringify({
        ...generatedTest,
        code: '[see .spec.js file]'
      }, null, 2));
      
    } catch (error) {
      logger.warn(`Could not save generated test: ${error.message}`);
    }
  }

  /**
   * Save healing report to file
   * @private
   */
  async _saveHealingReport(healing) {
    try {
      const dir = path.join(this.testResultsDir, 'healing');
      await fs.mkdir(dir, { recursive: true });
      
      const filename = `healing-${Date.now()}.json`;
      const filepath = path.join(dir, filename);
      
      await fs.writeFile(filepath, JSON.stringify(healing, null, 2));
      logger.info(`🏥 Healing report saved: ${filepath}`);
      
    } catch (error) {
      logger.warn(`Could not save healing report: ${error.message}`);
    }
  }

  /**
   * Get agent statistics
   */
  getStatistics() {
    return {
      planner: {
        totalPlans: this.plannerHistory.length,
        recentPlans: this.plannerHistory.slice(-5)
      },
      generator: {
        totalGenerated: this.generatorHistory.length,
        recentGenerations: this.generatorHistory.slice(-5)
      },
      healer: {
        totalHealings: this.healerHistory.length,
        autoApplied: this.healerHistory.filter(h => h.applied).length,
        recentHealings: this.healerHistory.slice(-5)
      }
    };
  }

  /**
   * Clear agent history
   */
  clearHistory(agent = 'all') {
    if (agent === 'all' || agent === 'planner') this.plannerHistory = [];
    if (agent === 'all' || agent === 'generator') this.generatorHistory = [];
    if (agent === 'all' || agent === 'healer') this.healerHistory = [];
    
    logger.info(`🧹 Cleared ${agent} agent history`);
  }
}

module.exports = new TestAgents();
