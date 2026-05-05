// === FILE: config/playwright-bdd.config.js ===
/**
 * Playwright BDD Configuration — Gherkin/Cucumber integration via playwright-bdd.
 *
 * This config is used exclusively for BDD tests written in Gherkin syntax.
 * Standard POM-based specs continue to use config/playwright.config.js.
 *
 * Usage:
 *   # Generate Playwright specs from .feature files
 *   npx bddgen --config config/playwright-bdd.config.js
 *
 *   # Run BDD tests
 *   npx playwright test --config=config/playwright-bdd.config.js
 *
 *   # Run by tag
 *   npx playwright test --config=config/playwright-bdd.config.js --grep @smoke
 */

const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const STORAGE_STATE = path.resolve(__dirname, '../playwright/.auth/workday-storageState.json');

// Define BDD configuration — tells playwright-bdd where features and steps live
const testDir = defineBddConfig({
  featuresRoot: path.resolve(__dirname, '../src/bdd/features'),
  features: path.resolve(__dirname, '../src/bdd/features/**/*.feature'),
  steps: [
    path.resolve(__dirname, '../src/bdd/support/fixtures.js'),
    path.resolve(__dirname, '../src/bdd/steps/common.steps.js'),
    path.resolve(__dirname, '../src/bdd/steps/**/*.steps.js'),
  ],
});

module.exports = defineConfig({
  // Global setup: logs into the application once and saves storage state
  globalSetup: require.resolve('./globalSetup.js'),

  // Test directory — playwright-bdd generates .spec.js files here
  testDir,

  // Maximum time one test can run
  timeout: 60 * 1000,

  expect: {
    timeout: 10000,
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 1,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Playwright artifacts output directory
  outputDir: path.resolve(__dirname, '../test-results/artifacts'),

  // Reporter to use
  reporter: [
    ['html', { outputFolder: path.resolve(__dirname, '../playwright-report'), open: 'never' }],
    ['blob', { outputDir: path.resolve(__dirname, '../test-results/blob-report') }],
    ['json', { outputFile: path.resolve(__dirname, '../test-results/results.json') }],
    ['list'],
    // TestRail reporter
    [path.resolve(__dirname, '../src/integrations/testrail-reporter.js')],
    // Logging reporter
    [path.resolve(__dirname, '../src/integrations/logging-reporter.js')],
    // HTML evidence reporter
    [path.resolve(__dirname, '../src/integrations/html-evidence-reporter.js')],
  ],

  use: {
    // Base URL
    baseURL: process.env.BASE_URL || 'https://www.starhub.com/personal.html',

    // Use saved login state
    storageState: fs.existsSync(STORAGE_STATE) ? STORAGE_STATE : undefined,

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video recording
    video: 'on',

    // Timeout for each action
    actionTimeout: 15000,

    // Browser options
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
        launchOptions: {
          args: process.env.RAILWAY_STATIC_URL ? [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
          ] : [],
        },
      },
    },
  ],
});
