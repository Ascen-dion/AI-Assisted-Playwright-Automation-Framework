// === FILE: mobile/pages/golfgalaxy-home.page.js ===
/**
 * GolfGalaxyHomePage — encapsulates Golf Galaxy home screen interactions.
 * Extends GolfGalaxyBasePage for launch/terminate lifecycle.
 */
const GolfGalaxyBasePage = require('./golfgalaxy-base.page');
const locators = require('./locators/golfgalaxy-home.locators');
const TD = require('../data/golfgalaxy-test-data');

class GolfGalaxyHomePage extends GolfGalaxyBasePage {
  /**
   * @param {import('mobilewright').Device} device
   * @param {import('mobilewright').Screen} screen
   */
  constructor(device, screen) {
    super(device, screen);
  }

  /** Launch the app and wait for the home screen Welcome text to appear. */
  async goto() {
    await this.launch();
    await locators.welcomeText(this.screen)
      .waitFor({ state: 'visible', timeout: TD.timeouts.appLaunch });
  }

  /** Returns the Welcome text element. */
  welcomeText() {
    return locators.welcomeText(this.screen);
  }

  /** Returns the Search Products bar element. */
  searchBar() {
    return locators.searchBar(this.screen);
  }

  /** Returns the Shop By Category heading element. */
  shopByCategory() {
    return locators.shopByCategory(this.screen);
  }

  /** Returns the bottom nav Shop tab element. */
  bottomNavShop() {
    return locators.bottomNavShop(this.screen);
  }

  /** Returns the bottom nav Cart tab element. */
  bottomNavCart() {
    return locators.bottomNavCart(this.screen);
  }

  /** Returns the bottom nav Account tab element. */
  bottomNavAccount() {
    return locators.bottomNavAccount(this.screen);
  }

  /** Returns the bottom nav Scheduler tab element. */
  bottomNavScheduler() {
    return locators.bottomNavScheduler(this.screen);
  }
}

module.exports = GolfGalaxyHomePage;
