// === FILE: config/platform/web.config.js ===
/**
 * Web platform configuration — shared settings for Playwright web tests.
 *
 * Used as a reference for platform-specific overrides.
 * The canonical Playwright config lives at config/playwright.config.js.
 */

const path = require('path');

module.exports = {
  platform: 'web',

  /** Root directory for all Playwright web test specs */
  testDir: path.resolve(__dirname, '../../src/web/tests'),

  /** Root directory for web page objects */
  pagesDir: path.resolve(__dirname, '../../src/web/pages'),

  /** Root directory for web locators */
  locatorsDir: path.resolve(__dirname, '../../src/web/locators'),

  /** Shared fixtures entry point */
  fixtures: path.resolve(__dirname, '../../src/shared/fixtures/index.js'),

  /** Shared test data */
  testData: path.resolve(__dirname, '../../src/shared/data/test-data.js'),

  /** Base application URL (override via BASE_URL env var) */
  baseURL: process.env.BASE_URL || 'https://uniondigitalbank.io',
};
