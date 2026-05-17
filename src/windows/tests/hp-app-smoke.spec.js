// === FILE: src/windows/tests/hp-app-smoke.spec.js ===
/**
 * HP App (myHP) Smoke Tests — Windows App Automation
 *
 * Verifies the HP app launches correctly and key UI elements are present
 * on the home screen, starting with the "Sign in" button in the top-right nav.
 *
 * Run:
 *   npm run test:windows:hp
 *
 * Prerequisites:
 *   - WinAppDriver installed (C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe)
 *   - Appium running: npm run appium:start
 *   - HP app installed (Microsoft Store: AD2F1837.myHP_v10z8vjag6ke6!App)
 */

const hpApp = require('../screens/hp-app.screen.js');

describe('HP App — Smoke Tests', () => {

  before(async () => {
    // Wait for the app to load and dismiss the "Your data and privacy" consent dialog
    // if it appears on first launch. waitForHomeScreen handles both: it waits for
    // WebView2 content then auto-dismisses the privacy screen before tests run.
    await hpApp.waitForHomeScreen();
  });

  // ─── Home screen loads ───────────────────────────────────────────────────

  it('[TC-WIN-HP-001] should launch the HP app and display the home screen', async () => {
    await browser.step('Read window title from OS');
    const title = await browser.getTitle();

    await browser.step(`Assert title contains "hp" — got: "${title}"`);
    expect(title.toLowerCase()).toContain('hp');
  });

  // ─── Sign In button ──────────────────────────────────────────────────────

  it('[TC-WIN-HP-002] should display the Sign In button in the top-right navigation bar', async () => {
    await browser.step('Check Sign In button visibility via UIAutomation (AutomationId: Account.NavBarView.SignInButton)');
    const isVisible = await hpApp.isSignInButtonVisible();

    if (!isVisible) {
      console.warn('Sign In button not found via UIAutomation — app may use WebView2 rendering. Verify manually or with Accessibility Insights.');
    }

    await browser.step(`Assert Sign In button is visible — result: ${isVisible}`);
    expect(isVisible).toBe(true);
  });

  it('[TC-WIN-HP-003] should display the correct label on the Sign In button', async () => {
    await browser.step('Read Sign In button text via UIAutomation');
    const label = await hpApp.getSignInButtonText();

    await browser.step(`Assert label equals "sign in" — got: "${label.trim()}"`);
    expect(label.trim().toLowerCase()).toBe('sign in');
  });

  // ─── Top navigation icons ────────────────────────────────────────────────

  it('[TC-WIN-HP-004] should display all top navigation bar icons (shopping, add, notifications, account)', async () => {
    await browser.step('Check visibility of all nav bar icons (shopping, add, notifications, account)');
    const icons = await hpApp.getNavBarIconsVisibility();

    await browser.step(`Assert shopping icon visible — result: ${icons.shopping}`);
    expect(icons.shopping).toBe(true);

    await browser.step(`Assert add icon visible — result: ${icons.add}`);
    expect(icons.add).toBe(true);

    await browser.step(`Assert notifications icon visible — result: ${icons.notifications}`);
    expect(icons.notifications).toBe(true);

    await browser.step(`Assert account icon visible — result: ${icons.account}`);
    expect(icons.account).toBe(true);
  });

  // ─── My Notebook section ─────────────────────────────────────────────────

  it('[TC-WIN-HP-005] should display the notebook model name in the My Notebook section', async () => {
    await browser.step('Check My Notebook heading visibility via UIAutomation (AutomationId: pcdevicedetails__device-name)');
    const isVisible = await hpApp.isMyNotebookVisible();

    if (!isVisible) {
      console.warn('My Notebook element not found via UIAutomation — content may be inside WebView2.');
    }

    await browser.step(`Assert My Notebook section is visible — result: ${isVisible}`);
    expect(isVisible).toBe(true);
  });

  it('[TC-WIN-HP-006] should display the battery/charging status', async () => {
    await browser.step('Find battery/charging status element (XPath: contains @Name with Charging|Battery)');
    const batteryEl = await hpApp.getBatteryStatusElement();

    if (!batteryEl) {
      console.warn('Battery status element not found via UIAutomation — may be inside WebView2.');
    }

    await browser.step(`Assert battery status element exists — found: ${!!batteryEl}`);
    expect(batteryEl).not.toBeNull();
  });
});
