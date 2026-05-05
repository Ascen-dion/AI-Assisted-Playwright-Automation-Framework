// === FILE: mobile/pages/golfgalaxy-base.page.js ===
/**
 * GolfGalaxyBasePage — shared foundation for all Golf Galaxy mobile page objects.
 * Receives Mobilewright `device` and `screen` from each subclass constructor.
 */
const TD = require('../data/golfgalaxy-test-data');

class GolfGalaxyBasePage {
  /**
   * @param {import('mobilewright').Device} device
   * @param {import('mobilewright').Screen} screen
   */
  constructor(device, screen) {
    this.device = device;
    this.screen = screen;
  }

  /** Launch Golf Galaxy from a clean state, killing any existing session first. */
  async launch() {
    try {
      await this.device.terminateApp(TD.app.bundleId);
    } catch (_) { /* not running — ignore */ }
    await this.device.launchApp(TD.app.bundleId);
  }

  /** Terminate Golf Galaxy. */
  async close() {
    try {
      await this.device.terminateApp(TD.app.bundleId);
    } catch (_) {}
  }

  async _tapFirstVisible(builders, timeout = 1200) {
    for (const build of builders) {
      try {
        const locator = build();
        await locator.waitFor({ state: 'visible', timeout });
        await locator.tap();
        return true;
      } catch (_) {
        // Try next locator variant.
      }
    }
    return false;
  }

  async _isAnyVisible(builders, timeout = 700) {
    for (const build of builders) {
      try {
        await build().waitFor({ state: 'visible', timeout });
        return true;
      } catch (_) {
        // Continue checking next locator.
      }
    }
    return false;
  }

  async handleFirstLaunchOnboarding() {
    const getStarted = [
      () => this.screen.getByText(new RegExp(TD.onboarding.getStartedText, 'i')),
      () => this.screen.getByLabel(new RegExp(TD.onboarding.getStartedText, 'i')),
      () => this.screen.getByRole('button', { name: new RegExp(TD.onboarding.getStartedText, 'i') }),
    ];
    const skip = [
      () => this.screen.getByText(new RegExp(`^${TD.onboarding.skipText}$`, 'i')),
      () => this.screen.getByLabel(new RegExp(`^${TD.onboarding.skipText}$`, 'i')),
      () => this.screen.getByRole('button', { name: new RegExp(`^${TD.onboarding.skipText}$`, 'i') }),
    ];
    const continueAsGuest = [
      () => this.screen.getByText(new RegExp(TD.onboarding.continueAsGuestText, 'i')),
      () => this.screen.getByLabel(new RegExp(TD.onboarding.continueAsGuestText, 'i')),
      () => this.screen.getByRole('button', { name: new RegExp(TD.onboarding.continueAsGuestText, 'i') }),
    ];

    const alreadyOnHome = await this._isAnyVisible([
      () => this.screen.getByText(TD.home.welcomeText),
      () => this.screen.getByText(TD.home.shopTab),
    ], 600);
    if (alreadyOnHome) return;

    await this._tapFirstVisible(getStarted, 1000);

    for (let i = 0; i < 2; i += 1) {
      await this._tapFirstVisible(skip, 1000);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    await this._tapFirstVisible(continueAsGuest, 1200);
  }

  /**
   * Absorb the initial driver instability that occurs immediately after launchApp.
   * The mobilecli driver throws "Cannot read properties of undefined (reading 'map')"
   * when getViewHierarchy is called before the app has rendered any views.
   * Wrapping in try/catch lets the 5s window pass silently — same pattern as
   * YouTube's dismissSignInPrompt(). The real waitFor in goto() then succeeds.
   */
  async waitForAppReady() {
    const deadline = Date.now() + TD.timeouts.appLaunch;
    while (Date.now() < deadline) {
      try {
        await Promise.any([
          this.screen.getByText(TD.home.welcomeText).waitFor({ state: 'visible', timeout: 1200 }),
          this.screen.getByText(TD.home.shopTab).waitFor({ state: 'visible', timeout: 1200 }),
        ]);
        return;
      } catch (_) {
        await this.handleFirstLaunchOnboarding();
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    throw new Error('Golf Galaxy home screen did not become ready before timeout.');
  }
}

module.exports = GolfGalaxyBasePage;
