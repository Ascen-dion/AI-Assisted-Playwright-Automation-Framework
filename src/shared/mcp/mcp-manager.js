/**
 * Unified MCP Manager
 * 
 * Manages both custom MCP (AI test generation) and Microsoft Playwright MCP (browser automation)
 * Provides a single interface to access all MCP capabilities
 * 
 * Architecture:
 * - Custom MCP: AI-powered test planning, code generation, failure analysis
 * - Microsoft MCP: Direct browser automation via accessibility tree
 * 
 * Usage:
 *   const mcpManager = require('./mcp-manager');
 *   
 *   // AI capabilities (custom MCP)
 *   const plan = await mcpManager.generateTestPlan('Login test');
 *   const code = await mcpManager.generatePlaywrightCode('Click submit button');
 *   
 *   // Browser automation (Microsoft MCP)
 *   await mcpManager.browserNavigate('https://example.com');
 *   const snapshot = await mcpManager.browserSnapshot();
 *   await mcpManager.browserClick({ ref: 'submit-btn', element: 'Submit' });
 */

const customMCPClient = require('./playwright-mcp-client');
const microsoftMCPClient = require('./microsoft-playwright-mcp-client');
const logger = require('../../utils/logger');

class MCPManager {
  constructor() {
    this.customMCP = customMCPClient;
    this.microsoftMCP = microsoftMCPClient;
    this.useMicrosoftMCP = process.env.USE_MICROSOFT_MCP === 'true';
    
    logger.info('🎭 MCP Manager initialized');
    logger.info(`   Custom MCP (AI): ${process.env.USE_MCP === 'true' ? 'enabled' : 'disabled'}`);
    logger.info(`   Microsoft MCP (Browser): ${this.useMicrosoftMCP ? 'enabled' : 'disabled'}`);
  }

  // ==========================================================================
  // CONNECTION MANAGEMENT
  // ==========================================================================

  /**
   * Connect to MCP servers
   * @param {Object} options - Connection options
   * @param {boolean} options.customMCP - Connect to custom MCP
   * @param {boolean} options.microsoftMCP - Connect to Microsoft MCP
   */
  async connect(options = {}) {
    const { customMCP = true, microsoftMCP = this.useMicrosoftMCP } = options;

    const results = {
      custom: false,
      microsoft: false,
      errors: []
    };

    // Connect to custom MCP (AI capabilities)
    if (customMCP && process.env.USE_MCP === 'true') {
      try {
        await this.customMCP.connect();
        results.custom = true;
        logger.info('✅ Custom MCP connected');
      } catch (error) {
        results.errors.push({ type: 'custom', error: error.message });
        logger.warn('⚠️ Custom MCP connection failed:', error.message);
      }
    }

    // Connect to Microsoft MCP (browser automation)
    if (microsoftMCP) {
      try {
        await this.microsoftMCP.connect();
        results.microsoft = true;
        logger.info('✅ Microsoft MCP connected');
      } catch (error) {
        results.errors.push({ type: 'microsoft', error: error.message });
        logger.warn('⚠️ Microsoft MCP connection failed:', error.message);
      }
    }

    return results;
  }

  /**
   * Disconnect from all MCP servers
   */
  async disconnect() {
    await Promise.all([
      this.customMCP.disconnect().catch(e => logger.warn('Custom MCP disconnect failed:', e)),
      this.microsoftMCP.disconnect().catch(e => logger.warn('Microsoft MCP disconnect failed:', e))
    ]);
    logger.info('👋 All MCP connections closed');
  }

  /**
   * Get status of MCP connections
   */
  getStatus() {
    return {
      custom: {
        enabled: process.env.USE_MCP === 'true',
        connected: this.customMCP.isConnected
      },
      microsoft: {
        enabled: this.useMicrosoftMCP,
        connected: this.microsoftMCP.isConnected
      }
    };
  }

  // ==========================================================================
  // CUSTOM MCP - AI CAPABILITIES
  // ==========================================================================

  /**
   * Generate test plan using AI
   * @param {string} requirements - Test requirements
   * @param {Object} options - Generation options
   */
  async generateTestPlan(requirements, options = {}) {
    logger.info('🎯 Generating test plan via Custom MCP...');
    return await this.customMCP.generateTestPlan(requirements, options);
  }

  /**
   * Generate Playwright code using AI
   * @param {string} testDescription - Test description
   * @param {Object} options - Generation options
   */
  async generatePlaywrightCode(testDescription, options = {}) {
    logger.info('💻 Generating Playwright code via Custom MCP...');
    return await this.customMCP.generatePlaywrightCode(testDescription, options);
  }

  /**
   * Analyze test failure and suggest fixes
   * @param {Object} failureData - Failure information
   */
  async analyzeTestFailure(failureData) {
    logger.info('🔍 Analyzing test failure via Custom MCP...');
    return await this.customMCP.analyzeTestFailure(failureData);
  }

  /**
   * Analyze page context using AI
   * @param {Object} pageData - Page information
   */
  async analyzePageContext(pageData) {
    logger.info('📄 Analyzing page context via Custom MCP...');
    return await this.customMCP.analyzePageContext(pageData);
  }

  // ==========================================================================
  // MICROSOFT MCP - BROWSER AUTOMATION
  // ==========================================================================

