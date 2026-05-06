// === FILE: config/platform/mobile.config.js ===
/**
 * Mobile platform configuration — shared settings for Mobilewright mobile tests.
 *
 * Used as a reference for platform-specific overrides.
 * The canonical Mobilewright config lives at mobilewright.config.mjs (root).
 */

const path = require('path');

module.exports = {
  platform: 'mobile',

  /** Root directory for all Mobilewright mobile test specs */
  testDir: path.resolve(__dirname, '../../src/mobile/tests'),

  /** Root directory for mobile screen objects */
  screensDir: path.resolve(__dirname, '../../src/mobile/screens'),

  /** Root directory for mobile locators */
  locatorsDir: path.resolve(__dirname, '../../src/mobile/locators'),

  /** Shared test data */
  testData: {
    golfGalaxy: path.resolve(__dirname, '../../src/shared/data/golfgalaxy-test-data.js'),
    youtube: path.resolve(__dirname, '../../src/shared/data/youtube-test-data.js'),
  },

  /** Android Mobilewright websocket endpoint */
  url: process.env.MOBILE_WS_URL || 'ws://127.0.0.1:12000/ws',

  /** Default target bundle ID (override per test with test.use()) */
  bundleId: process.env.MOBILE_BUNDLE_ID || 'com.dcsg.golfgalaxy.qa',
};
