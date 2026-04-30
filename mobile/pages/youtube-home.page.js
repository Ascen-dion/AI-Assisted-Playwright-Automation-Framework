// === FILE: mobile/pages/youtube-home.page.js ===
const YoutubeBasePage = require('./youtube-base.page');
const loc = require('./locators/youtube-home.locators');
const TD = require('../data/youtube-test-data');

class YoutubeHomePage extends YoutubeBasePage {
  constructor(device, screen) {
    super(device, screen);
  }

  /** Launch app and wait for the home screen to be ready. */
  async goto() {
    await this.launch();
    await this.dismissSignInPrompt();
    await this.waitForHome();
  }

  /**
   * Wait until the YouTube home screen is ready.
   * 1. Wait for the YouTube logo (always present, fast sentinel).
   * 2. Wait for the Home nav tab — confirms bottom nav is fully rendered.
   */
  async waitForHome() {
    await loc.youtubeLogo(this.screen).waitFor({
      state: 'visible',
      timeout: TD.timeouts.appLaunch,
    });
    // Wait for the LAST nav tab ('You') — ensures the full nav bar has finished rendering
    // before returning. If 'You' is visible, all of Home/Shorts/Subscriptions must be too.
    await loc.youTab(this.screen).waitFor({
      state: 'visible',
      timeout: TD.timeouts.screenTransition,
    });
  }

  /** Returns true when the Home tab is visible in the bottom nav. */
  async isHomeTabVisible() {
    return loc.homeTab(this.screen).isVisible();
  }

  /** Tap the bottom-nav Home tab. */
  async tapHomeTab() {
    await loc.homeTab(this.screen).tap();
  }

  /** Tap the bottom-nav Shorts tab. */
  async tapShortsTab() {
    await loc.shortsTab(this.screen).tap();
  }

  /** Tap the bottom-nav Subscriptions tab. */
  async tapSubscriptionsTab() {
    await loc.subscriptionsTab(this.screen).tap();
  }

  /** Tap the bottom-nav You tab (was "Library" in older versions). */
  async tapYouTab() {
    await loc.youTab(this.screen).tap();
  }

  /** Tap the inline 'Search YouTube' bar (large center tap target) to open search screen. */
  async tapSearch() {
    await loc.searchBar(this.screen).tap();
  }

  /** Tap the inline Search YouTube bar in the center of the home screen. */
  async tapSearchBar() {
    await loc.searchBar(this.screen).tap();
  }

  /** Tap the first video title in the home feed (only available when feed is populated). */
  async tapFirstVideo() {
    await loc.firstVideoTitle(this.screen).tap();
  }

  /** Return the title text of the first visible video card. */
  async getFirstVideoTitle() {
    return loc.firstVideoTitle(this.screen).getText();
  }
}

module.exports = YoutubeHomePage;
