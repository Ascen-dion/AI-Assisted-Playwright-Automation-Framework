// === FILE: src/pages/ocbc-gateway-nav.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/ocbc-gateway-nav.locators');

const URL = 'https://www.ocbc.com/group/gateway';

class OcbcGatewayNavPage extends BasePage {
  async goto() {
    await super.goto(URL);
  }

  async clickBankingForIndividuals() {
    await loc.bankingForIndividualsNavLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.bankingForIndividualsNavLink(this.page).click();
  }

  async clickPersonalBanking() {
    await loc.personalBankingLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.personalBankingLink(this.page).click();
  }
}

module.exports = OcbcGatewayNavPage;
