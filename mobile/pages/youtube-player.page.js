// === FILE: mobile/pages/youtube-player.page.js ===
const YoutubeBasePage = require('./youtube-base.page');
const loc = require('./locators/youtube-player.locators');
const TD = require('../data/youtube-test-data');

class YoutubePlayerPage extends YoutubeBasePage {
  constructor(device, screen) {
    super(device, screen);
  }

  /** Wait for the video player surface to appear. */
  async waitForPlayer() {
    await loc.playerSurface(this.screen).waitFor({
      state: 'visible',
      timeout: TD.timeouts.videoLoad,
    });
  }

  /** Tap the player surface to reveal controls. */
  async revealControls() {
    await loc.playerSurface(this.screen).tap();
  }

  /**
   * Return whether the video player surface is visible.
   * @returns {Promise<boolean>}
   */
  async isPlayerVisible() {
    return loc.playerSurface(this.screen).isVisible();
  }

  /** Get the title of the currently playing video. */
  async getVideoTitle() {
    return loc.videoTitle(this.screen).getText();
  }

  /** Get the channel name shown under the video title. */
  async getChannelName() {
    return loc.channelName(this.screen).getText();
  }

  /** Tap play/pause toggle (reveals controls first). */
  async tapPlayPause() {
    await this.revealControls();
    await loc.playPauseButton(this.screen).waitFor({
      state: 'visible',
      timeout: TD.timeouts.screenTransition,
    });
    await loc.playPauseButton(this.screen).tap();
  }

  /** Enter fullscreen. */
  async tapFullscreen() {
    await this.revealControls();
    await loc.fullscreenButton(this.screen).tap();
  }
}

module.exports = YoutubePlayerPage;
