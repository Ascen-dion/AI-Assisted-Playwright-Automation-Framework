// === FILE: src/windows/screens/hp-app.screen.js ===
/**
 * Screen object for the HP Windows App (myHP)
 * AUMID: AD2F1837.myHP_v10z8vjag6ke6!App
 *
 * Extends WindowsBaseScreen — inherits click(), typeText(), getText(),
 * isVisible(), waitForElement(), and screenshot() helpers.
 */

const WindowsBaseScreen = require('./windows-base.screen.js');
const locators = require('../locators/hp-app.locators.js');

class HpAppScreen extends WindowsBaseScreen {

  // ─── Navigation ────────────────────────────────────────────────────────────

  /**
   * Wait for the HP app home screen to be fully loaded.
   * Waits until the "My Notebook" heading is visible.
   */
  /**
   * Navigate to the HP app home/device screen, handling all first-launch
   * interstitial screens automatically:
   *
   *   Splash → [Privacy screen] → [Welcome screen] → Home/device screen
   *
   * On second launch, the interstitials are already dismissed so this goes
   * straight to waiting for the home screen.
   *
   * @param {number} timeout - ms to wait for WebView2 to become ready (default 30s)
   */
  async waitForHomeScreen(timeout = process.env.CI ? 90000 : 30000) {
    // Step 1: verify the window is alive (works even before WebView2 loads)
    const title = await browser.getTitle();
    if (!title || !title.toLowerCase().includes('hp')) {
      throw new Error(`HP app window not found. Window title: "${title}"`);
    }

    // Step 2: wait for React content to render ANY known screen.
    // RootWebArea appears BEFORE the React MFE renders its content — so we poll
    // for any recognisable interactive element rather than just the document root.
    // This avoids a race where dismissPrivacyScreenIfPresent() checks too early.
    await browser.waitUntil(
      async () => {
        const onPrivacy  = await this.isVisible(locators.BTN_ACCEPT_ALL);
        const onWelcome  = await this.isVisible(locators.BTN_CONTINUE_AS_GUEST);
        const onHome     = await this.isVisible(locators.HEADING_MY_NOTEBOOK);
        const navReady   = await this.isVisible(locators.BTN_SIGN_IN);
        return onPrivacy || onWelcome || onHome || navReady;
      },
      { timeout, timeoutMsg: 'HP app content did not load within timeout — no known screen detected' }
    );

    // Step 3: dismiss first-launch interstitials in order.
    // Each method is a no-op if the screen is not currently visible.
    await this.dismissPrivacyScreenIfPresent();  // Screen 1: "Your data and privacy"
    await this.dismissWelcomeScreenIfPresent();  // Screen 2: Sign in / Create account

    // Step 4: confirm the device/home page is loaded.
    // BTN_SIGN_IN = Account.NavBarView.SignInButton — exists ONLY on the home nav bar,
    // NOT on the welcome screen (which uses Account.WelcomeScreenView.SignInButton).
    await browser.waitUntil(
      async () => {
        const signIn     = await this.isVisible(locators.BTN_SIGN_IN);
        const myNotebook = await this.isVisible(locators.HEADING_MY_NOTEBOOK);
        return signIn || myNotebook;
      },
      { timeout, timeoutMsg: 'Home screen did not load: neither Sign In nav button nor My Notebook heading appeared' }
    );
  }

  /**
   * Screen 1 (first launch): "Your data and privacy" consent dialog.
   * Clicks "Accept all" and waits for the dialog to disappear.
   * Safe to call any time — no-op if the screen is not present.
   */
  async dismissPrivacyScreenIfPresent() {
    // Detect by the Accept All button's stable AutomationId — more reliable than
    // the heading text, which may take extra time to render inside the React MFE.
    const isVisible = await this.isVisible(locators.BTN_ACCEPT_ALL);
    if (!isVisible) return;

    await this.click(locators.BTN_ACCEPT_ALL);
    // Wait for the app to transition to the next screen (welcome or home).
    // More reliable than waiting for the privacy heading to disappear, because
    // WebView2 re-renders asynchronously after accepting the consent dialog.
    await browser.waitUntil(
      async () => {
        const onWelcome = await this.isVisible(locators.BTN_CONTINUE_AS_GUEST);
        const onHome    = await this.isVisible(locators.HEADING_MY_NOTEBOOK);
        return onWelcome || onHome;
      },
      { timeout: 20000, timeoutMsg: 'App did not transition away from privacy screen after clicking "Accept all"' }
    );
  }

