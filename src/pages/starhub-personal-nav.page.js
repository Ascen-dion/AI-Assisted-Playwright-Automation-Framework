// === FILE: src/pages/starhub-personal-nav.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/starhub-personal-nav.locators');

const URL = 'https://www.starhub.com/personal.html';

class StarhubPersonalNavPage extends BasePage {
  async goto() {
    await super.goto(URL);
  }

  async clickPersonalLink() {
    await loc.personalLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.personalLink(this.page).click();
  }

  async clickSMELink() {
    await loc.smeLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.smeLink(this.page).click();
  }

  async clickEnterpriseLink() {
    await loc.enterpriseLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.enterpriseLink(this.page).click();
  }
}

module.exports = StarhubPersonalNavPage;
