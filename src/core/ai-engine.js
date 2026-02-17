const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const logger = require('../../utils/logger');

/**
 * Flexible AI Engine supporting multiple providers:
 * - OpenRouter (cloud, fast, multiple models)
 * - Anthropic Claude (cloud)
 * - Local LLM via Ollama/LM Studio (OpenAI-compatible)
 * - Disabled mode (fallback to standard selectors)
 */
class AIEngine {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openrouter'; // 'openrouter', 'anthropic', 'local', 'disabled'
    this.conversationHistory = [];
    
    this.initializeProvider();
  }

  initializeProvider() {
    logger.info(`Initializing AI provider: ${this.provider}`);

    switch (this.provider.toLowerCase()) {
      case 'openrouter':
        this.initializeOpenRouter();
        break;

      case 'anthropic':
        if (!process.env.ANTHROPIC_API_KEY) {
          logger.warn('ANTHROPIC_API_KEY not found, falling back to OpenRouter');
          this.provider = 'openrouter';
          this.initializeOpenRouter();
        } else {
          this.client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
          });
          this.model = 'claude-sonnet-4-20250514';
        }
        break;

      case 'local':
        this.initializeLocal();
        break;

      case 'disabled':
        logger.info('AI features disabled - using standard Playwright selectors only');
        break;

      default:
        logger.warn(`Unknown AI provider: ${this.provider}, falling back to OpenRouter`);
        this.provider = 'openrouter';
        this.initializeOpenRouter();
    }
  }

  initializeOpenRouter() {
    // OpenRouter is OpenAI-compatible, uses same SDK
    if (!process.env.OPENROUTER_API_KEY) {
      logger.error('OPENROUTER_API_KEY not found in .env file!');
      throw new Error('OpenRouter API key required. Please set OPENROUTER_API_KEY in .env');
    }
    
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': 'https://github.com/playwright',
        'X-Title': 'Playwright AI Framework'
      }
    });
    
    this.model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
    
    logger.info(`OpenRouter configured with model: ${this.model}`);
    logger.info('🚀 Using fast cloud-based AI (OpenRouter)');
  }

  initializeLocal() {
    // Use OpenAI SDK for local LLM compatibility (Ollama, LM Studio, etc.)
    const baseURL = process.env.LOCAL_LLM_URL || 'http://localhost:11434/v1';
    const apiKey = process.env.LOCAL_LLM_API_KEY || 'not-needed'; // Most local LLMs don't need a key
    
    this.client = new OpenAI({
      baseURL: baseURL,
      apiKey: apiKey,
    });
    
    // Default model for Ollama - can be changed in .env
    this.model = process.env.LOCAL_LLM_MODEL || 'llama3.2:3b';
    
    logger.info(`Local LLM configured: ${baseURL} with model ${this.model}`);
  }

  /**
   * Analyze page content and find element selectors
   */
  async findElementSelector(pageHTML, elementDescription) {
    if (this.provider === 'disabled') {
      throw new Error('AI is disabled. Use standard selectors.');
    }

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

      let response;
      
      if (this.provider === 'anthropic') {
        response = await this.client.messages.create({
          model: this.model,
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        });
        
        const result = JSON.parse(response.content[0].text);
        logger.info(`AI found selector with ${result.confidence} confidence`);
        return result;
        
      } else if (this.provider === 'openrouter' || this.provider === 'local') {
        response = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            { 
              role: 'system', 
              content: 'You are a web automation expert. Always respond with valid JSON only, no additional text.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          response_format: { type: "json_object" }
        });
        
        const result = JSON.parse(response.choices[0].message.content);
        logger.info(`AI found selector with ${result.confidence || 0.8} confidence`);
        return result;
      }
      
    } catch (error) {
      logger.error(`AI Engine error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze screenshot to validate UI state
   */
  async analyzeScreenshot(screenshotBuffer, expectedState) {
    if (this.provider === 'disabled') {
      throw new Error('AI is disabled. Use standard assertions.');
    }

    // Note: Vision analysis requires models with vision capability
    if (this.provider === 'local') {
      logger.warn('Vision analysis not supported with local LLM - skipping');
      return {
        matches: true,
        confidence: 0.5,
        observations: ['Vision analysis skipped - local LLM has no vision capability'],
        issues: [],
        suggestions: []
      };
    }
    
    // OpenRouter vision support (some models)
    if (this.provider === 'openrouter') {
      logger.warn('Vision analysis with OpenRouter - using text-based analysis');
      return {
        matches: true,
        confidence: 0.7,
        observations: ['Text-based analysis used'],
        issues: [],
        suggestions: []
      };
    }

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
   */
  async selfHealSelector(pageHTML, lastKnownSelector, elementDescription) {
    if (this.provider === 'disabled') {
      throw new Error('AI is disabled.');
    }

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

      let response;
      
      if (this.provider === 'anthropic') {
        response = await this.client.messages.create({
          model: this.model,
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        });
        return JSON.parse(response.content[0].text);
        
      } else if (this.provider === 'openrouter' || this.provider === 'local') {
        response = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            { role: 'system', content: 'You are a web automation expert. Respond with valid JSON only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          response_format: { type: "json_object" }
        });
        return JSON.parse(response.choices[0].message.content);
      }
      
    } catch (error) {
      logger.error(`Self-healing error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze test failure (text-only for local LLM compatibility)
   */
  async analyzeTestFailure(testContext, error, screenshot) {
    if (this.provider === 'disabled') {
      return null;
    }

    try {
      logger.info('AI analyzing test failure');

      // Text-based analysis (works with local LLMs)
      const prompt = `A test has failed. Analyze the failure and provide actionable insights.

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
}`;

      let response;
      
      if (this.provider === 'anthropic') {
        // Anthropic can also analyze the screenshot
        const content = [{ type: 'text', text: prompt }];
        
        if (screenshot) {
          content.unshift({
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/png',
              data: screenshot.toString('base64')
            }
          });
        }
        
        response = await this.client.messages.create({
          model: this.model,
          max_tokens: 1500,
          messages: [{ role: 'user', content }]
        });
        return JSON.parse(response.content[0].text);
        
      } else if (this.provider === 'openrouter' || this.provider === 'local') {
        response = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            { role: 'system', content: 'You are a test automation expert. Respond with valid JSON only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          response_format: { type: "json_object" }
        });
        return JSON.parse(response.choices[0].message.content);
      }
      
    } catch (error) {
      logger.error(`Failure analysis error: ${error.message}`);
      return null; // Don't fail tests if analysis fails
    }
  }

  /**
   * General-purpose AI query method for test agents
   * @param {string} prompt - The prompt to send to the AI
   * @param {Object} options - Query options
   * @returns {Promise<string>} - AI response
   */
  async query(prompt, options = {}) {
    if (this.provider === 'disabled') {
      throw new Error('AI is disabled.');
    }

    const { maxTokens = 2000, temperature = 0.1, systemMessage = null } = options;

    try {
      let response;
      
      if (this.provider === 'anthropic') {
        const messages = [{ role: 'user', content: prompt }];
        
        response = await this.client.messages.create({
          model: this.model,
          max_tokens: maxTokens,
          temperature: temperature,
          messages: messages
        });
        
        return response.content[0].text;
        
      } else if (this.provider === 'openrouter' || this.provider === 'local') {
        const messages = [];
        
        if (systemMessage) {
          messages.push({ role: 'system', content: systemMessage });
        } else {
          messages.push({ 
            role: 'system', 
            content: 'You are a helpful AI assistant for test automation. Respond with valid JSON when requested.' 
          });
        }
        
        messages.push({ role: 'user', content: prompt });
        
        response = await this.client.chat.completions.create({
          model: this.model,
          messages: messages,
          temperature: temperature,
          max_tokens: maxTokens
        });
        
        return response.choices[0].message.content;
      }
      
    } catch (error) {
      logger.error(`AI query error: ${error.message}`);
      throw error;
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

module.exports = new AIEngine();
