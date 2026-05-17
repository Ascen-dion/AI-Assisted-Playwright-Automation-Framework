// === FILE: config/platform/windows.config.js ===
/**
 * Windows desktop platform configuration — settings for WebDriverIO + Appium Windows Driver tests.
 *
 * Mirrors the structure of mobile.config.js for consistency.
 * The canonical WDIO config lives at wdio.windows.config.js (root).
 */

const path = require('path');

module.exports = {
  platform: 'windows',

  /** Root directory for all Windows test specs */
  testDir: path.resolve(__dirname, '../../src/windows/tests'),

  /** Root directory for Windows screen objects */
  screensDir: path.resolve(__dirname, '../../src/windows/screens'),

  /** Root directory for Windows locators */
  locatorsDir: path.resolve(__dirname, '../../src/windows/locators'),

  /** Shared test data */
  testData: path.resolve(__dirname, '../../src/shared/data/test-data.js'),

  /**
   * WinAppDriver / Appium Windows Driver endpoint.
   * WinAppDriver default: http://127.0.0.1:4723/wd/hub
   * If using Appium v2 server instead: http://127.0.0.1:4723
   */
  appiumUrl: process.env.WINDOWS_APPIUM_URL || 'http://127.0.0.1:4723',

  /**
   * Target app — override per test suite via environment variable.
   * Use the full path to the app .exe OR the Application User Model ID (AUMID) for UWP apps.
   * Examples:
   *   Win32/WPF/WinForms: 'C:\\Windows\\System32\\notepad.exe'
   *   UWP (AUMID):        'Microsoft.WindowsCalculator_8wekyb3d8bbwe!App'
   */
  app: process.env.WINDOWS_APP || 'Root', // 'Root' attaches to an already-running desktop session
};
