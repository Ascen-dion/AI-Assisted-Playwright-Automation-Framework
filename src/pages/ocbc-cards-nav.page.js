// === FILE: src/pages/ocbc-cards-nav.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/ocbc-cards-nav.locators');

const URL = 'https://www.ocbc.com/personal-banking';

class OcbcCardsNavPage extends BasePage {
  async goto() {
    await super.goto(URL);
  }

  async openCardsDropdown() {
    await loc.cardsTab(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.cardsTab(this.page).click();
  }

  async clickCreditCards() {
    await loc.creditCardsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.creditCardsLink(this.page).click();
  }

  async clickDebitCards() {
    await loc.debitCardsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.debitCardsLink(this.page).click();
  }

  async click365Card() {
    await loc.card365Link(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.card365Link(this.page).click();
  }

  async clickTitaniumRewards() {
    await loc.titaniumRewardsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.titaniumRewardsLink(this.page).click();
  }

  async click90NCard() {
    await loc.card90NLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.card90NLink(this.page).click();
  }

  async clickCompareCards() {
    await loc.compareCardsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.compareCardsLink(this.page).click();
  }
}

module.exports = OcbcCardsNavPage;