  /**
   * Navigate to URL
   * @param {string} url - URL to navigate to
   */
  async browserNavigate(url) {
    logger.info(`🌐 Navigating to: ${url}`);
    return await this.microsoftMCP.browserNavigate(url);
  }

  /**
   * Get page snapshot (accessibility tree)
   * @param {string} filename - Optional filename to save snapshot
   */
  async browserSnapshot(filename = null) {
    logger.info('📸 Capturing page snapshot...');
    return await this.microsoftMCP.browserSnapshot(filename);
  }

  /**
   * Click element
   * @param {Object} options - Click options
   */
  async browserClick(options) {
    logger.info(`🖱️ Clicking: ${options.element || options.ref}`);
    return await this.microsoftMCP.browserClick(options);
  }

  /**
   * Type text
   * @param {Object} options - Type options
   */
  async browserType(options) {
    logger.info(`⌨️ Typing: ${options.text}`);
    return await this.microsoftMCP.browserType(options);
  }

  /**
   * Fill form
   * @param {Array} fields - Form fields to fill
   */
  async browserFillForm(fields) {
    logger.info(`📝 Filling form with ${fields.length} fields`);
    return await this.microsoftMCP.browserFillForm(fields);
  }

  /**
   * Select dropdown option
   * @param {Object} options - Select options
   */
  async browserSelectOption(options) {
    logger.info(`📋 Selecting option: ${options.values.join(', ')}`);
    return await this.microsoftMCP.browserSelectOption(options);
  }

  /**
   * Press keyboard key
   * @param {string} key - Key to press
   */
  async browserPressKey(key) {
    logger.info(`⌨️ Pressing key: ${key}`);
    return await this.microsoftMCP.browserPressKey(key);
  }

  /**
   * Wait for condition
   * @param {Object} options - Wait options
   */
  async browserWaitFor(options) {
    logger.info('⏳ Waiting...');
    return await this.microsoftMCP.browserWaitFor(options);
  }

  /**
   * Take screenshot
   * @param {Object} options - Screenshot options
   */
  async browserTakeScreenshot(options = {}) {
    logger.info('📷 Taking screenshot...');
    return await this.microsoftMCP.browserTakeScreenshot(options);
  }

  /**
   * Get console messages
   * @param {string} level - Message level
   * @param {string} filename - Optional filename
   */
  async browserConsoleMessages(level = 'info', filename = null) {
    logger.info(`📜 Getting console messages (${level})...`);
    return await this.microsoftMCP.browserConsoleMessages(level, filename);
  }

  /**
   * Get network requests
   * @param {boolean} includeStatic - Include static resources
   * @param {string} filename - Optional filename
   */
  async browserNetworkRequests(includeStatic = false, filename = null) {
    logger.info('🌐 Getting network requests...');
    return await this.microsoftMCP.browserNetworkRequests(includeStatic, filename);
  }

  /**
   * Run Playwright code
   * @param {string} code - Code to execute
   */
  async browserRunCode(code) {
    logger.info('🚀 Running Playwright code...');
    return await this.microsoftMCP.browserRunCode(code);
  }

  /**
   * Close browser
   */
  async browserClose() {
    logger.info('🔚 Closing browser...');
    return await this.microsoftMCP.browserClose();
  }

  // ==========================================================================
  // HYBRID WORKFLOWS - AI + BROWSER AUTOMATION
  // ==========================================================================

  /**
   * AI-assisted browser automation workflow
   * 1. Use AI to generate action plan
   * 2. Execute actions via browser automation
   * 
   * @param {string} goal - What you want to accomplish
   * @param {string} url - Starting URL
   * @returns {Promise<Object>} Workflow results
   */
  async aiAssistedWorkflow(goal, url) {
    logger.info('🤖 Starting AI-assisted browser workflow...');

    const results = {
      goal,
      url,
      plan: null,
      actions: [],
      success: false,
      error: null
    };

    try {
      // Step 1: Generate plan with AI
      logger.info('Step 1: Generating action plan with AI...');
      results.plan = await this.generateTestPlan(goal, { testType: 'e2e' });

      // Step 2: Navigate to URL
      logger.info('Step 2: Navigating to URL...');
      await this.browserNavigate(url);
      results.actions.push({ action: 'navigate', url, status: 'success' });

      // Step 3: Get initial snapshot
      logger.info('Step 3: Getting page snapshot...');
      const snapshot = await this.browserSnapshot();
      results.actions.push({ action: 'snapshot', status: 'success' });

      logger.info('✅ AI-assisted workflow completed');
      results.success = true;

      return results;
    } catch (error) {
      logger.error('❌ AI-assisted workflow failed:', error);
      results.error = error.message;
      return results;
    }
  }

  /**
   * AI-powered test healing workflow
   * When a test fails, use AI to analyze and suggest fixes
   * 
   * @param {Object} failureData - Failure information
   * @returns {Promise<Object>} Healing suggestions
   */
  async healFailedTest(failureData) {
    logger.info('🔧 Starting test healing workflow...');

    try {
      // Analyze failure with AI
      const analysis = await this.analyzeTestFailure(failureData);

      // Get current page state via browser automation
      const snapshot = await this.browserSnapshot();

      return {
        analysis,
        currentPageState: snapshot,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('❌ Test healing failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new MCPManager();
