// === FILE: src/pages/starhub-mobile-nav.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/starhub-mobile-nav.locators');

const URL = 'https://www.starhub.com/personal.html';

class StarhubMobileNavPage extends BasePage {
  async goto() {
    await super.goto(URL);
  }

  /**
   * Hover over the "Mobile" navigation button to expand the mega-menu dropdown.
   * On desktop viewports (1920x1080), the dropdown opens on hover, not click.
   */
  async openMobileDropdown() {
    await loc.mobileNavButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.mobileNavButton(this.page).hover();
  }

  /**
   * Click the "All Phones" link inside the expanded Mobile dropdown.
   * Caller must have already called openMobileDropdown().
   */
  async clickAllPhones() {
    await loc.allPhonesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.allPhonesLink(this.page).click();
  }

  /**
   * Returns the item count text (e.g. "40 items") from the device listing page header.
   */
  async getDeviceItemCountText() {
    await loc.deviceItemCount(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.deviceItemCount(this.page).textContent();
  }

  /**
   * Returns true when the device item count is visible on the listing page.
   */
  async isDeviceListingPageDisplayed() {
    await loc.deviceItemCount(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.deviceItemCount(this.page).isVisible();
  }

  /**
   * Click the Samsung Galaxy A57 5G device card on the listing page.
   */
  async clickGalaxyA57() {
    await loc.galaxyA57Card(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.galaxyA57Card(this.page).click();
  }

  /**
   * Returns true when the Samsung Galaxy A57 5G device breadcrumb title is visible on the PDP.
   */
  async isGalaxyA57PDPDisplayed() {
    await loc.deviceBreadcrumbTitle(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.deviceBreadcrumbTitle(this.page).isVisible();
  }
}

module.exports = StarhubMobileNavPage;
