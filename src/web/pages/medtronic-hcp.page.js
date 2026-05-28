// === FILE: src/web/pages/medtronic-hcp.page.js ===
/**
 * Page object for the Medtronic India Healthcare Professionals page.
 * Target URL: https://www.medtronic.com/in-en/healthcare-professionals.html
 *
 * Covers:
 *   - HCP page load verification
 *   - Main heading visibility
 *   - Therapies/Products section visibility
 */

const BasePage = require('./base.page');
const loc = require('../locators/medtronic-hcp.locators');

const HCP_URL = 'https://www.medtronic.com/in-en/healthcare-professionals.html';

class MedtronicHcpPage extends BasePage {
  async goto() {
    await super.goto(HCP_URL);
  }

  async isMainHeadingVisible() {
    try {
      await loc.mainHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.mainHeading(this.page).isVisible();
    } catch {
      return false;
    }
  }

  async isTherapiesSectionVisible() {
    try {
      await loc.therapiesHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.therapiesHeading(this.page).isVisible();
    } catch {
      return false;
    }
  }
}

module.exports = MedtronicHcpPage;
