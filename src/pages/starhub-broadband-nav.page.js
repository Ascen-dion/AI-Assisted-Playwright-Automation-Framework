const loc = require('./locators/starhub-broadband-nav.locators');
const BASE_URL = 'https://www.starhub.com/personal.html';

class StarHubBroadbandNavPage {
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

  async openBroadbandDropdown() {
    await loc.navButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.navButton(this.page).click();
  }

  async clickOverview() {
    await this.openBroadbandDropdown();
    await loc.overviewLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.overviewLink(this.page).click();
  }

  async clickBroadbandPlans() {
    await this.openBroadbandDropdown();
    await loc.broadbandPlansLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.broadbandPlansLink(this.page).click();
  }

  async clickBroadbandTVBundles() {
    await this.openBroadbandDropdown();
    await loc.broadbandTVBundlesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.broadbandTVBundlesLink(this.page).click();
  }

  async click10GbpsRouters() {
    await this.openBroadbandDropdown();
    await loc.routers10GbpsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.routers10GbpsLink(this.page).click();
  }

  async clickWifi6Routers() {
    await this.openBroadbandDropdown();
    await loc.routersWifi6Link(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.routersWifi6Link(this.page).click();
  }

  async clickDigitalVoiceHomeLine() {
    await this.openBroadbandDropdown();
    await loc.dvhLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.dvhLink(this.page).click();
  }

  async clickJuniorProtect() {
    await this.openBroadbandDropdown();
    await loc.juniorProtectLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.juniorProtectLink(this.page).click();
  }

  async clickImproveHomeWifi() {
    await this.openBroadbandDropdown();
    await loc.wifiTipsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.wifiTipsLink(this.page).click();
  }
}

module.exports = StarHubBroadbandNavPage;