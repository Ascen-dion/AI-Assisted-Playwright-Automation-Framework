// === FILE: src/mac/locators/hp-smart.locators.js ===
/**
 * Locators for the HP Smart macOS App
 * Bundle ID: com.hp.SmartForDesktop
 *
 * Locator strategy priority for macOS (mac2 / XCTest):
 *   1. ~accessibilityId  — most stable (maps to accessibility identifier/label)
 *   2. xpath             — fallback for complex queries
 *   3. predicate string  — high-performance native queries
 *   4. class chain       — structured tree traversal
 *
 * macOS XCUIElement types (common):
 *   XCUIElementTypeButton, XCUIElementTypeStaticText, XCUIElementTypeImage
 *   XCUIElementTypeWindow, XCUIElementTypeGroup, XCUIElementTypeNavigationBar
 *
 * To discover locators:
 *   1. Start Appium: npm run appium:mac:start
 *   2. Run: node -e "const wdio = require('@wdio/globals'); ..."
 *   3. Or use Accessibility Inspector (Xcode → Open Developer Tool → Accessibility Inspector)
 *   4. Or run a WDIO script with browser.getPageSource() to dump the accessibility tree
 *
 * Example discovery session:
 *   MAC_BUNDLE_ID=com.hp.SmartForDesktop npm run test:mac
 *   // In test: console.log(await browser.getPageSource())
 *   // Inspect the <XCUIElementTypeButton> labels in the XML dump
 */

module.exports = {
  // ─── Window / splash ready sentinel ──────────────────────────────────────
  /** Main application window — presence confirms app is alive */
  MAIN_WINDOW:              '//XCUIElementTypeWindow[1]',

  /** App loading ready — any visible button indicates content loaded */
  LOADING_COMPLETE_SENTINEL: '//XCUIElementTypeButton',

  // ─── Sign In / authentication ─────────────────────────────────────────────
  /**
   * Sign In button on the home screen navigation bar.
   * Accessibility label: "Sign In"
   * To confirm: Accessibility Inspector → hover over button → check "Label" field
   */
  BTN_SIGN_IN:              '~Sign In',

  /** Create Account link / button */
  BTN_CREATE_ACCOUNT:       '~Create an HP Account',

  // ─── Home screen navigation ───────────────────────────────────────────────
  /** My Printers tab / navigation item */
  NAV_MY_PRINTERS:          '~My Printers',

  /** Scan tab / navigation item */
  NAV_SCAN:                 '~Scan',

  /** Print tab / navigation item */
  NAV_PRINT:                '~Print',

  /** Photos tab / navigation item */
  NAV_PHOTOS:               '~Photos',

  // ─── Home / device section ────────────────────────────────────────────────
  /**
   * Printer name/model displayed in the "My Printers" section.
   * XPath: any static text in a group that contains typical HP model text.
   * Update with the real accessibility label after inspecting with Accessibility Inspector.
   */
  HEADING_MY_PRINTERS:      '//XCUIElementTypeGroup[@label="My Printers"]',

  /** Status indicator (Online / Offline / Ready) for the connected printer */
  STATUS_INDICATOR:         '//XCUIElementTypeStaticText[contains(@label, "Ready") or contains(@label, "Online") or contains(@label, "Offline")]',

  // ─── First-launch / onboarding screens ───────────────────────────────────
  /** "Get Started" or "Continue" button on the onboarding welcome screen */
  BTN_GET_STARTED:          '~Get Started',

  /** "Skip" or "Continue as Guest" — skip onboarding */
  BTN_SKIP:                 '~Skip',

  /** Privacy / data consent "Accept" button (if present) */
  BTN_ACCEPT:               '~Accept',

  // ─── Toolbar / menu bar items ─────────────────────────────────────────────
  /** Help menu */
  MENU_HELP:                '~Help',

  /** Settings / Preferences button */
  BTN_SETTINGS:             '~Settings',
};
