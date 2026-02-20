/**
 * MCP-Enhanced Test Agents
 * Extends original test agents with Model Context Protocol support
 * 
 * Features:
 * - Backward compatible with original test-agents.js
 * - Optional MCP integration via USE_MCP environment variable
 * - Multi-provider AI support through MCP
 * - Enhanced context sharing with AI
 */

const mcpClient = require('../mcp/playwright-mcp-client');
const aiEngine = require('./ai-engine');
const logger = require('../../utils/logger');
const fs = require('fs').promises;
const path = require('path');

class TestAgentsMCP {
  constructor() {
    this.mcpClient = mcpClient;
    this.aiEngine = aiEngine;
    this.useMCP = process.env.USE_MCP === 'true';
    
    logger.info(`🤖 Test Agents initialized (MCP: ${this.useMCP ? 'enabled' : 'disabled'})`);
  }

  /**
   * Check if MCP is enabled and available
   */
  async isMCPAvailable() {
    if (!this.useMCP) {
      return false;
    }

    try {
      return await this.mcpClient.isAvailable();
    } catch (error) {
      logger.warn('⚠️ MCP not available, falling back to direct AI engine');
      return false;
    }
  }

  /**
   * Planner Agent - Generate comprehensive test plans
   * Uses MCP if enabled, falls back to AIEngine
   */
  async planTest(description, options = {}) {
    logger.info('🎯 Planner Agent: Generating test plan...');

    try {
      // Try MCP first if enabled
      if (await this.isMCPAvailable()) {
        logger.info('📡 Using MCP for test planning');
        const plan = await this.mcpClient.generateTestPlan(description, {
          testType: options.testType || 'e2e',
          priority: options.priority || 'medium'
        });

        // Save plan if requested
        if (options.saveTo) {
          await this.savePlan(plan, options.saveTo);
        }

        return plan;
      }

      // Fallback to direct AI engine
      logger.info('🔄 Using direct AI engine for test planning');
      const prompt = `You are an expert QA test planner. Create a comprehensive test plan.

Requirements: ${description}
Test Type: ${options.testType || 'e2e'}
Priority: ${options.priority || 'medium'}

Generate a detailed test plan with:
1. Test Objective
2. Test Scenarios (list all scenarios to cover)
3. Test Steps (detailed steps for each scenario)
4. Expected Results
5. Test Data Requirements
6. Preconditions
7. Edge Cases

Format as structured markdown.`;

      const plan = await this.aiEngine.query(prompt);

      if (options.saveTo) {
        await this.savePlan(plan, options.saveTo);
      }

      return plan;

    } catch (error) {
      logger.error('❌ Planner Agent failed:', error);
      throw error;
    }
  }

