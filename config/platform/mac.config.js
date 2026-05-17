// === FILE: config/platform/mac.config.js ===
/**
 * macOS desktop platform configuration — settings for WebDriverIO + Appium Mac2 Driver tests.
 *
 * Mirrors the structure of windows.config.js for consistency.
 * The canonical WDIO config lives at wdio.mac.config.js (root).
 *
 * macOS automation requirements (one-time setup):
 *   1. macOS 12+ (Monterey or newer recommended)
 *   2. Xcode Command Line Tools: xcode-select --install
 *   3. Install mac2 driver: npx appium driver install mac2
 *   4. Enable Accessibility for Terminal / Node in:
 *      System Settings → Privacy & Security → Accessibility
 *   5. Start Appium: npm run appium:mac:start
 *
 * App reference:
 *   HP Smart (Mac App Store): bundle ID = com.hp.SmartForDesktop
 *   Discover your app's bundle ID: osascript -e 'id of app "HP Smart"'
 */

const path = require('path');

module.exports = {
  platform: 'mac',

  /** Root directory for all macOS test specs */
  testDir: path.resolve(__dirname, '../../src/mac/tests'),

  /** Root directory for macOS screen objects */
  screensDir: path.resolve(__dirname, '../../src/mac/screens'),

  /** Root directory for macOS locators */
  locatorsDir: path.resolve(__dirname, '../../src/mac/locators'),

  /** Shared test data */
  testData: path.resolve(__dirname, '../../src/shared/data/test-data.js'),

  /**
   * Appium server URL for macOS.
   * Uses a separate port (4724) to allow Windows + macOS Appium instances to
   * co-exist on the same machine during development.
   */
  appiumUrl: process.env.MAC_APPIUM_URL || 'http://127.0.0.1:4724',

  /**
   * Target app bundle ID — override per test suite via environment variable.
   *
   * Examples:
   *   HP Smart (App Store):  com.hp.SmartForDesktop
   *   Calculator:            com.apple.calculator
   *   Finder:                com.apple.finder
   *
   * Discover bundle ID:  osascript -e 'id of app "AppName"'
   *                   OR defaults read /Applications/AppName.app/Contents/Info CFBundleIdentifier
   */
  bundleId: process.env.MAC_BUNDLE_ID || 'com.hp.SmartForDesktop',
};
