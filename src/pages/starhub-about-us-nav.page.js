// === FILE: src/pages/starhub-about-us-nav.page.js ===
const loc = require('./locators/starhub-about-us-nav.locators');

const URL = 'https://www.starhub.com/personal.html';

class StarhubAboutUsNavPage {
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

  async clickAboutUsLink() {
    await loc.aboutUsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.aboutUsLink(this.page).click();
  }

  async getPageUrl() {
    return this.page.url();
  }
}

module.exports = StarhubAboutUsNavPage;
