// === FILE: src/windows/screens/windows-base.screen.js ===
/**
 * Base screen object for Windows app automation.
 *
 * All Windows screen objects extend this class — mirrors the pattern in
 * src/mobile/screens/golfgalaxy-base.page.js for consistency.
 *
 * Locator strategies for Windows (UIAutomation):
 *   by.id('AutomationId')          →  most reliable, like CSS id in web
 *   by.name('Accessible Name')     →  visible text / aria-label
 *   by.className('ControlType')    →  e.g. 'Button', 'TextBox', 'ListItem'
 *   by.xpath('//Button[@Name="X"]')→  full XPath
 *   by.css('~AutomationId')        →  WDIO shorthand for accessibility id
 */

class WindowsBaseScreen {
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
   * Get the text/value of an element.
   * @param {string} locator
   * @returns {Promise<string>}
   */
  async getText(locator) {
    const el = await this.waitForElement(locator);
    return el.getText();
  }

  /**
   * Check if an element is currently displayed.
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
   * Take a screenshot and save to the given path.
   * @param {string} filePath
   */
  async screenshot(filePath) {
    await browser.saveScreenshot(filePath);
  }
}

module.exports = WindowsBaseScreen;
