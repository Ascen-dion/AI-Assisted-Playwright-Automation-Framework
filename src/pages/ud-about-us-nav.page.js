// === FILE: src/pages/ud-about-us-nav.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/ud-about-us-nav.locators');

const URL = 'https://uniondigitalbank.io/en';
const ABOUT_US_URL = 'https://uniondigitalbank.io/en/about-us';

class UdAboutUsNavPage extends BasePage {
  async goto() {
    await super.goto(URL);
  }

  async gotoAboutUs() {
    await super.goto(ABOUT_US_URL);
  }

  async clickAboutUsNav() {
    await loc.aboutUsNavLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.aboutUsNavLink(this.page).click();
  }

  async isHeroHeadingVisible() {
    await loc.heroHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.heroHeading(this.page).isVisible();
  }

  async isValuesHeadingVisible() {
    await loc.valuesHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.valuesHeading(this.page).isVisible();
  }
}

module.exports = UdAboutUsNavPage;
