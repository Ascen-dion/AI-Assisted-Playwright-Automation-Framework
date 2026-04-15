// === FILE: src/pages/starhub-entertainment-nav.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/starhub-entertainment-nav.locators');

const URL = 'https://www.starhub.com/personal.html';

class StarhubEntertainmentNavPage extends BasePage {
  async goto() {
    await super.goto(URL);
  }

  async openEntertainmentDropdown() {
    await loc.entertainmentNavButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.entertainmentNavButton(this.page).click();
  }

  async clickEntertainmentOverview() {
    await loc.entertainmentOverviewLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.entertainmentOverviewLink(this.page).click();
  }
}

module.exports = StarhubEntertainmentNavPage;
