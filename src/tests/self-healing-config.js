/**
 * Self-Healing Test Configuration for MCP Integration
 * This file provides enhanced MCP-powered self-healing capabilities
 */

const { chromium, firefox, webkit } = require('@playwright/test');

class SelfHealingTestConfig {
  constructor() {
    this.retryCount = 0;
    this.maxRetries = 3;
    this.healingStrategies = new Map();
    this.errorPatterns = new Map();
    this.initializeHealingStrategies();
  }

  initializeHealingStrategies() {
    // Network-related healing strategies
    this.healingStrategies.set('NETWORK_ERROR', {
      handler: async (page, error) => {
        console.log('🔄 Network error detected, implementing healing strategy...');
        // Clear browser cache
        await page.context().clearCookies();
        // Retry with longer timeout
        await page.waitForTimeout(5000);
        return { retry: true, delay: 3000 };
      }
    });

    // Element not found healing strategies
    this.healingStrategies.set('ELEMENT_NOT_FOUND', {
      handler: async (page, error, selector) => {
        console.log('🔄 Element not found, trying alternative strategies...');
        
        // Strategy 1: Wait for page stability
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        
        // Strategy 2: Try scrolling to bring element into view
        try {
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(2000);
        } catch (e) { /* Ignore scroll errors */ }
        
        // Strategy 3: Look for dynamic attributes
        const dynamicSelectors = [
          selector.replace(/data-test/g, 'data-testid'),
          selector.replace(/\[([^\]]+)\]/g, '.$1'),
          selector.replace(/-/g, '_'),
          selector.replace(/_/g, '-')
        ];
        
        return { alternativeSelectors: dynamicSelectors, retry: true };
      }
    });

    // Timeout healing strategies
    this.healingStrategies.set('TIMEOUT_ERROR', {
      handler: async (page, error) => {
        console.log('🔄 Timeout detected, extending wait times...');
        // Increase page timeout
        page.setDefaultTimeout(60000);
        // Wait for stability
        await page.waitForLoadState('domcontentloaded');
        return { retry: true, extendedTimeout: true };
      }
    });

    // Authentication failure healing
    this.healingStrategies.set('AUTH_FAILURE', {
      handler: async (page, error) => {
        console.log('🔄 Authentication failure, clearing session...');
        // Clear all cookies and storage
        await page.context().clearCookies();
        await page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
        // Navigate back to login
        await page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
        return { retry: true, refreshPage: true };
      }
    });
  }

  // Enhanced error classification
  classifyError(error) {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('net::') || errorMessage.includes('network')) {
      return 'NETWORK_ERROR';
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('waiting for')) {
      return 'TIMEOUT_ERROR';
    }
    
    if (errorMessage.includes('not found') || errorMessage.includes('not visible')) {
      return 'ELEMENT_NOT_FOUND';
    }
    
    if (errorMessage.includes('login') || errorMessage.includes('unauthorized')) {
      return 'AUTH_FAILURE';
    }
    
    return 'UNKNOWN_ERROR';
  }

  // Advanced healing orchestrator
  async attemptHealing(page, error, context = {}) {
    const errorType = this.classifyError(error);
    const strategy = this.healingStrategies.get(errorType);
    
    if (strategy && this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`🔧 Attempting healing strategy ${this.retryCount}/${this.maxRetries} for ${errorType}`);
      
      try {
        const result = await strategy.handler(page, error, context.selector);
        
        if (result.retry) {
          if (result.delay) {
            await page.waitForTimeout(result.delay);
          }
          return { shouldRetry: true, context: result };
        }
      } catch (healingError) {
        console.log(`❌ Healing strategy failed: ${healingError.message}`);
      }
    }
    
    return { shouldRetry: false };
  }

  // Reset retry counter for new test
  resetRetryCount() {
    this.retryCount = 0;
  }

  // MCP integration helper
  async enableMCPFeatures(page) {
    // Enable Playwright MCP integration if available
    try {
      const mcpClient = await import('@playwright/mcp');
      if (mcpClient) {
        console.log('✅ MCP features enabled');
        // Configure MCP for enhanced debugging and healing
        await page.addInitScript(() => {
          window.mcpEnabled = true;
          window.mcpHealingActive = true;
        });
      }
    } catch (e) {
      console.log('⚠️ MCP not available, using fallback strategies');
    }
  }

  // Multi-browser compatibility matrix
  async getBrowserMatrix() {
    return [
      { name: 'chromium', browser: chromium },
      { name: 'firefox', browser: firefox },
      { name: 'webkit', browser: webkit }
    ];
  }

  // Performance monitoring integration
  async monitorPerformance(page) {
    await page.addInitScript(() => {
      // Monitor page load performance
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        window.mcpPerformance = {
          loadTime: perfData.loadEventEnd - perfData.loadEventStart,
          domReady: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          totalTime: perfData.loadEventEnd - perfData.fetchStart
        };
      });
    });
  }
}

// Export singleton instance
module.exports = new SelfHealingTestConfig();