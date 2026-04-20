// === FILE: src/pages/ocbc-accounts-nav.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/ocbc-accounts-nav.locators');

const URL = 'https://www.ocbc.com/personal-banking';

class OcbcAccountsNavPage extends BasePage {
  async goto() {
    await super.goto(URL);
  }

  async openAccountsDropdown() {
    await loc.accountsTab(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.accountsTab(this.page).click();
  }

  async clickSavingsAccounts() {
    await loc.savingsAccountsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.savingsAccountsLink(this.page).click();
  }

  async clickCurrentAccounts() {
    await loc.currentAccountsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.currentAccountsLink(this.page).click();
  }

  async clickFixedDeposits() {
    await loc.fixedDepositsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.fixedDepositsLink(this.page).click();
  }

  async click360Account() {
    await loc.account360Link(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.account360Link(this.page).click();
  }

  async clickCompareAccounts() {
    await loc.compareAccountsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.compareAccountsLink(this.page).click();
  }
}

module.exports = OcbcAccountsNavPage;
