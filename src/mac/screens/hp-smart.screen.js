// === FILE: src/mac/screens/hp-smart.screen.js ===
/**
 * Screen object for the HP Smart macOS App
 * Bundle ID: com.hp.SmartForDesktop
 *
 * Extends MacBaseScreen — inherits click(), typeText(), getText(),
 * isVisible(), waitForElement(), and screenshot() helpers.
 *
 * How to discover real locators:
 *   1. Launch: npm run test:mac:hp (with a debug/pause test)
 *   2. In the paused test: await browser.getPageSource() — dumps full XML tree
 *   3. Or use Xcode → Open Developer Tool → Accessibility Inspector
 *      → Target: HP Smart → hover over UI elements to see identifiers
 */

const MacBaseScreen  = require('./mac-base.screen.js');
const locators       = require('../locators/hp-smart.locators.js');

class HpSmartScreen extends MacBaseScreen {

  // ─── Launch / ready ────────────────────────────────────────────────────────

  /**
   * Wait for HP Smart home screen to be fully loaded.
   * Handles first-launch onboarding screens automatically.
   *
   * @param {number} timeout - ms to wait for app content (default 30s)
   */
  async waitForHomeScreen(timeout = 30000) {
    // Step 1: confirm the window exists
    await browser.waitUntil(
      async () => {
        try {
          const win = await $(locators.MAIN_WINDOW);
          return win.isExisting();
        } catch {
          return false;
        }
      },
      { timeout, timeoutMsg: 'HP Smart main window did not appear within timeout' }
    );

    // Step 2: wait until any recognisable content is loaded
    await browser.waitUntil(
      async () => {
        const onOnboarding  = await this.isVisible(locators.BTN_GET_STARTED);
        const onSkip        = await this.isVisible(locators.BTN_SKIP);
        const onAccept      = await this.isVisible(locators.BTN_ACCEPT);
        const onHome        = await this.isVisible(locators.BTN_SIGN_IN);
        const navReady      = await this.isVisible(locators.NAV_MY_PRINTERS);
        return onOnboarding || onSkip || onAccept || onHome || navReady;
      },
      { timeout, timeoutMsg: 'HP Smart content did not load — no known screen detected' }
    );

    // Step 3: dismiss any first-launch interstitials
    await this.dismissPrivacyScreenIfPresent();
    await this.dismissOnboardingIfPresent();
  }

  /**
   * Dismiss privacy/data consent screen if present.
   * Safe to call any time — no-op if not on that screen.
   */
  async dismissPrivacyScreenIfPresent() {
    if (!(await this.isVisible(locators.BTN_ACCEPT))) return;
    await this.click(locators.BTN_ACCEPT);
    await browser.pause(1000); // brief pause for animation
  }

  /**
   * Dismiss welcome/onboarding screen if present.
   * Clicks "Get Started" or "Skip" to proceed to the home screen.
   */
  async dismissOnboardingIfPresent() {
    if (await this.isVisible(locators.BTN_SKIP)) {
      await this.click(locators.BTN_SKIP);
      await browser.pause(1000);
      return;
    }
    if (await this.isVisible(locators.BTN_GET_STARTED)) {
      await this.click(locators.BTN_GET_STARTED);
      await browser.pause(1000);
    }
  }

  // ─── Sign In ───────────────────────────────────────────────────────────────

  /**
   * @returns {Promise<boolean>} true if Sign In button is visible on home screen
   */
  async isSignInButtonVisible() {
    return this.isVisible(locators.BTN_SIGN_IN);
  }

  /**
   * @returns {Promise<string>} text label of the Sign In button
   */
  async getSignInButtonText() {
    try {
      return await this.getText(locators.BTN_SIGN_IN);
    } catch {
      // mac2 fallback: try getting the accessibility label attribute
      const el = await $(locators.BTN_SIGN_IN);
      return (await el.getAttribute('label')) || '';
    }
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  /**
   * Check visibility of the main navigation items.
   * @returns {Promise<{printers: boolean, scan: boolean, print: boolean}>}
   */
  async getNavItemsVisibility() {
    return {
      printers: await this.isVisible(locators.NAV_MY_PRINTERS),
      scan:     await this.isVisible(locators.NAV_SCAN),
      print:    await this.isVisible(locators.NAV_PRINT),
    };
  }

  // ─── My Printers section ──────────────────────────────────────────────────

  /**
   * @returns {Promise<boolean>} true if My Printers section heading is visible
   */
  async isMyPrintersVisible() {
    return this.isVisible(locators.HEADING_MY_PRINTERS);
  }

  // ─── Printer status ───────────────────────────────────────────────────────

  /**
   * @returns {Promise<import('webdriverio').Element|null>} status element or null
   */
  async getStatusIndicatorElement() {
    try {
      const el = await $(locators.STATUS_INDICATOR);
      return (await el.isExisting()) ? el : null;
    } catch {
      return null;
    }
  }
}

module.exports = new HpSmartScreen();
