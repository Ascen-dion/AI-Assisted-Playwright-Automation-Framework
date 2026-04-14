// === FILE: src/pages/starhub-personal-nav.page.js ===
const loc = require('./locators/starhub-personal-nav.locators');

const URL = 'https://www.starhub.com/personal.html';

class StarhubPersonalNavPage {
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

  async clickPersonalLink() {
    await loc.personalLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.personalLink(this.page).click();
  }

  async getPageUrl() {
    return this.page.url();
  }
}

module.exports = StarhubPersonalNavPage;
