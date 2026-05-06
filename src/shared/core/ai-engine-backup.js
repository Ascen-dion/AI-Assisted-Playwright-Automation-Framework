const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const logger = require('../../utils/logger');

/**
 * AI Engine for intelligent automation decisions
 * Integrates with Claude API for element detection, validation, and self-healing
 */
class AIEngine {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.model = 'claude-sonnet-4-20250514';
    this.conversationHistory = [];
  }

  /**
   * Analyze page content and find element selectors
   * @param {string} pageHTML - Full HTML of the page
   * @param {string} elementDescription - Natural language description of element
   * @returns {Promise<Object>} - Selector strategy and confidence score
   */
  async findElementSelector(pageHTML, elementDescription) {
    try {
      logger.info(`AI finding element: ${elementDescription}`);

      const prompt = `You are a web automation expert. Analyze the following HTML and provide the best CSS selector or XPath for the element described.

HTML Content:
${pageHTML.substring(0, 10000)} ${pageHTML.length > 10000 ? '...[truncated]' : ''}

Element Description: ${elementDescription}

Provide your response in JSON format with the following structure:
{
  "primarySelector": "css selector or xpath",
  "selectorType": "css" or "xpath",
  "fallbackSelectors": ["alternative selector 1", "alternative selector 2"],
  "confidence": 0.95,
  "reasoning": "explanation of why this selector was chosen",
  "attributes": {
    "expectedText": "text content if any",
    "role": "button/input/link etc"
  }
}`;

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const result = JSON.parse(response.content[0].text);
      logger.info(`AI found selector with ${result.confidence} confidence`);
      
      return result;
    } catch (error) {
      logger.error(`AI Engine error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze screenshot to validate UI state
   * @param {Buffer} screenshotBuffer - Screenshot as buffer
   * @param {string} expectedState - Description of expected state
   * @returns {Promise<Object>} - Validation result
   */
  async analyzeScreenshot(screenshotBuffer, expectedState) {
    try {
      logger.info(`AI analyzing screenshot for: ${expectedState}`);

      const base64Image = screenshotBuffer.toString('base64');

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: base64Image
                }
              },
              {
                type: 'text',
                text: `Analyze this screenshot and determine if it matches the expected state: "${expectedState}"

Provide your response in JSON format:
{
  "matches": true/false,
  "confidence": 0.95,
  "observations": ["what you see in the image"],
  "issues": ["any problems or discrepancies"],
  "suggestions": ["recommendations if state doesn't match"]
}`
              }
            ]
          }
        ]
      });

      const result = JSON.parse(response.content[0].text);
      logger.info(`Visual validation: ${result.matches ? 'PASS' : 'FAIL'} (${result.confidence} confidence)`);
      
      return result;
    } catch (error) {
      logger.error(`Screenshot analysis error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate smart selector when element can't be found
   * @param {string} pageHTML - Current page HTML
   * @param {string} lastKnownSelector - Previously working selector
   * @param {string} elementDescription - What we're looking for
   * @returns {Promise<Object>} - Self-healing suggestions
   */
  async selfHealSelector(pageHTML, lastKnownSelector, elementDescription) {
    try {
      logger.info(`AI self-healing for: ${elementDescription}`);

      const prompt = `The element selector "${lastKnownSelector}" no longer works. 
      
HTML Content:
${pageHTML.substring(0, 10000)}

Original element description: ${elementDescription}
Failed selector: ${lastKnownSelector}

Analyze the HTML and suggest:
1. Why the selector might have failed
2. New selector(s) that should work
3. More robust selector strategies

Response format:
{
  "diagnosis": "reason for failure",
  "newSelectors": ["selector1", "selector2"],
  "robustStrategy": "recommendation for future-proof selectors",
  "confidence": 0.85
}`;

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      });

      const result = JSON.parse(response.content[0].text);
      logger.info(`Self-healing suggestion: ${result.newSelectors[0]}`);
      
      return result;
    } catch (error) {
      logger.error(`Self-healing error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze test failure and provide insights
   * @param {Object} testContext - Test execution context
   * @param {Error} error - Error that occurred
   * @param {Buffer} screenshot - Screenshot at failure
   * @returns {Promise<Object>} - Failure analysis
   */
  async analyzeTestFailure(testContext, error, screenshot) {
    try {
      logger.info('AI analyzing test failure');

      const base64Image = screenshot ? screenshot.toString('base64') : null;

      const content = [
        {
          type: 'text',
          text: `A test has failed. Analyze the failure and provide actionable insights.

Test Context:
- Test Name: ${testContext.testName}
- Step: ${testContext.currentStep}
- Error: ${error.message}
- Stack: ${error.stack}

Provide analysis in JSON:
{
  "rootCause": "likely cause of failure",
  "category": "element_not_found/timeout/assertion_failed/network_error/etc",
  "recommendations": ["how to fix"],
  "isFlaky": true/false,
  "confidence": 0.9
}`
        }
      ];

      if (base64Image) {
        content.unshift({
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/png',
            data: base64Image
          }
        });
      }

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1500,
        messages: [{ role: 'user', content }]
      });

      const result = JSON.parse(response.content[0].text);
      logger.info(`Failure analysis: ${result.category} - ${result.rootCause}`);
      
      return result;
    } catch (error) {
      logger.error(`Failure analysis error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate test assertions based on expected behavior
   * @param {string} scenario - Test scenario description
   * @param {Object} pageState - Current page state
   * @returns {Promise<Array>} - Suggested assertions
   */
  async generateAssertions(scenario, pageState) {
    try {
      const prompt = `Given this test scenario: "${scenario}"

Current page state:
${JSON.stringify(pageState, null, 2)}

Generate appropriate test assertions in JSON format:
{
  "assertions": [
    {
      "type": "element_visible/element_text/element_count/url_matches/etc",
      "target": "selector or value",
      "expected": "expected value",
      "priority": "critical/important/nice-to-have"
    }
  ]
}`;

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      });

      const result = JSON.parse(response.content[0].text);
      return result.assertions;
    } catch (error) {
      logger.error(`Assertion generation error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }
}

module.exports = new AIEngine();
