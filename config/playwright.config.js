const { defineConfig, devices } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const STORAGE_STATE = path.resolve(__dirname, '../playwright/.auth/storageState.json');

/**
 * Playwright configuration with AI framework settings
 */
module.exports = defineConfig({
  // Global setup: dismisses cookie consent once and saves storage state
  globalSetup: require.resolve('./globalSetup.js'),

  testDir: path.resolve(__dirname, '../src/web/tests'),  // Absolute path from config location
  
  // Maximum time one test can run.
  // CI runners (ubuntu-latest) connect to uniondigitalbank.io from US East;
  // navigation alone can take 40-50s. Give CI double the local budget.
  timeout: process.env.CI ? 120 * 1000 : 60 * 1000,
  
  expect: {
    // CI gets more time for assertions too (slow DOM rendering on slow network)
    timeout: process.env.CI ? 20000 : 10000
  },

  // Run tests in files in parallel
  fullyParallel: true,  // Set to true to enable parallel execution of test files
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 1,
  

// use process.env.CI ? 1 : undefined to opt in
  workers: 4,
  
  // Playwright artifacts output directory (videos, traces, screenshots)
  // Must NOT be the same folder as the HTML reporter output
  outputDir: path.resolve(__dirname, '../test-results/artifacts'),

  // Reporter to use
  reporter: [
    // Default location: playwright-report/ — required for `npx playwright show-report` (no args)
    ['html', { outputFolder: path.resolve(__dirname, '../playwright-report'), open: 'never' }],
    // Blob reporter enables shard-merge flake analysis
    ['blob', { outputDir: path.resolve(__dirname, '../test-results/blob-report') }],
    ['json', { outputFile: path.resolve(__dirname, '../test-results/results.json') }],
    ['list'],
    // TestRail reporter — posts results automatically when TESTRAIL_* env vars are set
    // If credentials are missing, it silently skips (no-op)
    [path.resolve(__dirname, '../src/shared/integrations/testrail-reporter.js')],
    // Logging reporter — writes structured logs to logs/ via Winston (no page object changes needed)
    [path.resolve(__dirname, '../src/shared/integrations/logging-reporter.js')]
  ],

  use: {
    // Base URL — override via BASE_URL env var for staging runs
    baseURL: process.env.BASE_URL || 'https://www.experian.com',

    // Use saved cookie-consent state so no test needs to dismiss the banner itself
    storageState: fs.existsSync(STORAGE_STATE) ? STORAGE_STATE : undefined,

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video recording - enabled for all tests
    // Videos saved to test-results/<test-name>-<browser>/video.webm
    video: 'on',
    
    // Timeout for each action — CI gets more budget for the same reason
    actionTimeout: process.env.CI ? 30000 : 15000,
    
    // Browser options
    // On cloud/Railway or CI (GitHub Actions): Always run headless for stability
    // On local development: Run headed by default (visible browser) for debugging
    // Override with HEADLESS=true env variable if needed
    headless: !!(process.env.RAILWAY_STATIC_URL || process.env.CI || process.env.HEADLESS === 'true'),
    
    // Viewport
    viewport: { width: 1280, height: 720 },
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Spoof a real Windows Chrome user-agent.
        // Playwright headless on Linux emits "HeadlessChrome" in the UA string
        // which sites (including uniondigitalbank.io) use to detect bots and
        // serve a 404. Overriding with a real Windows Chrome UA bypasses this.
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        // Anti-bot detection bypass + container-safe flags.
        // --no-sandbox / --disable-dev-shm-usage are required in any headless
        // environment (CI, Docker, Railway) — not just Railway.
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-blink-features=AutomationControlled',
            // Suppress the "Chrome is being controlled by automated software"
            // info bar and other automation hints visible in the DOM
            '--disable-infobars',
            '--window-size=1280,720'
          ]
        }
      },
    },

    // Staging environment — run with: npx playwright test --project=chromium-staging
    // Requires STAGING_URL env var or falls back to www.starhub.com
    // {
    //   name: 'chromium-staging',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     baseURL: process.env.STAGING_URL || process.env.BASE_URL || 'https://uniondigitalbank.io',
    //     launchOptions: {
    //       args: process.env.RAILWAY_STATIC_URL ? [
    //         '--no-sandbox',
    //         '--disable-setuid-sandbox',
    //         '--disable-dev-shm-usage'
    //       ] : []
    //     }
    //   },
    // },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // // Mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    // // Tablet viewports
    // {
    //   name: 'iPad',
    //   use: { ...devices['iPad Pro'] },
    // },
  ],

  // Run local dev server before starting tests
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
