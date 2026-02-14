/**
 * MCP Client for Conversational Test Authoring
 * Enables natural language test generation and execution via Groq LLM + MCP
 * Simplified in-process version for direct Playwright integration
 */

const Groq = require('groq-sdk');
const logger = require('../../utils/logger');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

class MCPClaudeClient {
  constructor(page, context = null) {
    this.page = page;
    this.context = context;
    this.mcpClient = null;
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    this.conversationHistory = [];
    this.availableTools = [];
  }

  /**
   * Initialize MCP connection (simplified in-process version)
   */
  async initialize() {
    try {
      // Create MCP server directly (in-process, no stdio transport needed)
      const PlaywrightMCPServer = require('./server');
      this.mcpServer = new PlaywrightMCPServer();
      this.mcpServer.setPage(this.page, this.context);
      
      // Define available tools directly (simplified)
      this.availableTools = [
        { name: 'navigate_to_url', description: 'Navigate to URL' },
        { name: 'find_element', description: 'Find element' },
        { name: 'click_element', description: 'Click element' },
        { name: 'fill_input', description: 'Fill input field' },
        { name: 'get_dom_snapshot', description: 'Get DOM snapshot' },
        { name: 'take_screenshot', description: 'Take screenshot' },
      ];
      
      logger.info(`MCP Client initialized with ${this.availableTools.length} tools`);
      
      return this;
    } catch (error) {
      logger.error('Failed to initialize MCP client:', error);
      throw error;
    }
  }

  /**
   * Natural language interface - converts user intent to actions
   * Example: await mcpClaude.do('login with username "admin" and password "password123"')
   */
  async do(instruction) {
    logger.info(`MCP Client - Instruction: ${instruction}`);
    
    try {
      // Add instruction to conversation
      this.conversationHistory.push({
        role: 'user',
        content: instruction,
      });

      // Get current page context for Groq
      const pageUrl = this.page.url();
      const pageTitle = await this.page.title();
      
      // Get DOM snapshot to help Groq understand the page structure
      const snapshot = await this.mcpServer.getDOMSnapshot({ maxDepth: 2 });
      const domText = snapshot.content[0].text;

      // Call Groq LLM with MCP tools
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        max_tokens: 4096,
        tools: this.formatToolsForGroq(),
        tool_choice: 'auto',
        messages: [
          {
            role: 'user',
            content: `You are an expert Playwright test automation assistant. 
            
Current page: ${pageUrl}
Page title: ${pageTitle}

Page structure (use this to find correct CSS selectors):
${domText}

Execute this instruction: "${instruction}"

Use the available MCP tools to perform the actions. Break down complex instructions into steps.
For example, "login with username X and password Y" should:
1. Find and fill username field (use actual CSS selector from DOM like #user-name)
2. Find and fill password field (use actual CSS selector from DOM like #password)
3. Find and click login button (use actual CSS selector from DOM like #login-button)

IMPORTANT: Always use actual CSS selectors (#id, .class, [attribute]) from the page structure above, NOT natural language descriptions.`,
          },
        ],
      });

      // Process Groq's response and execute tools
      const result = await this.processGroqResponse(response);
      
      // Add to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: JSON.stringify(result),
      });

      return result;
    } catch (error) {
      logger.error('MCP Client error:', error);
      throw error;
    }
  }

  /**
   * Verify page state with natural language
   * Example: await mcpClaude.verify('user is logged in')
   */
  async verify(assertion) {
    logger.info(`MCP Client - Verification: ${assertion}`);
    
    try {
      // Wait for page to be fully ready before verification (longer timeout for post-navigation)
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        // Fallback: wait for load event if networkidle times out
        return this.page.waitForLoadState('load', { timeout: 5000 });
      });
      
      // Additional wait for dynamic content to render (React/JS apps)
      await this.page.waitForTimeout(2000);
      
      // Get page snapshot for verification
      const snapshot = await this.mcpServer.getDOMSnapshot({ maxDepth: 3 });
      const screenshot = await this.mcpServer.takeScreenshot({ fullPage: false });

      // Ask Groq LLM to verify (text-only, no image support yet)
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Verify this assertion: "${assertion}"
                
Here's the current page state (DOM snapshot):
${snapshot.content[0].text}

