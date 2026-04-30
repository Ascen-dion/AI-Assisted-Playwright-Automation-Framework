// === FILE: mobile/pages/youtube-base.page.js ===
/**
 * YoutubeBasePage — shared foundation for all YouTube mobile page objects.
 * Receives Mobilewright `device` and `screen` from each subclass constructor.
 */
const TD = require('../data/youtube-test-data');

class YoutubeBasePage {
  /**
   * @param {import('mobilewright').Device} device
   * @param {import('mobilewright').Screen} screen
   */
  constructor(device, screen) {
    this.device = device;
    this.screen = screen;
  }

  /** Launch YouTube from a clean state, killing any existing session first. */
  async launch() {
    try {
      await this.device.terminateApp(TD.app.bundleId);
    } catch (_) { /* not running — ignore */ }
    await this.device.launchApp(TD.app.bundleId);
  }

  /** Terminate YouTube. */
  async close() {
    try {
      await this.device.terminateApp(TD.app.bundleId);
    } catch (_) {}
  }

  /**
   * Dismiss the initial sign-in / consent overlay if it appears.
   * Silently swallows the error when the overlay is already gone.
   */
  async dismissSignInPrompt() {
    try {
      await this.screen
        .getByRole('button', { name: /skip|not now|dismiss/i })
        .waitFor({ state: 'visible', timeout: 4000 });
      await this.screen.getByRole('button', { name: /skip|not now|dismiss/i }).tap();
    } catch (_) {}
  }
}

module.exports = YoutubeBasePage;