  /**
   * Generator Agent - Generate executable Playwright code
   * Uses MCP if enabled, falls back to AIEngine
   */
  async generateTest(testDescription, options = {}) {
    logger.info('💻 Generator Agent: Generating test code...');

    try {
      // Try MCP first if enabled
      if (await this.isMCPAvailable()) {
        logger.info('📡 Using MCP for code generation');
        let code = await this.mcpClient.generateCode(testDescription, {
          url: options.url,
          framework: options.framework || 'playwright-ai'
        });

        // Extract code from markdown if present (MCP might return wrapped code)
        logger.info(`[DEBUG] MCP raw code length: ${code.length}, starts with: ${code.substring(0, 100)}`);
        const codeMatch = code.match(/```(?:javascript|js)?\n?([\s\S]*?)```/);
        if (codeMatch) {
          logger.info('[DEBUG] Found markdown wrapper, extracting code');
          code = codeMatch[1].trim();
        } else {
          logger.info('[DEBUG] No markdown wrapper found');
        }
        logger.info(`[DEBUG] Final code length: ${code.length}, starts with: ${code.substring(0, 100)}`);

        // Validate JavaScript syntax before returning
        try {
          // Basic validation: check for common Playwright test patterns
          if (!code.includes('test(') && !code.includes('test.skip(') && !code.includes('test.only(')) {
            logger.warn('[VALIDATION] Warning: Generated code may not contain valid test cases');
          }

          // Check for balanced braces and parentheses
          const openBraces = (code.match(/\{/g) || []).length;
          const closeBraces = (code.match(/\}/g) || []).length;
          const openParens = (code.match(/\(/g) || []).length;
          const closeParens = (code.match(/\)/g) || []).length;
          
          if (openBraces !== closeBraces) {
            logger.error(`[VALIDATION] Unbalanced braces: ${openBraces} open, ${closeBraces} close`);
            throw new Error(`Generated code has unbalanced braces (${openBraces} open, ${closeBraces} close)`);
          }
          if (openParens !== closeParens) {
            logger.error(`[VALIDATION] Unbalanced parentheses: ${openParens} open, ${closeParens} close`);
            throw new Error(`Generated code has unbalanced parentheses (${openParens} open, ${closeParens} close)`);
          }

          logger.info('[VALIDATION] ✓ Generated code passed basic validation checks');
        } catch (validationError) {
          logger.error(`[VALIDATION] Code validation failed: ${validationError.message}`);
          throw new Error(`Invalid code generated by MCP: ${validationError.message}`);
        }

        // Save code if requested
        if (options.saveTo) {
          await this.saveCode(code, options.saveTo);
        }

        return code;
      }

      // Fallback to direct AI engine
      logger.info('🔄 Using direct AI engine for code generation');
      const useAIPage = (options.framework || 'playwright-ai') === 'playwright-ai';

      const prompt = `You are an expert Playwright automation engineer. Generate production-ready test code.

Test Description: ${testDescription}
${options.url ? `Target URL: ${options.url}` : ''}
Framework: ${options.framework || 'playwright-ai'}

Generate a complete Playwright test file with:
1. Proper imports (${useAIPage ? 'use AIPage from ./src/core/ai-page.js' : 'standard Playwright'})
2. Test suite with describe/test blocks
3. ${useAIPage ? 'AI-powered interactions using natural language' : 'Standard Playwright API'}
4. Proper assertions
5. Error handling
6. Comments explaining logic

Code requirements:
- Use async/await properly
- Include setup/teardown if needed
- Add meaningful test names
- Use best practices

Return ONLY the JavaScript code, no explanations.`;

      let code = await this.aiEngine.query(prompt);

      // Extract code from markdown if present
      const codeMatch = code.match(/```(?:javascript|js)?\n([\s\S]*?)```/);
      if (codeMatch) {
        code = codeMatch[1];
      }

      if (options.saveTo) {
        await this.saveCode(code, options.saveTo);
      }

      return code;

    } catch (error) {
      logger.error('❌ Generator Agent failed:', error);
      throw error;
    }
  }

  /**
   * Healer Agent - Analyze failures and suggest fixes
   * Uses MCP if enabled, falls back to AIEngine
   */
  async healTest(context, options = {}) {
    logger.info('🔧 Healer Agent: Analyzing test failure...');

    try {
      // Extract error message from context (handle both formats)
      const errorMessage = context.errorMessage || context.error?.message || context.error?.stack || 'Unknown error';
      const stackTrace = context.stackTrace || context.error?.stack || '';
      
      // Try MCP first if enabled
      if (await this.isMCPAvailable()) {
        logger.info('📡 Using MCP for failure analysis');
        const analysis = await this.mcpClient.analyzeFailure(errorMessage, {
          testCode: context.testCode,
          screenshot: context.screenshot,
          pageUrl: context.pageUrl || context.url,
          stackTrace: stackTrace
        });

        return analysis;
      }

      // Fallback to direct AI engine
      logger.info('🔄 Using direct AI engine for failure analysis');
      const prompt = `You are an expert Playwright test debugger. Analyze this test failure and provide actionable fixes.

Error Message: ${errorMessage}

${context.testCode ? `Test Code:\n${context.testCode}\n` : ''}
${context.pageUrl || context.url ? `Page URL: ${context.pageUrl || context.url}` : ''}
${stackTrace ? `Stack Trace:\n${stackTrace}` : ''}
${context.screenshot ? 'Screenshot: [Available for visual analysis]' : ''}

Provide:
1. Root Cause Analysis
2. Specific Fix (with code)
3. Prevention Strategy
4. Alternative Approaches

Format as clear, actionable markdown.`;

      const analysis = await this.aiEngine.query(prompt);
      return analysis;

    } catch (error) {
      logger.error('❌ Healer Agent failed:', error);
      throw error;
    }
  }

