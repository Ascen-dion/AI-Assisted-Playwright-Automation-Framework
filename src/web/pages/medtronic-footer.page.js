// === FILE: src/web/pages/medtronic-footer.page.js ===
/**
 * Page object for Medtronic India footer legal link navigation.
 * Target: footer section on any Medtronic India page.
 *
 * Covers:
 *   - Privacy Statement navigation
 *   - Terms of Use navigation
 *   - Contact Us navigation
 */

const BasePage = require('./base.page');
const loc = require('../locators/medtronic-footer.locators');

const HOMEPAGE_URL = 'https://www.medtronic.com/in-en/index.html';

class MedtronicFooterPage extends BasePage {
  async goto() {
    await super.goto(HOMEPAGE_URL);
  }

  async clickPrivacyStatement() {
    await loc.privacyStatementLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.privacyStatementLink(this.page).click();
  }

  async clickTermsOfUse() {
    await loc.termsOfUseLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.termsOfUseLink(this.page).click();
  }

  async clickContact() {
    await loc.contactLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.contactLink(this.page).click();
  }
}

module.exports = MedtronicFooterPage;
