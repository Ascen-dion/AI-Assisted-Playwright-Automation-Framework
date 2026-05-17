// === FILE: src/windows/data/hp-app-test-data.js ===
/**
 * Test data constants for HP App (myHP) Windows automation.
 *
 * ALL assertion strings, timeouts, and app identifiers used in HP app specs
 * must reference this file — never hardcode values inline in specs or screen objects.
 */

module.exports = {

  // ─── App identity ──────────────────────────────────────────────────────────
  app: {
    name: 'HP App',
    /** UWP AUMID — used in npm scripts via WINDOWS_APP env var */
    aumid: 'AD2F1837.myHP_v10z8vjag6ke6!App',
    /** Fragment the window title must contain (case-insensitive) */
    windowTitleContains: 'hp',
  },

  // ─── Timeouts (ms) ─────────────────────────────────────────────────────────
  timeouts: {
    /** Cold-start to home screen loaded */
    appLaunch: 20000,
    /** Wait for any dynamically loaded element */
    elementVisible: 10000,
    /** Navigation between screens */
    navigation: 15000,
  },

  // ─── Assertion values ──────────────────────────────────────────────────────
  assertions: {
    /** Sign In button label — case-insensitive match */
    signInLabel: 'sign in',
    /** Device brand fragment — partial match, immune to full model string changes */
    deviceBrand: 'hp elitebook',
  },

  // ─── Selectors (XPath) ─────────────────────────────────────────────────────
  // Provided here as a reference / for direct use in MCP discovery scripts.
  // Screen objects should import from their locators file, not from here.
  selectors: {
    signInButton:   '//Button[contains(@Name,"Sign in") or contains(@Name,"Sign In")]',
    myNotebook:     '//*[contains(@Name,"My Notebook")]',
    eliteBookModel: '//*[contains(@Name,"EliteBook")]',
    batteryStatus:  '//*[contains(@Name,"Charging") or contains(@Name,"Battery")]',
    shoppingBtn:    '//Button[contains(@Name,"Shop")]',
    addBtn:         '//Button[contains(@Name,"Add")]',
    notifBtn:       '//Button[contains(@Name,"Notification")]',
    accountBtn:     '//Button[contains(@Name,"Account")]',
  },

};
