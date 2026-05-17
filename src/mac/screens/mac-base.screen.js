// === FILE: src/mac/screens/mac-base.screen.js ===
/**
 * Base screen object for macOS app automation.
 *
 * All macOS screen objects extend this class — mirrors the pattern in
 * src/windows/screens/windows-base.screen.js for consistency.
 *
 * Locator strategies for macOS (mac2 / XCTest / UIAutomation):
 *   ~accessibilityId          →  most stable (maps to accessibility identifier or label)
 *   //XCUIElementTypeButton   →  XPath with native element type
 *   -ios predicate string     →  NSPredicate query (high performance)
 *   -ios class chain          →  structured traversal
 */

class MacBaseScreen {
  /**
   * Navigate to / launch the screen.
   * Override in subclasses where navigation is needed.
   */
  async open() {
    // No-op by default. Subclasses override if a specific launch action is required.
  }

  // ─── Element helpers ───────────────────────────────────────────────────────

  /**
   * Wait for an element to be displayed and return it.
   * @param {string} locator  - WDIO locator string
   * @param {number} [timeout] - ms to wait (default: 10000)
   */
  async waitForElement(locator, timeout = 10000) {
    const el = await $(locator);
    await el.waitForDisplayed({ timeout });
    return el;
  }

  /**
   * Click an element, waiting for it to be clickable first.
   * @param {string} locator
   */
  async click(locator) {
    const el = await this.waitForElement(locator);
    await el.click();
  }

  /**
   * Type text into an element (clears first).
   * @param {string} locator
   * @param {string} text
   */
  async typeText(locator, text) {
    const el = await this.waitForElement(locator);
    await el.clearValue();
    await el.setValue(text);
  }

  /**
   * Get the visible text / label of an element.
   * @param {string} locator
   * @returns {Promise<string>}
   */
  async getText(locator) {
    const el = await this.waitForElement(locator);
    // mac2: getText() returns the accessibility label/value
    return el.getText();
  }

  /**
   * Check if an element is currently displayed (non-throwing).
   * @param {string} locator
   * @returns {Promise<boolean>}
   */
  async isVisible(locator) {
    try {
      const el = await $(locator);
      return el.isDisplayed();
    } catch {
      return false;
    }
  }

  /**
   * Save a screenshot to the given path.
   * @param {string} filePath - Absolute path for the PNG file
   */
  async screenshot(filePath) {
    await browser.saveScreenshot(filePath);
  }

  /**
   * Wait for a condition function to return true.
   * @param {Function} condition  - Async function returning boolean
   * @param {number}   timeout    - ms (default: 15000)
   * @param {string}   msg        - Error message if timeout
   */
  async waitUntil(condition, timeout = 15000, msg = 'Condition not met within timeout') {
    await browser.waitUntil(condition, { timeout, timeoutMsg: msg });
  }

  /**
   * Get the attribute value of an element.
   * @param {string} locator
   * @param {string} attribute
   * @returns {Promise<string>}
   */
  async getAttribute(locator, attribute) {
    const el = await this.waitForElement(locator);
    return el.getAttribute(attribute);
  }
}

module.exports = MacBaseScreen;
