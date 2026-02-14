/**
 * MCP Server for Playwright Framework
 * Simplified in-process version for direct Playwright integration
 * Provides intelligent automation tools accessible to Claude via the MCP client
 */

// Playwright MCP Server - Groq Integration v2.0

const logger = require('../../utils/logger');

class PlaywrightMCPServer {
  constructor() {
    this.page = null;
    this.context = null;
  }

  /**
   * Tool Implementations
   */
  
  async navigateToUrl(args) {
    const { url, waitUntil = 'load' } = args;
    await this.page.goto(url, { waitUntil });
    logger.info(`Navigated to ${url}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully navigated to ${url}`,
        },
      ],
    };
  }

  async findElement(args) {
    const { description, strategy = 'auto' } = args;
    const elementFinder = require('../core/element-finder');
    
    let selector;
    if (strategy === 'auto') {
      selector = await elementFinder.findElement(this.page, description);
    } else {
      // Use specific strategy
      const methodName = `findBy${strategy.charAt(0).toUpperCase() + strategy.slice(1)}`;
      selector = await elementFinder[methodName](this.page, description);
    }
    
    logger.info(`Found element: ${selector}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            selector,
            description,
            strategy,
          }),
        },
      ],
    };
  }

  async clickElement(args) {
    const { selector, force = false } = args;
    
    // Trust the LLM to provide correct CSS selectors
    await this.page.click(selector, { force });
    logger.info(`Clicked element: ${selector}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully clicked: ${selector}`,
        },
      ],
    };
  }

  async fillInput(args) {
    const { selector, value } = args;
    
    await this.page.fill(selector, value);
    logger.info(`Filled input ${selector} with value`);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully filled: ${selector}`,
        },
      ],
    };
  }

  async getPageContent(args) {
    const { includeHidden = false } = args;
    const content = await this.page.content();
    
    return {
      content: [
        {
          type: 'text',
          text: content,
        },
      ],
    };
  }

  async getDOMSnapshot(args) {
    const { maxDepth = 5 } = args;
    
    // Wait for React/SPA to render (avoid capturing <noscript> fallback)
    await this.page.waitForFunction(() => {
      return !document.body.textContent.includes('You need to enable JavaScript');
    }, { timeout: 5000 }).catch(() => {
      // Timeout acceptable - page might not have noscript tag
    });
    
    const snapshot = await this.page.evaluate((depth) => {
      function simplifyNode(node, currentDepth) {
        if (currentDepth > depth || !node) return null;
        
        const simplified = {
          tag: node.tagName?.toLowerCase() || 'text',
          id: node.id || undefined,
          class: node.className || undefined,
          text: node.textContent?.trim().substring(0, 100) || undefined,
          children: [],
        };
        
        if (node.children && currentDepth < depth) {
          for (let child of node.children) {
            const childNode = simplifyNode(child, currentDepth + 1);
            if (childNode) simplified.children.push(childNode);
          }
        }
        
        return simplified;
      }
      
      return simplifyNode(document.body, 0);
    }, maxDepth);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(snapshot, null, 2),
        },
      ],
    };
  }

  async takeScreenshot(args) {
    const { fullPage = false, element } = args;
    
    let screenshot;
    if (element) {
      const el = await this.page.locator(element);
      screenshot = await el.screenshot();
    } else {
      screenshot = await this.page.screenshot({ fullPage });
    }
    
    const base64 = screenshot.toString('base64');
    
    return {
      content: [
        {
          type: 'image',
          data: base64,
          mimeType: 'image/png',
        },
      ],
    };
  }

  async assertVisible(args) {
    const { selector, timeout = 5000 } = args;
    
    const isVisible = await this.page.locator(selector).isVisible({ timeout });
    
    if (!isVisible) {
      throw new Error(`Element not visible: ${selector}`);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: `Element visible: ${selector}`,
        },
      ],
    };
  }

  async assertText(args) {
    const { selector, expectedText } = args;
    
    const actualText = await this.page.locator(selector).textContent();
    
    if (!actualText.includes(expectedText)) {
      throw new Error(`Expected text "${expectedText}" not found. Actual: "${actualText}"`);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: `Text assertion passed: "${expectedText}" found in ${selector}`,
        },
      ],
    };
  }

  async waitForSelector(args) {
    const { selector, state = 'visible', timeout = 30000 } = args;
    
    await this.page.waitForSelector(selector, { state, timeout });
    
    return {
      content: [
        {
          type: 'text',
          text: `Selector ${selector} reached state: ${state}`,
        },
      ],
    };
  }

  async executeJavaScript(args) {
    const { script, args: scriptArgs = [] } = args;
    
    const result = await this.page.evaluate(
      new Function('args', script),
      scriptArgs
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result),
        },
      ],
    };
  }

  async generateTest(args) {
    const { testDescription, url } = args;
    
    // This would integrate with Claude to generate test code
    // For now, return a template
    const testTemplate = `
const { test } = require('../core/ai-test-runner');

test.describe('${testDescription}', () => {
  test('${testDescription}', async ({ aiPage, mcpClaude }) => {
    // Navigate to application
    await mcpClaude.navigate('${url}');
    
    // Let Claude generate the rest based on: ${testDescription}
    // MCP will analyze the page and suggest actions
    
    // Example: await mcpClaude.interact('click login button');
    // Example: await mcpClaude.interact('fill email with test@example.com');
    // Example: await mcpClaude.verify('user is logged in');
  });
});
    `;
    
    return {
      content: [
        {
          type: 'text',
          text: testTemplate,
        },
      ],
    };
  }

  /**
   * Set page instance for tool operations
   */
  setPage(page, context = null) {
    this.page = page;
    this.context = context;
    logger.info('MCP Server: Page instance initialized');
  }
}

module.exports = PlaywrightMCPServer;
