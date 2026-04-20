const { defineConfig, devices } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const STORAGE_STATE = path.resolve(__dirname, '../playwright/.auth/workday-storageState.json');

/**
 * Playwright configuration — Capital One Workday Finance Automation (AAVA)
 */
module.exports = defineConfig({
  // Global setup: logs into Workday once and saves storage state
  globalSetup: require.resolve('./globalSetup.js'),

  testDir: path.resolve(__dirname, '../src/tests'),  // Absolute path from config location
  
  // Maximum time one test can run
  timeout: 60 * 1000,
  
  expect: {
    timeout: 10000
  },

  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 1,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
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
    [path.resolve(__dirname, '../src/integrations/testrail-reporter.js')],
    // Logging reporter — writes structured logs to logs/ via Winston (no page object changes needed)
    [path.resolve(__dirname, '../src/integrations/logging-reporter.js')]
  ],

  use: {
    // Base URL — override via WORKDAY_BASE_URL env var
    baseURL: process.env.WORKDAY_BASE_URL || 'https://impl.workday.com/capitaloneimpl1',

    // Use saved Workday login state so no test needs to re-authenticate
    storageState: fs.existsSync(STORAGE_STATE) ? STORAGE_STATE : undefined,

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video recording - enabled for all tests
    // Videos saved to test-results/<test-name>-<browser>/video.webm
    video: 'on',
    
    // Timeout for each action
    actionTimeout: 15000,
    
    // Browser options
    // On cloud/Railway: Always run headless for stability
    // On local development: Run headed by default (visible browser) for debugging
    // Override with HEADLESS=true env variable if needed
    headless: process.env.RAILWAY_STATIC_URL ? true : (process.env.HEADLESS === 'true' ? true : false),
    
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
        // Add container-safe flags for Railway/cloud environments
        launchOptions: {
          args: process.env.RAILWAY_STATIC_URL ? [
            '--no-sandbox',
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage'
          ] : []
        }
      },
    },

    // Staging environment — run with: npx playwright test --project=chromium-staging
    // Requires WORKDAY_BASE_URL env var pointing to a staging Workday tenant
    // {
    //   name: 'chromium-staging',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     baseURL: process.env.WORKDAY_STAGING_URL || process.env.WORKDAY_BASE_URL,
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