  /**
   * Screen 2 (first launch): Welcome / sign-in onboarding screen.
   * Clicks "Continue as guest" and waits for the screen to disappear.
   * Safe to call any time — no-op if the screen is not present.
   */
  async dismissWelcomeScreenIfPresent() {
    // Detect by the stable AutomationId: WelcomeScreen.WelcomeScreenView.ContinueAsGuestButton
    const isVisible = await this.isVisible(locators.BTN_CONTINUE_AS_GUEST);
    if (!isVisible) return;

    await this.click(locators.BTN_CONTINUE_AS_GUEST);
    // Wait for the home screen to appear — more reliable than a fixed pause
    // because WebView2 render time varies depending on network / app cache state.
    await browser.waitUntil(
      async () => await this.isVisible(locators.HEADING_MY_NOTEBOOK),
      { timeout: 20000, timeoutMsg: 'Home screen did not appear after clicking "Continue as guest"' }
    );
  }

  // ─── Sign In ───────────────────────────────────────────────────────────────

  /**
   * Check if the "Sign in" button is visible on the top-right nav bar.
   * @returns {Promise<boolean>}
   */
  async isSignInButtonVisible() {
    // Try primary XPath first, then AutomationId variant
    const primary = await this.isVisible(locators.BTN_SIGN_IN);
    if (primary) return true;
    return this.isVisible(locators.BTN_SIGN_IN_ALT);
  }

  /**
   * Get the text label of the Sign In button.
   * @returns {Promise<string>}
   */
  async getSignInButtonText() {
    // Try primary locator first, then the AutomationId variant
    try {
      return await this.getText(locators.BTN_SIGN_IN);
    } catch {
      return this.getText(locators.BTN_SIGN_IN_ALT);
    }
  }

  /**
   * Click the Sign In button.
   */
  async clickSignIn() {
    await this.click(locators.BTN_SIGN_IN);
  }

  // ─── My Notebook section ───────────────────────────────────────────────────

  /**
   * Check if "My Notebook" section heading is displayed.
   * @returns {Promise<boolean>}
   */
  async isMyNotebookVisible() {
    return this.isVisible(locators.HEADING_MY_NOTEBOOK);
  }

  /**
   * Get the notebook model text.
   * @returns {Promise<string>}
   */
  async getNotebookModel() {
    return this.getText(locators.TEXT_NOTEBOOK_MODEL);
  }

  /**
   * Get the current battery / charging status label.
   * @returns {Promise<string>}
   */
  async getBatteryStatus() {
    return this.getText(locators.LABEL_BATTERY_STATUS);
  }

  /**
   * Returns the battery element if found, or null if not accessible.
   * Safe for WebView2-wrapped apps where element may not be in UIAutomation tree.
   */
  async getBatteryStatusElement() {
    try {
      const el = await $(locators.LABEL_BATTERY_STATUS);
      const displayed = await el.isDisplayed();
      return displayed ? el : null;
    } catch {
      return null;
    }
  }

  // ─── Top navigation icons ─────────────────────────────────────────────────

  /**
   * Check if the top-right navigation icons are visible.
   * @returns {Promise<{shopping: boolean, add: boolean, notifications: boolean, account: boolean}>}
   */
  async getNavBarIconsVisibility() {
    const [shopping, add, notifications, account] = await Promise.all([
      this.isVisible(locators.BTN_SHOPPING),
      this.isVisible(locators.BTN_ADD),
      this.isVisible(locators.BTN_NOTIFICATIONS),
      this.isVisible(locators.BTN_ACCOUNT),
    ]);
    return { shopping, add, notifications, account };
  }
}

module.exports = new HpAppScreen();
