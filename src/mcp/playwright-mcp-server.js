/**
 * Playwright MCP Server
 * Exposes AI-powered test automation capabilities via Model Context Protocol
 * 
 * Features:
 * - 4 MCP Tools: test planning, code generation, failure analysis, page context
 * - 2 MCP Resources: page state, browser context
 * - Multi-provider AI support (Ollama, Anthropic, OpenAI)
 */

const aiEngine = require('../core/ai-engine');
const logger = require('../../utils/logger');
const PageInspector = require('../helpers/page-inspector');

class PlaywrightMCPServer {
  constructor() {
    this.aiEngine = aiEngine;
    this.tools = this.defineTools();
    this.resources = this.defineResources();
    this.prompts = this.definePrompts();
    
    logger.info('🚀 Playwright MCP Server initialized');
  }

  /**
   * Define MCP Tools - AI capabilities exposed via standardized interface
   */
  defineTools() {
    return {
      generate_test_plan: {
        name: 'generate_test_plan',
        description: 'Generate comprehensive test plan from requirements using AI',
        inputSchema: {
          type: 'object',
          properties: {
            requirements: {
              type: 'string',
              description: 'Test requirements or user story description'
            },
            testType: {
              type: 'string',
              description: 'Type of test (smoke, regression, e2e, integration)',
              enum: ['smoke', 'regression', 'e2e', 'integration', 'api']
            },
            priority: {
              type: 'string',
              description: 'Test priority level',
              enum: ['high', 'medium', 'low']
            }
          },
          required: ['requirements']
        },
        handler: this.handleGenerateTestPlan.bind(this)
      },

      generate_playwright_code: {
        name: 'generate_playwright_code',
        description: 'Generate executable Playwright test code from test description',
        inputSchema: {
          type: 'object',
          properties: {
            testDescription: {
              type: 'string',
              description: 'Detailed test description or plan'
            },
            url: {
              type: 'string',
              description: 'Target application URL'
            },
            framework: {
              type: 'string',
              description: 'Test framework syntax',
              enum: ['playwright', 'playwright-ai'],
              default: 'playwright-ai'
            }
          },
          required: ['testDescription']
        },
        handler: this.handleGenerateCode.bind(this)
      },

      analyze_test_failure: {
        name: 'analyze_test_failure',
        description: 'Analyze test failures and suggest fixes using AI',
        inputSchema: {
          type: 'object',
          properties: {
            errorMessage: {
              type: 'string',
              description: 'Error message from failed test'
            },
            testCode: {
              type: 'string',
              description: 'The test code that failed'
            },
            screenshot: {
              type: 'string',
              description: 'Base64 encoded screenshot at failure point'
            },
            pageUrl: {
              type: 'string',
              description: 'URL where test failed'
            },
            stackTrace: {
              type: 'string',
              description: 'Complete error stack trace'
            }
          },
          required: ['errorMessage']
        },
        handler: this.handleAnalyzeFailure.bind(this)
      },

      analyze_page_context: {
        name: 'analyze_page_context',
        description: 'Analyze full page context (DOM, screenshot, metadata) to provide AI insights',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Current page URL'
            },
            html: {
              type: 'string',
              description: 'Page HTML content'
            },
            screenshot: {
              type: 'string',
              description: 'Base64 encoded page screenshot'
            },
            viewport: {
              type: 'object',
              description: 'Viewport dimensions',
              properties: {
                width: { type: 'number' },
                height: { type: 'number' }
              }
            },
            question: {
              type: 'string',
              description: 'Specific question about the page'
            }
          },
          required: ['url']
        },
        handler: this.handleAnalyzePageContext.bind(this)
      }
    };
  }

  /**
   * Define MCP Resources - Expose Playwright state to AI
   */
  defineResources() {
    return {
      'playwright://page/current': {
        uri: 'playwright://page/current',
        name: 'Current Page State',
        description: 'DOM structure and visual state of current page',
        mimeType: 'application/json'
      },
      'playwright://browser/context': {
        uri: 'playwright://browser/context',
        name: 'Browser Context',
        description: 'Cookies, storage, and network state',
        mimeType: 'application/json'
      },
      'playwright://test/results': {
        uri: 'playwright://test/results',
        name: 'Test Results',
        description: 'Recent test execution results and artifacts',
        mimeType: 'application/json'
      }
    };
  }

  /**
   * Define MCP Prompts - Pre-configured AI prompts
   */
  definePrompts() {
    return {
      'test-planner': {
        name: 'Test Planner',
        description: 'Expert test planning assistant',
        template: 'You are an expert QA engineer. Create a comprehensive test plan for: {{requirements}}'
      },
      'code-generator': {
        name: 'Code Generator',
        description: 'Playwright code generation expert',
        template: 'Generate production-ready Playwright test code for: {{testDescription}}'
      },
      'failure-analyst': {
        name: 'Failure Analyst',
        description: 'Test failure debugging expert',
        template: 'Analyze this test failure and suggest fixes: {{errorMessage}}'
      }
    };
  }

  /**
   * Tool Handler: Generate Test Plan
   */
  async handleGenerateTestPlan(args) {
    try {
      logger.info(`🎯 MCP Tool: generate_test_plan - ${args.requirements}`);

      const prompt = `You are an expert QA test planner. Create a comprehensive test plan.

Requirements: ${args.requirements}
Test Type: ${args.testType || 'e2e'}
Priority: ${args.priority || 'medium'}

Generate a detailed test plan with:
1. Test Objective
2. Test Scenarios (list all scenarios to cover)
3. Test Steps (detailed steps for each scenario)
4. Expected Results
5. Test Data Requirements
6. Preconditions
7. Edge Cases

Format as structured markdown.`;

      const response = await this.aiEngine.query(prompt);

      return {
        content: [{
          type: 'text',
          text: response
        }]
      };
    } catch (error) {
      logger.error('❌ MCP Tool Error:', error);
      throw error;
    }
  }

  /**
   * Tool Handler: Generate Playwright Code
   */
  async handleGenerateCode(args) {
    try {
      logger.info(`💻 MCP Tool: generate_playwright_code - ${args.testDescription.substring(0, 50)}...`);

      const framework = args.framework || 'playwright-ai';
      const useAIPage = framework === 'playwright-ai';

      // Live page inspection if URL is provided
      let pageContext = '';
      if (args.url && args.url !== 'https://example.com') {
        try {
          logger.info(`🔍 MCP: Running live page inspection on ${args.url}`);
          const inspection = await PageInspector.inspect(args.url, { timeout: 25000 });
          if (inspection.success) {
            pageContext = `\n--- LIVE PAGE INSPECTION (ACTUAL DOM STRUCTURE) ---\n${inspection.summary}\n--- END PAGE INSPECTION ---\n\nCRITICAL: Use the EXACT selectors from the page inspection above. Do NOT guess element types.\nIf the inspection shows a <span class="title"> not a <h1>, use page.locator('.title') NOT getByRole('heading').\nIf data-test attributes exist, ALWAYS prefer: page.locator('[data-test="value"]')\n`;
            logger.info('✅ MCP: Page inspection successful');
          }
        } catch (inspErr) {
          logger.warn(`⚠️ MCP: Page inspection failed: ${inspErr.message}`);
        }
      }

      const prompt = `You are an expert Playwright automation engineer. Generate production-ready test code.

Test Description: ${args.testDescription}
${args.url ? `Target URL: ${args.url}` : ''}
Framework: ${framework}
${pageContext}

CRITICAL REQUIREMENTS - MUST FOLLOW:

1. IMPORTS: Use this exact import:
   const { test, expect } = require('@playwright/test');

2. NO HOOKS: Never use test.beforeAll() or test.afterAll() - they cause syntax errors
   ❌ WRONG: test.beforeAll(async ({ browser }) => {})
   ✅ RIGHT: Put all code inside test() functions only

3. URL: Use the EXACT URL provided above: ${args.url || 'https://example.com'}
   - Do NOT change or assume a different URL
   - Do NOT use hardcoded URLs like endpointclinical.com

4. TIMEOUTS: Always use generous timeouts:
   - page.goto(): timeout: 60000
   - waitForLoadState: Remove it (causes timeouts)
   - toBeVisible(): timeout: 15000

5. SELECTORS: Use flexible, reliable selectors:
   - PREFER Playwright built-in locators: page.getByRole('button', { name: 'Submit' }), page.getByText('text'), page.getByPlaceholder('Search'), page.getByLabel('Email')
   - Use CSS selectors as fallback: page.locator('input[type="text"]'), page.locator('[aria-label="Search"]')
   - Add .first() for multi-match elements
   - Never assume specific class names or exact attribute values
   - For search inputs use: page.getByRole('searchbox') or page.getByRole('combobox') or page.locator('textarea[name], input[type="text"]')

6. CONSENT/COOKIE DIALOGS: Many sites (especially Google, EU sites) show cookie consent dialogs.
   - ALWAYS handle potential consent pages BEFORE interacting with the main page:
   - After page.goto(), add this block:
     // Dismiss any consent/cookie dialogs
     try {
       const consentButton = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
       await consentButton.click({ timeout: 5000 });
       await page.waitForTimeout(1000);
     } catch (e) { /* No consent dialog present */ }

7. ERROR HANDLING: Wrap all test code in try/catch with console.log

8. URL ASSERTIONS: Never use exact URL matching. URLs can redirect (e.g., google.com → google.co.in).
   - Use: await expect(page).toHaveURL(/keyword/i) instead of exact strings

9. PAGE TITLE ASSERTIONS: NEVER use page.locator('title') — the <title> tag is in <head>, not the visible DOM.
   - ❌ WRONG: page.locator('title').toHaveText('Swag Labs')
   - ✅ RIGHT: await expect(page).toHaveTitle('Swag Labs')
   - ✅ RIGHT: await expect(page).toHaveTitle(/swag/i)  // regex for flexible match

9. STRUCTURE:
\`\`\`javascript
const { test, expect } = require('@playwright/test');

test.describe('Test Suite Name', () => {
  test('Test Case Name', async ({ page }) => {
    try {
      // Navigate with timeout
      await page.goto('${args.url || 'URL'}', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });
      
      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }
      
      // Find elements with Playwright built-in locators
      const element = page.getByRole('heading', { name: /text/i }).first();
      await expect(element).toBeVisible({ timeout: 15000 });
      
      console.log('✓ Test passed');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });
});
\`\`\`

Return ONLY the complete, valid JavaScript code. No markdown wrappers, no explanations.`;

      const response = await this.aiEngine.query(prompt, { 
        maxTokens: 8000,  // Increased for complete test file generation
        temperature: 0.1 
      });

      // Extract code from markdown if present
      let code = response;
      const codeMatch = response.match(/```(?:javascript|js)?\n([\s\S]*?)```/);
      if (codeMatch) {
        code = codeMatch[1];
      }

      return {
        content: [{
          type: 'text',
          text: code
        }]
      };
    } catch (error) {
      logger.error('❌ MCP Tool Error:', error);
      throw error;
    }
  }

  /**
   * Tool Handler: Analyze Test Failure
   */
  async handleAnalyzeFailure(args) {
    try {
      const errorMsg = args.errorMessage || args.error || 'Unknown error';
      const errorPreview = typeof errorMsg === 'string' ? errorMsg.substring(0, 50) : String(errorMsg).substring(0, 50);
      logger.info(`🔍 MCP Tool: analyze_test_failure - ${errorPreview}...`);

      const prompt = `You are an expert Playwright test debugger. Analyze this test failure and provide actionable fixes.

Error Message: ${errorMsg}

${args.testCode ? `Test Code:\n${args.testCode}\n` : ''}
${args.pageUrl ? `Page URL: ${args.pageUrl}` : ''}
${args.stackTrace ? `Stack Trace:\n${args.stackTrace}` : ''}
${args.screenshot ? 'Screenshot: [Available for visual analysis]' : ''}

Provide:
1. Root Cause Analysis
2. Specific Fix (with code)
3. Prevention Strategy
4. Alternative Approaches

Format as clear, actionable markdown.`;

      const response = await this.aiEngine.query(prompt);

      return {
        content: [{
          type: 'text',
          text: response
        }]
      };
    } catch (error) {
      logger.error('❌ MCP Tool Error:', error);
      throw error;
    }
  }

  /**
   * Tool Handler: Analyze Page Context
   */
  async handleAnalyzePageContext(args) {
    try {
      logger.info(`🌐 MCP Tool: analyze_page_context - ${args.url}`);

      const prompt = `You are an expert web application analyzer. Analyze this page and provide insights.

URL: ${args.url}

${args.html ? `HTML Structure: ${args.html.substring(0, 2000)}... [truncated]` : ''}
${args.viewport ? `Viewport: ${args.viewport.width}x${args.viewport.height}` : ''}
${args.screenshot ? 'Visual Screenshot: [Available]' : ''}
${args.question ? `\nSpecific Question: ${args.question}` : ''}

Provide analysis including:
1. Page Purpose & Functionality
2. Key Interactive Elements
3. Testability Assessment
4. Potential Test Scenarios
5. Accessibility Observations
${args.question ? '6. Answer to Specific Question' : ''}

Format as structured markdown.`;

      const response = await this.aiEngine.query(prompt);

      return {
        content: [{
          type: 'text',
          text: response
        }]
      };
    } catch (error) {
      logger.error('❌ MCP Tool Error:', error);
      throw error;
    }
  }

  /**
   * List all available tools
   */
  async listTools() {
    return {
      tools: Object.values(this.tools).map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema
      }))
    };
  }

  /**
   * Call a tool by name
   */
  async callTool(name, args) {
    const tool = this.tools[name];
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    logger.info(`🔧 MCP Tool Call: ${name}`);
    return await tool.handler(args);
  }

  /**
   * List all available resources
   */
  async listResources() {
    return {
      resources: Object.values(this.resources)
    };
  }

  /**
   * Read a resource by URI
   */
  async readResource(uri) {
    const resource = this.resources[uri];
    if (!resource) {
      throw new Error(`Unknown resource: ${uri}`);
    }

    // In a real implementation, this would fetch live Playwright state
    // For now, return placeholder data
    return {
      contents: [{
        uri: resource.uri,
        mimeType: resource.mimeType,
        text: JSON.stringify({ message: 'Resource data would be here' })
      }]
    };
  }

  /**
   * List all available prompts
   */
  async listPrompts() {
    return {
      prompts: Object.values(this.prompts)
    };
  }

  /**
   * Get a specific prompt
   */
  async getPrompt(name, args) {
    const prompt = this.prompts[name];
    if (!prompt) {
      throw new Error(`Unknown prompt: ${name}`);
    }

    // Simple template substitution
    let text = prompt.template;
    for (const [key, value] of Object.entries(args || {})) {
      text = text.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return {
      messages: [{
        role: 'user',
        content: { type: 'text', text }
      }]
    };
  }
}

// Export singleton instance
module.exports = new PlaywrightMCPServer();
