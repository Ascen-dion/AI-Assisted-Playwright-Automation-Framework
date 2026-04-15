// === FILE: src/pages/starhub-broadband-nav.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/starhub-broadband-nav.locators');

const URL = 'https://www.starhub.com/personal.html';

class StarhubBroadbandNavPage extends BasePage {
  async goto() {
    await super.goto(URL);
  }

  async openBroadbandDropdown() {
    await loc.broadbandNavButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.broadbandNavButton(this.page).click();
  }

  async clickBroadbandOverview() {
    await loc.broadbandOverviewLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.broadbandOverviewLink(this.page).click();
  }
}

module.exports = StarhubBroadbandNavPage;
