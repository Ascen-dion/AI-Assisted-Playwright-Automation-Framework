// === FILE: src/pages/starhub-entertainment-nav.page.js ===
const loc = require('./locators/starhub-entertainment-nav.locators');

const URL = 'https://www.starhub.com/personal.html';

class StarhubEntertainmentNavPage {
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

  async openEntertainmentDropdown() {
    await loc.entertainmentNavButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.entertainmentNavButton(this.page).click();
  }

  async clickEntertainmentOverview() {
    await loc.entertainmentOverviewLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.entertainmentOverviewLink(this.page).click();
  }

  async getPageUrl() {
    return this.page.url();
  }

  async getPageTitle() {
    return this.page.title();
  }
}

module.exports = StarhubEntertainmentNavPage;
