const loc = require('./locators/starhub-membership-nav.locators');
const BASE_URL = 'https://www.starhub.com/personal.html';

class StarHubMembershipNavPage {
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

  async openMembershipDropdown() {
    await loc.navButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.navButton(this.page).click();
  }

  async clickOverview() {
    await this.openMembershipDropdown();
    await loc.overviewLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.overviewLink(this.page).click();
  }

  async clickMembershipTiers() {
    await this.openMembershipDropdown();
    await loc.membershipTiersLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.membershipTiersLink(this.page).click();
  }

  async clickWhyStarHub() {
    await this.openMembershipDropdown();
    await loc.whyStarHubLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.whyStarHubLink(this.page).click();
  }

  async clickPremierLeague() {
    await this.openMembershipDropdown();
    await loc.premierLeagueLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.premierLeagueLink(this.page).click();
  }
}

module.exports = StarHubMembershipNavPage;