// === FILE: src/mac/tests/hp-smart-smoke.spec.js ===
/**
 * HP Smart macOS App — Smoke Tests
 *
 * Verifies HP Smart launches correctly and key UI elements are present
 * on the home screen: Sign In button, navigation items, My Printers section,
 * and the printer status indicator.
 *
 * Run:
 *   npm run test:mac:hp
 *
 * Prerequisites:
 *   - macOS 12+ with Xcode Command Line Tools installed
 *   - Appium mac2 driver: npx appium driver install mac2
 *   - Appium running on port 4724: npm run appium:mac:start
 *   - HP Smart installed from the Mac App Store (Bundle ID: com.hp.SmartForDesktop)
 *   - Accessibility enabled for Terminal in System Settings → Privacy & Security
 *
 * Discover locators:
 *   - Xcode → Open Developer Tool → Accessibility Inspector
 *   - Or add a debug test: console.log(await browser.getPageSource())
 *   - Or use the windows-app-mcp equivalent: Accessibility Insights for Mac
 */

const hpSmart = require('../screens/hp-smart.screen.js');

describe('HP Smart — Smoke Tests', () => {

  before(async () => {
    // Wait for the HP Smart home screen to load, dismissing any first-launch
    // onboarding / privacy screens automatically.
    await hpSmart.waitForHomeScreen();
  });

  // ─── Home screen loads ───────────────────────────────────────────────────

  it('[TC-MAC-HP-001] should launch HP Smart and display the home screen', async () => {
    await browser.step('Read main window title from accessibility tree');
    const title = await browser.getTitle();

    await browser.step(`Assert title contains "HP" — got: "${title}"`);
    expect(title.toLowerCase()).toContain('hp');
  });

  // ─── Sign In button ──────────────────────────────────────────────────────

  it('[TC-MAC-HP-002] should display the Sign In button on the home screen', async () => {
    await browser.step('Check Sign In button visibility via mac2 accessibility (label: "Sign In")');
    const isVisible = await hpSmart.isSignInButtonVisible();

    if (!isVisible) {
      console.warn('Sign In button not found — verify the accessibility label with Accessibility Inspector.');
    }

    await browser.step(`Assert Sign In button is visible — result: ${isVisible}`);
    expect(isVisible).toBe(true);
  });

  it('[TC-MAC-HP-003] should display the correct label on the Sign In button', async () => {
    await browser.step('Read Sign In button accessibility label');
    const label = await hpSmart.getSignInButtonText();

    await browser.step(`Assert label contains "sign in" — got: "${label.trim()}"`);
    expect(label.trim().toLowerCase()).toContain('sign in');
  });

  // ─── Navigation ──────────────────────────────────────────────────────────

  it('[TC-MAC-HP-004] should display all main navigation items (Printers, Scan, Print)', async () => {
    await browser.step('Check visibility of main navigation items (My Printers, Scan, Print)');
    const nav = await hpSmart.getNavItemsVisibility();

    await browser.step(`Assert "My Printers" nav item visible — result: ${nav.printers}`);
    expect(nav.printers).toBe(true);

    await browser.step(`Assert "Scan" nav item visible — result: ${nav.scan}`);
    expect(nav.scan).toBe(true);

    await browser.step(`Assert "Print" nav item visible — result: ${nav.print}`);
    expect(nav.print).toBe(true);
  });

  // ─── My Printers section ─────────────────────────────────────────────────

  it('[TC-MAC-HP-005] should display the My Printers section', async () => {
    await browser.step('Check My Printers section visibility via accessibility group label');
    const isVisible = await hpSmart.isMyPrintersVisible();

    if (!isVisible) {
      console.warn('My Printers section not found — update locator with real accessibility label.');
    }

    await browser.step(`Assert My Printers section is visible — result: ${isVisible}`);
    expect(isVisible).toBe(true);
  });

  // ─── Printer status ──────────────────────────────────────────────────────

  it('[TC-MAC-HP-006] should display the printer status indicator', async () => {
    await browser.step('Find printer status element (Ready / Online / Offline)');
    const statusEl = await hpSmart.getStatusIndicatorElement();

    if (!statusEl) {
      console.warn('Printer status element not found — a printer may not be paired with HP Smart.');
    }

    await browser.step(`Assert printer status indicator is present — result: ${!!statusEl}`);
    expect(statusEl).not.toBeNull();
  });
});
