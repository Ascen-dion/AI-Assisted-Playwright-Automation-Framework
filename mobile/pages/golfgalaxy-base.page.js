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

  /**
   * Absorb the initial driver instability that occurs immediately after launchApp.
   * The mobilecli driver throws "Cannot read properties of undefined (reading 'map')"
   * when getViewHierarchy is called before the app has rendered any views.
   * Wrapping in try/catch lets the 5s window pass silently — same pattern as
   * YouTube's dismissSignInPrompt(). The real waitFor in goto() then succeeds.
   */
  async waitForAppReady() {
    try {
      await this.screen
        .getByText('Welcome')
        .waitFor({ state: 'visible', timeout: 5000 });
    } catch (_) { /* app still starting — ignore */ }
  }
}

module.exports = GolfGalaxyBasePage;
