// === FILE: src/pages/ud-save-nav.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/ud-save-nav.locators');

const URL = 'https://uniondigitalbank.io/en/products-savings';

class UdSaveNavPage extends BasePage {
  async goto() {
    await super.goto(URL);
  }

  async isHeroHeadingVisible() {
    await loc.heroHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.heroHeading(this.page).isVisible();
  }

  async isSavingsFeatureVisible() {
    await loc.savingsFeatureText(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.savingsFeatureText(this.page).isVisible();
  }

  async isBillsFeatureVisible() {
    await loc.billsFeatureText(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.billsFeatureText(this.page).isVisible();
  }

  async isDownloadSectionVisible() {
    await loc.downloadSection(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.downloadSection(this.page).isVisible();
  }
}

module.exports = UdSaveNavPage;
