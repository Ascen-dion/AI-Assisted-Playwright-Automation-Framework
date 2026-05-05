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
}

module.exports = GolfGalaxyBasePage;
