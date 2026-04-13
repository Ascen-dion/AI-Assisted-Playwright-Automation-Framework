// === FILE: src/pages/starhub-broadband-nav.page.js ===
const loc = require('./locators/starhub-broadband-nav.locators');

const URL = 'https://www.starhub.com/personal.html';
const BROADBAND_PAGE_URL = 'https://www.starhub.com/personal/broadband.html';

class StarhubBroadbandNavPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async dismissCookieConsent() {
    try {
      await loc.cookieConsentButton(this.page).click({ timeout: 3000 });
    } catch {}
  }

  async openBroadbandDropdown() {
    await loc.broadbandNavButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.broadbandNavButton(this.page).click();
  }

  async clickBroadbandOverview() {
    await loc.broadbandOverviewLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.broadbandOverviewLink(this.page).click();
  }

  async getBroadbandPageUrl() {
    return this.page.url();
  }

  async getBroadbandPageTitle() {
    return this.page.title();
  }
}

module.exports = StarhubBroadbandNavPage;
