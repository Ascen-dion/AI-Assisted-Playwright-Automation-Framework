// === FILE: src/web/pages/medtronic-our-company.page.js ===
/**
 * Page object for the Medtronic India Our Company page.
 * Target URL: https://www.medtronic.com/in-en/our-company.html
 *
 * Covers:
 *   - Company page navigation
 *   - Sub-page navigation (Mission, Leadership, Key Facts, etc.)
 */

const BasePage = require('./base.page');
const loc = require('../locators/medtronic-our-company.locators');

const OUR_COMPANY_URL = 'https://www.medtronic.com/in-en/our-company.html';

class MedtronicOurCompanyPage extends BasePage {
  /**
   * Navigate to the Our Company page.
   */
  async goto() {
    await super.goto(OUR_COMPANY_URL);
  }

  /**
   * Clicks the Mission link.
   */
  async clickMission() {
    await loc.missionLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.missionLink(this.page).click();
  }

  /**
   * Clicks the Leadership link.
   */
  async clickLeadership() {
    await loc.leadershipLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.leadershipLink(this.page).click();
  }

  /**
   * Clicks the Key Facts link.
   */
  async clickKeyFacts() {
    await loc.keyFactsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.keyFactsLink(this.page).click();
  }

  /**
   * Clicks the History link.
   */
  async clickHistory() {
    await loc.historyLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.historyLink(this.page).click();
  }

  /**
   * Clicks the Medtronic in India link.
   */
  async clickMedtronicIndia() {
    await loc.medtronicIndiaLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.medtronicIndiaLink(this.page).click();
  }

  /**
   * Clicks the Careers link.
   */
  async clickCareers() {
    await loc.careersLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.careersLink(this.page).click();
  }
}

module.exports = MedtronicOurCompanyPage;
