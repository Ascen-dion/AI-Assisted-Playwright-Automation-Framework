/**
 * Optimized Playwright Configuration for Salesforce Tests
 * 
 * This configuration provides:
 * - Increased timeouts for slow Salesforce Lightning UI
 * - Retry logic for flaky tests
 * - Better error handling
 * - Optimized video/screenshot capture
 */

const { defineConfig, devices } = require('@playwright/test');
const baseConfig = require('./playwright.config');

module.exports = defineConfig({
  ...baseConfig,

  // Test timeout configurations
  timeout: 90000, // 90 seconds (increased from 60s)
  
  expect: {
    timeout: 10000, // Assertion timeout: 10 seconds
  },

  // Global setup/teardown timeouts
  globalTimeout: 3600000, // 1 hour for entire test suite
  
  // Retry configuration
  retries: process.env.CI ? 2 : 1, // 2 retries in CI, 1 locally
  
  // Worker configuration
  workers: process.env.CI ? 1 : 1, // Single worker to avoid Salesforce rate limiting
  
  // Fullyparallel disabled for Salesforce (sequential execution)
  fullyParallel: false,
  
  // Reporter configuration
  reporter: [
    ['list'], // Console output
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never' // Don't auto-open
    }],
    ['json', { 
      outputFile: 'test-results/results.json' 
    }]
  ],

  // Projects configuration
  projects: [
    {
      name: 'salesforce-chromium',
      use: {
        ...devices['Desktop Chrome'],
        
        // Navigation timeouts
        navigationTimeout: 60000, // 60 seconds for page navigation
        
        // Action timeouts
        actionTimeout: 15000, // 15 seconds for actions (click, fill, etc.)
        
        // Screenshot on failure
        screenshot: 'only-on-failure',
        
        // Video on failure only
        video: 'retain-on-failure',
        
        // Trace on failure
        trace: 'retain-on-failure',
        
        // Viewport
        viewport: { width: 1920, height: 1080 },
        
        // Context options for better stability
        contextOptions: {
          recordVideo: {
            dir: 'test-results/videos',
            size: { width: 1920, height: 1080 }
          }
        },
        
        // Browser launch options
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ],
          slowMo: 100, // Slow down actions by 100ms for Salesforce
        }
      },
      
      // Test match patterns
      testMatch: '**/salesforce/**/*.spec.js',
      
      // Retry failed tests
      retries: 2,
      
      // Timeout per test
      timeout: 120000, // 2 minutes per test
    }
  ],

  // Web server configuration (if needed)
  webServer: baseConfig.webServer,
  
  // Use config
  use: {
    // Base URL
    baseURL: process.env.SALESFORCE_ORG_URL,
    
    // Timeouts
    navigationTimeout: 60000,
    actionTimeout: 15000,
    
    // Screenshots and videos
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Browser context
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    
    // Slower actions for Salesforce stability
    launchOptions: {
      slowMo: 100
    }
  },
});