  /**
   * MCP-Specific: Analyze full page context
   * Only available when MCP is enabled
   */
  async analyzePageContext(page, question = null) {
    if (!(await this.isMCPAvailable())) {
      throw new Error('MCP not enabled. Set USE_MCP=true to use page context analysis');
    }

    logger.info('🌐 Analyzing page context via MCP...');
    
    try {
      const analysis = await this.mcpClient.analyzePageContext(page, question);
      return analysis;
    } catch (error) {
      logger.error('❌ Page context analysis failed:', error);
      throw error;
    }
  }

  /**
   * Get MCP server information
   */
  async getMCPInfo() {
    if (!(await this.isMCPAvailable())) {
      return {
        enabled: false,
        available: false,
        message: 'MCP is disabled. Set USE_MCP=true to enable.'
      };
    }

    try {
      const info = await this.mcpClient.getServerInfo();
      return {
        enabled: true,
        available: true,
        ...info
      };
    } catch (error) {
      return {
        enabled: true,
        available: false,
        error: error.message
      };
    }
  }

  /**
   * List available MCP tools
   */
  async listMCPTools() {
    if (!(await this.isMCPAvailable())) {
      return { tools: [] };
    }

    return await this.mcpClient.listTools();
  }

  /**
   * Direct MCP tool call
   */
  async callMCPTool(name, args) {
    if (!(await this.isMCPAvailable())) {
      throw new Error('MCP not enabled. Set USE_MCP=true to use MCP tools');
    }

    return await this.mcpClient.callTool(name, args);
  }

  /**
   * Helper: Save plan to file
   */
  async savePlan(plan, filePath) {
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, plan, 'utf-8');
      logger.info(`✅ Plan saved to: ${filePath}`);
    } catch (error) {
      logger.error('❌ Failed to save plan:', error);
      throw error;
    }
  }

  /**
   * Helper: Save code to file
   */
  async saveCode(code, filePath) {
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, code, 'utf-8');
      logger.info(`✅ Code saved to: ${filePath}`);
    } catch (error) {
      logger.error('❌ Failed to save code:', error);
      throw error;
    }
  }

  /**
   * Batch operation: Plan and Generate
   */
  async planAndGenerate(description, options = {}) {
    logger.info('🚀 Running Plan + Generate workflow...');

    const plan = await this.planTest(description, {
      testType: options.testType,
      priority: options.priority,
      saveTo: options.savePlanTo
    });

    const code = await this.generateTest(plan, {
      url: options.url,
      framework: options.framework,
      saveTo: options.saveCodeTo
    });

    return { plan, code };
  }

  /**
   * Batch operation: Generate, Run, Heal (if failed)
   */
  async generateRunAndHeal(description, page, options = {}) {
    logger.info('🔄 Running Generate → Run → Heal workflow...');

    // Generate test code
    const code = await this.generateTest(description, options);

    // In a real scenario, you'd run the test here
    // For now, we'll simulate and return the code

    return {
      code,
      status: 'generated',
      message: 'Test code generated. Run it to trigger healing if needed.'
    };
  }
}

// Export singleton instance
module.exports = new TestAgentsMCP();
