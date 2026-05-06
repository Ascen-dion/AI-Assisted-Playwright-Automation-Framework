const { test: base, expect } = require('@playwright/test');
const AIPage = require('./ai-page');
const aiEngine = require('./ai-engine');
const logger = require('../../utils/logger');

/**
 * Extended Playwright test with AI capabilities
 */
const test = base.extend({
  aiPage: async ({ page }, use) => {
    const aiPage = new AIPage(page);
    await use(aiPage);
  },

  // Auto-capture on failure
  aiScreenshot: [async ({ page }, use, testInfo) => {
    await use();
    
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({
        path: `test-results/failure-${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`
      });
      
      // Analyze failure with AI
      try {
        const analysis = await aiEngine.analyzeTestFailure(
          {
            testName: testInfo.title,
            currentStep: testInfo.annotations[0]?.description || 'unknown'
          },
          testInfo.error,
          screenshot
        );
        
        logger.error('AI Failure Analysis:', analysis);
        
        // Attach analysis to test report
        await testInfo.attach('ai-analysis', {
          body: JSON.stringify(analysis, null, 2),
          contentType: 'application/json'
        });
      } catch (error) {
        logger.error('AI analysis failed:', error.message);
      }
    }
  }, { auto: true }]
});

/**
 * Custom expect matchers
 */
expect.extend({
  async toMatchAIExpectation(received, expectedDescription) {
    const screenshot = Buffer.from(received, 'base64');
    const analysis = await aiEngine.analyzeScreenshot(screenshot, expectedDescription);
    
    const pass = analysis.matches && analysis.confidence > 0.7;
    
    return {
      pass,
      message: () => pass
        ? `Expected screenshot NOT to match: ${expectedDescription}`
        : `Expected screenshot to match: ${expectedDescription}\nAI Analysis: ${JSON.stringify(analysis, null, 2)}`
    };
  }
});

module.exports = { test, expect };
