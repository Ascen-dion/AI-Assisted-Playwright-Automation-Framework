// === FILE: src/pages/starhub-membership-nav.page.js ===
const loc = require('./locators/starhub-membership-nav.locators');

const URL = 'https://www.starhub.com/personal.html';

class StarhubMembershipNavPage {
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

  async openMembershipDropdown() {
    await loc.membershipNavButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.membershipNavButton(this.page).click();
  }

  async clickMembershipOverview() {
    await loc.membershipOverviewLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.membershipOverviewLink(this.page).click();
  }

  async getPageUrl() {
    return this.page.url();
  }

  async getPageTitle() {
    return this.page.title();
  }
}

module.exports = StarhubMembershipNavPage;