Analyze the page and determine if the assertion is true or false.
Return your answer as JSON: {"passed": true/false, "reason": "explanation"}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      if (!result.passed) {
        throw new Error(`Verification failed: ${result.reason}`);
      }

      logger.info(`Verification passed: ${assertion}`);
      return result;
    } catch (error) {
      logger.error('Verification error:', error);
      throw error;
    }
  }

  /**
   * Navigate with smart waiting
   */
  async navigate(url) {
    logger.info(`MCP Client - Navigate: ${url}`);
    
    const result = await this.mcpServer.navigateToUrl({ 
      url, 
      waitUntil: 'networkidle' 
    });
    
    return result;
  }

  /**
   * Interact with page using natural language
   * Example: await mcpClaude.interact('click the blue submit button in the footer')
   */
  async interact(description) {
    logger.info(`MCP Client - Interact: ${description}`);
    
    // Always use Groq LLM to interpret natural language and extract proper CSS selectors
    return await this.do(description);
  }

  /**
   * Analyze current page state
   */
  async analyzePage() {
    try {
      const snapshot = await this.mcpServer.getDOMSnapshot({ maxDepth: 4 });
      const pageUrl = this.page.url();
      
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Analyze this web page and provide a brief summary:

URL: ${pageUrl}
DOM Structure:
${snapshot.content[0].text}

Provide:
1. Page purpose/type (login, dashboard, product page, etc.)
2. Key interactive elements (buttons, forms, links)
3. Current page state (loading, ready, error, etc.)
4. Suggested test actions

Return as JSON: {"purpose": "...", "elements": [], "state": "...", "suggestions": []}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      logger.error('Page analysis error:', error);
      return null;
    }
  }

  /**
   * Self-healing element detection
   * If an element is not found, Claude suggests alternatives
   */
  async findWithHealing(description, options = {}) {
    try {
      return await this.mcpServer.findElement({ description });
    } catch (error) {
      logger.warn(`Element not found: ${description}. Attempting self-heal...`);
      
      // Get page snapshot and ask LLM for alternatives
      const snapshot = await this.mcpServer.getDOMSnapshot({ maxDepth: 4 });
      
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `I'm trying to find: "${description}"
            
Page structure:
${snapshot.content[0].text}

The element was not found. Suggest alternative selectors or similar elements.
Return as JSON: {"alternatives": [{"selector": "...", "confidence": 0-1, "reason": "..."}]}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content);
      const alternatives = result.alternatives || [];
      
      // Try alternatives in order of confidence
      for (const alt of alternatives.sort((a, b) => b.confidence - a.confidence)) {
        try {
          await this.page.waitForSelector(alt.selector, { timeout: 2000 });
          logger.info(`Self-heal successful: Using ${alt.selector} (${alt.reason})`);
          return { selector: alt.selector, healed: true, reason: alt.reason };
        } catch {
          continue;
        }
      }
      
      throw new Error(`Could not find element: ${description}`);
    }
  }

  /**
   * Generate test code from natural language
   */
  async generateTestCode(testDescription) {
    const response = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Generate a complete Playwright test for: "${testDescription}"

Use the MCP-enhanced test format with mcpClaude fixture:

const { test } = require('../core/ai-test-runner');

test.describe('Test Suite Name', () => {
  test('${testDescription}', async ({ aiPage, mcpClaude }) => {
    // Your generated test code here
    // Use: await mcpClaude.navigate(url)
    // Use: await mcpClaude.do('action description')
    // Use: await mcpClaude.verify('assertion description')
  });
});

Generate complete, runnable test code.`,
        },
      ],
    });

    return response.choices[0].message.content;
  }

  /**
   * Process Groq's response and execute requested tools
   */
  async processGroqResponse(response) {
    const results = [];
    const message = response.choices[0].message;
    
    // Check if LLM requested tool calls
    if (message.tool_calls && message.tool_calls.length > 0) {
      for (const toolCall of message.tool_calls) {
        const toolResult = await this.executeTool(
          toolCall.function.name,
          JSON.parse(toolCall.function.arguments)
        );
        results.push({
          tool: toolCall.function.name,
          input: JSON.parse(toolCall.function.arguments),
          output: toolResult,
        });
      }
    }
    
    return results;
  }

  /**
   * Execute MCP tool
   */
  async executeTool(toolName, args) {
    logger.info(`Executing MCP tool: ${toolName}`, args);
    
    const methodMap = {
      navigate_to_url: 'navigateToUrl',
      find_element: 'findElement',
      click_element: 'clickElement',
      fill_input: 'fillInput',
      get_page_content: 'getPageContent',
      get_dom_snapshot: 'getDOMSnapshot',
      take_screenshot: 'takeScreenshot',
      assert_visible: 'assertVisible',
      assert_text: 'assertText',
      wait_for_selector: 'waitForSelector',
      execute_javascript: 'executeJavaScript',
    };
    
    const methodName = methodMap[toolName];
    if (!methodName || !this.mcpServer[methodName]) {
      throw new Error(`Unknown tool: ${toolName}`);
    }
    
    return await this.mcpServer[methodName](args);
  }

  /**
   * Format MCP tools for Groq API (OpenAI-compatible format)
   */
  formatToolsForGroq() {
    return [
      {
        type: 'function',
        function: {
          name: 'navigate_to_url',
          description: 'Navigate browser to a URL',
          parameters: {
            type: 'object',
            properties: {
              url: { type: 'string', description: 'The URL to navigate to' },
              waitUntil: { type: 'string', description: 'Wait until condition (load, networkidle)', enum: ['load', 'networkidle'] },
            },
            required: ['url'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'click_element',
          description: 'Click an element on the page',
          parameters: {
            type: 'object',
            properties: {
              selector: { 
                type: 'string', 
                description: 'CSS selector for the element to click (e.g., #login-button, .submit-btn, button[type="submit"]). Use actual CSS selectors from the page DOM, not natural language.' 
              },
            },
            required: ['selector'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'fill_input',
          description: 'Fill an input field with text',
          parameters: {
            type: 'object',
            properties: {
              selector: { 
                type: 'string', 
                description: 'CSS selector for the input field (e.g., #user-name, [name="username"], input[type="text"]). Use actual CSS selectors, not natural language descriptions.' 
              },
              value: { type: 'string', description: 'Text to fill into the input' },
            },
            required: ['selector', 'value'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'get_dom_snapshot',
          description: 'Get a snapshot of the current page DOM',
          parameters: {
            type: 'object',
            properties: {
              maxDepth: { type: 'number', description: 'Maximum depth to traverse (default 3)' },
            },
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'take_screenshot',
          description: 'Take a screenshot of the current page',
          parameters: {
            type: 'object',
            properties: {
              fullPage: { type: 'boolean', description: 'Capture full page or viewport only' },
            },
          },
        },
      },
    ];
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }
}

module.exports = MCPClaudeClient;
