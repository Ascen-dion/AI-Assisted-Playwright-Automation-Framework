// === FILE: src/pages/starhub-membership-nav.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/starhub-membership-nav.locators');

const URL = 'https://www.starhub.com/personal.html';

class StarhubMembershipNavPage extends BasePage {
  async goto() {
    await super.goto(URL);
  }

  async openMembershipDropdown() {
    await loc.membershipNavButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.membershipNavButton(this.page).click();
  }

  async clickMembershipOverview() {
    await loc.membershipOverviewLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.membershipOverviewLink(this.page).click();
  }
}

module.exports = StarhubMembershipNavPage;
