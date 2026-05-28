// === FILE: src/web/pages/medtronic-our-impact.page.js ===
/**
 * Page object for the Medtronic India Our Impact page.
 * Target URL: https://www.medtronic.com/in-en/our-impact.html
 *
 * Covers:
 *   - Our Impact page load verification
 *   - Navigation to Health Equity sub-page
 *   - Navigation to Inclusion, Diversity & Equity sub-page
 *   - Navigation to Planet sub-page
 *   - Navigation to Communities sub-page
 */

const BasePage = require('./base.page');
const loc = require('../locators/medtronic-our-impact.locators');

const OUR_IMPACT_URL = 'https://www.medtronic.com/in-en/our-impact.html';

class MedtronicOurImpactPage extends BasePage {
  async goto() {
    await this.page.goto(OUR_IMPACT_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  }

  async clickHealthEquity() {
    await loc.healthEquityLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.healthEquityLink(this.page).click();
  }

  async clickInclusionDiversity() {
    await loc.inclusionDiversityLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.inclusionDiversityLink(this.page).click();
  }

  async clickPlanet() {
    await loc.planetLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.planetLink(this.page).click();
  }

  async clickCommunities() {
    await loc.communitiesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.communitiesLink(this.page).click();
  }
}

module.exports = MedtronicOurImpactPage;
