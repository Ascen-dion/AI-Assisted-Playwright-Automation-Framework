// === FILE: src/pages/ud-products-nav.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/ud-products-nav.locators');

const URL = 'https://uniondigitalbank.io/en';

class UdProductsNavPage extends BasePage {
  async goto() {
    await super.goto(URL);
  }

  async openProductsDropdown() {
    await loc.productsDropdownTrigger(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.productsDropdownTrigger(this.page).click();
  }

  async clickUdSave() {
    await loc.udSaveLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.udSaveLink(this.page).click();
  }

  async clickUdTimeDeposit() {
    await loc.udTimeDepositLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.udTimeDepositLink(this.page).click();
  }

  async clickUdLoanProtect() {
    await loc.udLoanProtectLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.udLoanProtectLink(this.page).click();
  }

  async clickRatesAndFees() {
    await loc.ratesAndFeesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.ratesAndFeesLink(this.page).click();
  }
}

module.exports = UdProductsNavPage;
