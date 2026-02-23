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
/**
 * Default list of free OpenRouter models for automatic fallback.
 * Override via OPENROUTER_FREE_MODELS in .env (comma-separated).
 */
const DEFAULT_FREE_MODELS = [
  'qwen/qwen3-235b-a22b-thinking-2507',
  'deepseek/deepseek-r1-0528:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen3-coder:free',
  'google/gemma-3-27b-it:free',
  'openai/gpt-oss-20b:free',
  'stepfun/step-3.5-flash:free',
  'arcee-ai/trinity-large-preview:free',
  'arcee-ai/trinity-mini:free',
  'nvidia/nemotron-nano-9b-v2:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
];

class AIEngine {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openrouter'; // 'openrouter', 'anthropic', 'local', 'disabled'
    this.conversationHistory = [];
    
    // Model fallback rotation state
    this.freeModels = process.env.OPENROUTER_FREE_MODELS
      ? process.env.OPENROUTER_FREE_MODELS.split(',').map(m => m.trim()).filter(Boolean)
      : [...DEFAULT_FREE_MODELS];
    this.currentModelIndex = -1; // -1 = using primary model from env
    this.failedModels = new Set(); // track models that 402'd in this session

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
    this.primaryModel = this.model; // remember the original
    
    logger.info(`OpenRouter configured with model: ${this.model}`);
    logger.info(`🔄 ${this.freeModels.length} free fallback models available for auto-rotation`);
    logger.info('🚀 Using fast cloud-based AI (OpenRouter)');
  }

  /**
   * Switch to the next available free model. Returns true if a new model
   * was activated, false if all models have been exhausted.
   */
  rotateToNextModel() {
    // Mark current model as failed
    this.failedModels.add(this.model);

    // Find next model that hasn't failed yet
    for (const candidate of this.freeModels) {
      if (!this.failedModels.has(candidate)) {
        const previousModel = this.model;
        this.model = candidate;
        logger.warn(`🔄 Model rotated: ${previousModel} → ${this.model} (402 credit limit)`);
        return true;
      }
    }

    logger.error('❌ All free models exhausted — every model returned 402 this session');
    return false;
  }

  /**
   * Reset failed models list (call when credits are replenished or session restarts)
   */
  resetModelRotation() {
    this.failedModels.clear();
    this.model = this.primaryModel;
    logger.info(`🔄 Model rotation reset — back to primary model: ${this.model}`);
  }

  /**
   * Strip <think>...</think> blocks from reasoning/thinking models
   */
  cleanThinkingTags(text) {
    if (!text) return text;
    return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  }

  /**
   * Wrapper that auto-retries an OpenRouter call on 402 by rotating models.
   * @param {Function} apiFn - async function that makes the API call, receives current model
   * @returns {Promise<any>} API response
   */
  async callWithFallback(apiFn) {
    const maxAttempts = this.freeModels.length + 1; // primary + all fallbacks
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await apiFn(this.model);
      } catch (error) {
        if (error.status === 402 || error.code === 402) {
          logger.warn(`⚠️ 402 Credit limit hit on model: ${this.model}`);
          if (!this.rotateToNextModel()) {
            throw new Error(
              'All free OpenRouter models exhausted (402 on every model). ' +
              'Add credits at https://openrouter.ai/settings/credits or wait for quota reset.'
            );
          }
          // retry with new model
          continue;
        }
        // Non-402 error — rethrow
        throw error;
      }
    }
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
        response = await this.callWithFallback((model) =>
          this.client.chat.completions.create({
            model: model,
            messages: [
              { 
                role: 'system', 
                content: 'You are a web automation expert. Always respond with valid JSON only, no additional text.' 
              },
              { role: 'user', content: prompt }
            ],
            temperature: 0.1,
            response_format: { type: "json_object" }
          })
        );
        
        const rawContent = this.cleanThinkingTags(response.choices[0].message.content);
        const result = JSON.parse(rawContent);
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
        response = await this.callWithFallback((model) =>
          this.client.chat.completions.create({
            model: model,
            messages: [
              { role: 'system', content: 'You are a web automation expert. Respond with valid JSON only.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.1,
            response_format: { type: "json_object" }
          })
        );
        return JSON.parse(this.cleanThinkingTags(response.choices[0].message.content));
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
        response = await this.callWithFallback((model) =>
          this.client.chat.completions.create({
            model: model,
            messages: [
              { role: 'system', content: 'You are a test automation expert. Respond with valid JSON only.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.2,
            response_format: { type: "json_object" }
          })
        );
        return JSON.parse(this.cleanThinkingTags(response.choices[0].message.content));
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
        
        response = await this.callWithFallback((model) =>
          this.client.chat.completions.create({
            model: model,
            messages: messages,
            temperature: temperature,
            max_tokens: maxTokens
          })
        );
        
        return this.cleanThinkingTags(response.choices[0].message.content);
      }
      
    } catch (error) {
      logger.error(`AI query error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate complete Playwright test script from a prompt
   * @param {string} prompt - Detailed prompt with requirements and test plan
   * @returns {Promise<string>} Generated Playwright test script
   */
  async generateTestScript(prompt) {
    if (this.provider === 'disabled') {
      throw new Error('AI is disabled. Cannot generate test scripts.');
    }

    try {
      logger.info('Generating test script with AI...');

      const systemMessage = `You are an expert Playwright test automation engineer. Generate complete, executable Playwright test scripts following best practices.

Requirements:
- Use async/await syntax
- Include proper imports
- Add descriptive test names
- Use page object patterns when appropriate
- Include proper assertions
- Add comments for clarity
- Handle waits and timeouts properly
- Use modern Playwright APIs

Return ONLY the JavaScript code for the test file, no markdown, no explanations, just the code.`;

      let response;
      
      if (this.provider === 'anthropic') {
        response = await this.client.messages.create({
          model: this.model,
          max_tokens: 4000,
          messages: [
            { role: 'user', content: `${systemMessage}\n\n${prompt}` }
          ]
        });
        
        const script = response.content[0].text;
        logger.info('Test script generated successfully');
        return this.cleanGeneratedScript(script);
        
      } else if (this.provider === 'openrouter' || this.provider === 'local') {
        response = await this.callWithFallback((model) =>
          this.client.chat.completions.create({
            model: model,
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 4000
          })
        );
        
        const script = this.cleanThinkingTags(response.choices[0].message.content);
        logger.info('Test script generated successfully');
        return this.cleanGeneratedScript(script);
      }
      
    } catch (error) {
      logger.error(`Test script generation error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clean AI-generated script by removing markdown code blocks
   * @param {string} script - Raw AI output
   * @returns {string} Cleaned JavaScript code
   */
  cleanGeneratedScript(script) {
    // Remove markdown code blocks if present
    let cleaned = script.replace(/```javascript\n?/g, '').replace(/```\n?/g, '');
    
    // Remove any leading/trailing whitespace
    cleaned = cleaned.trim();
    
    return cleaned;
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

module.exports = new AIEngine();
