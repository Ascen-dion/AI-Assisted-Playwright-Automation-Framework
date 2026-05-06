/**
 * Playwright MCP Client
 * Client interface for communicating with MCP server
 * Provides simple API for test code to use MCP tools
 */

const mcpServer = require('./playwright-mcp-server');
const logger = require('../../utils/logger');

class PlaywrightMCPClient {
  constructor() {
    this.server = mcpServer;
    this.isConnected = false;
    this.toolCache = null;
  }

  /**
   * Connect to MCP server
   */
  async connect() {
    if (this.isConnected) {
      logger.info('✅ Already connected to MCP server');
      return;
    }

    try {
      logger.info('🔌 Connecting to MCP server...');
      
      // In a real MCP implementation, this would establish stdio/http connection
      // For our embedded server, we just mark as connected
      this.isConnected = true;
      
      // Cache available tools
      const toolsList = await this.server.listTools();
      this.toolCache = toolsList.tools;
      
      logger.info(`✅ Connected to MCP server (${this.toolCache.length} tools available)`);
    } catch (error) {
      logger.error('❌ Failed to connect to MCP server:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MCP server
   */
  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    logger.info('👋 Disconnecting from MCP server');
    this.isConnected = false;
    this.toolCache = null;
  }

  /**
   * Ensure connection is established
   */
  async ensureConnected() {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  /**
   * List all available MCP tools
   */
  async listTools() {
    await this.ensureConnected();
    
    if (this.toolCache) {
      return { tools: this.toolCache };
    }
    
    return await this.server.listTools();
  }

  /**
   * Call an MCP tool
   * @param {string} name - Tool name
   * @param {object} args - Tool arguments
   * @returns {Promise<object>} Tool response
   */
  async callTool(name, args = {}) {
    await this.ensureConnected();
    
    logger.info(`🔧 Calling MCP tool: ${name}`);
    
    try {
      const result = await this.server.callTool(name, args);
      logger.info(`✅ MCP tool ${name} completed successfully`);
      return result;
    } catch (error) {
      logger.error(`❌ MCP tool ${name} failed:`, error);
      throw error;
    }
  }

  /**
   * Generate test plan using MCP
   */
  async generateTestPlan(requirements, options = {}) {
    const result = await this.callTool('generate_test_plan', {
      requirements,
      testType: options.testType || 'e2e',
      priority: options.priority || 'medium'
    });

    return result.content[0].text;
  }

  /**
   * Generate Playwright code using MCP
   */
  async generateCode(testDescription, options = {}) {
    const result = await this.callTool('generate_playwright_code', {
      testDescription,
      url: options.url,
      framework: options.framework || 'playwright-ai'
    });

    return result.content[0].text;
  }

  /**
   * Analyze test failure using MCP
   */
  async analyzeFailure(errorMessage, context = {}) {
    const result = await this.callTool('analyze_test_failure', {
      errorMessage,
      testCode: context.testCode,
      screenshot: context.screenshot,
      pageUrl: context.pageUrl,
      stackTrace: context.stackTrace
    });

    return result.content[0].text;
  }

  /**
   * Analyze page context using MCP
   */
  async analyzePageContext(page, question = null) {
    // Gather page context
    const url = page.url();
    let html = null;
    let screenshot = null;
    let viewport = null;

    try {
      html = await page.content();
      screenshot = await page.screenshot({ encoding: 'base64' });
      viewport = await page.viewportSize();
    } catch (error) {
      logger.warn('⚠️ Could not gather full page context:', error.message);
    }

    const result = await this.callTool('analyze_page_context', {
      url,
      html,
      screenshot,
      viewport,
      question
    });

    return result.content[0].text;
  }

  /**
   * List available resources
   */
  async listResources() {
    await this.ensureConnected();
    return await this.server.listResources();
  }

  /**
   * Read a resource
   */
  async readResource(uri) {
    await this.ensureConnected();
    return await this.server.readResource(uri);
  }

  /**
   * List available prompts
   */
  async listPrompts() {
    await this.ensureConnected();
    return await this.server.listPrompts();
  }

  /**
   * Get a prompt with arguments
   */
  async getPrompt(name, args) {
    await this.ensureConnected();
    return await this.server.getPrompt(name, args);
  }

  /**
   * Helper: Extract text from MCP response
   */
  extractText(response) {
    if (response.content && response.content[0]) {
      return response.content[0].text;
    }
    return '';
  }

  /**
   * Helper: Check if MCP is available
   */
  async isAvailable() {
    try {
      await this.connect();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Helper: Get server info
   */
  async getServerInfo() {
    await this.ensureConnected();
    
    const tools = await this.listTools();
    const resources = await this.listResources();
    const prompts = await this.listPrompts();

    return {
      connected: this.isConnected,
      toolsCount: tools.tools.length,
      resourcesCount: resources.resources.length,
      promptsCount: prompts.prompts.length,
      tools: tools.tools.map(t => t.name),
      resources: resources.resources.map(r => r.uri),
      prompts: prompts.prompts.map(p => p.name)
    };
  }
}

// Export singleton instance
module.exports = new PlaywrightMCPClient();
