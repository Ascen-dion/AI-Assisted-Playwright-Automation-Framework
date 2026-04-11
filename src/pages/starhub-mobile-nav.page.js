const loc = require('./locators/starhub-mobile-nav.locators');
const BASE_URL = 'https://www.starhub.com/personal.html';

class StarHubMobileNavPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async dismissCookieConsent() {
    try {
      await this.page.getByRole('button', { name: /got it/i }).click({ timeout: 3000 });
    } catch { /* already dismissed */ }
  }

  async openMobileDropdown() {
    await loc.navButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.navButton(this.page).click();
  }

  async clickOverview() {
    await this.openMobileDropdown();
    await loc.overviewLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.overviewLink(this.page).click();
  }

  async clickAllPhones() {
    await this.openMobileDropdown();
    await loc.allPhonesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.allPhonesLink(this.page).click();
  }

  async clickApple() {
    await this.openMobileDropdown();
    await loc.appleLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.appleLink(this.page).click();
  }

  async clickSamsung() {
    await this.openMobileDropdown();
    await loc.samsungLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.samsungLink(this.page).click();
  }

  async clickOppo() {
    await this.openMobileDropdown();
    await loc.oppoLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.oppoLink(this.page).click();
  }

  async clickTabletsWatches() {
    await this.openMobileDropdown();
    await loc.tabletsWatchesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.tabletsWatchesLink(this.page).click();
  }

  async clickAccessories() {
    await this.openMobileDropdown();
    await loc.accessoriesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.accessoriesLink(this.page).click();
  }

  async click5GUnlimitedPlans() {
    await this.openMobileDropdown();
    await loc.plans5GUnlimitedLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.plans5GUnlimitedLink(this.page).click();
  }

  async clickPrepaid() {
    await this.openMobileDropdown();
    await loc.prepaidLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.prepaidLink(this.page).click();
  }

  async clickTouristPlans() {
    await this.openMobileDropdown();
    await loc.touristPlansLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.touristPlansLink(this.page).click();
  }

  async clickCISDeals() {
    await this.openMobileDropdown();
    await loc.cisLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.cisLink(this.page).click();
  }

  async clickTradeIn() {
    await this.openMobileDropdown();
    await loc.tradeInLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.tradeInLink(this.page).click();
  }

  async clickBuyNowPayLater() {
    await this.openMobileDropdown();
    await loc.buyNowPayLaterLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.buyNowPayLaterLink(this.page).click();
  }

  async clickRoaming() {
    await this.openMobileDropdown();
    await loc.roamingLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.roamingLink(this.page).click();
  }

  async clickDeviceDollars() {
    await this.openMobileDropdown();
    await loc.deviceDollarsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.deviceDollarsLink(this.page).click();
  }

  async isDropdownExpanded() {
    const btn = await loc.navButton(this.page);
    return await btn.getAttribute('aria-expanded') === 'true'
      || (await btn.evaluate(el => el.getAttribute('expanded'))) !== null;
  }

  async getDropdownLinkCount() {
    await this.openMobileDropdown();
    return await this.page.locator('button[name="Mobile"] + list a').count();
  }
}

module.exports = StarHubMobileNavPage;