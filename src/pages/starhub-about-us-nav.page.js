// === FILE: src/pages/starhub-about-us-nav.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/starhub-about-us-nav.locators');

const URL = 'https://www.starhub.com/personal.html';

class StarhubAboutUsNavPage extends BasePage {
  async goto() {
    await super.goto(URL);
  }

  async clickAboutUsLink() {
    await loc.aboutUsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.aboutUsLink(this.page).click();
  }
}

module.exports = StarhubAboutUsNavPage;
