// === FILE: src/web/pages/medtronic-patients.page.js ===
/**
 * Page object for the Medtronic India Patients & Caregivers page.
 * Target URL: https://www.medtronic.com/in-en/patients.html
 *
 * Covers:
 *   - Patients hero section verification
 *   - Find Your Condition CTA navigation
 *   - Treatment options CTA navigation
 *   - Patient Services CTA navigation
 *   - Response Care section visibility
 *   - Stay Heart Safe section visibility
 */

const BasePage = require('./base.page');
const loc = require('../locators/medtronic-patients.locators');

const PATIENTS_URL = 'https://www.medtronic.com/in-en/patients.html';

class MedtronicPatientsPage extends BasePage {
  /**
   * Navigate to the Patients & Caregivers page.
   */
  async goto() {
    await super.goto(PATIENTS_URL);
  }

  // ── CTAs ──────────────────────────────────────────────────────────────

  /**
   * Returns whether the "FIND YOUR CONDITION" link is visible.
   * @returns {Promise<boolean>}
   */
  async isFindConditionVisible() {
    await loc.findConditionLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.findConditionLink(this.page).isVisible();
  }

  /**
   * Clicks the "FIND YOUR CONDITION" CTA.
   */
  async clickFindCondition() {
    await loc.findConditionLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.findConditionLink(this.page).click();
  }

  /**
   * Returns whether the "SELECT OPTIONS" treatment link is visible.
   * @returns {Promise<boolean>}
   */
  async isSelectOptionsVisible() {
    await loc.selectOptionsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.selectOptionsLink(this.page).isVisible();
  }

  /**
   * Clicks the "SELECT OPTIONS" CTA for treatments.
   */
  async clickSelectOptions() {
    await loc.selectOptionsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.selectOptionsLink(this.page).click();
  }

  /**
   * Returns whether the "CONTACT PATIENT SERVICES" link is visible.
   * @returns {Promise<boolean>}
   */
  async isContactPatientServicesVisible() {
    await loc.contactPatientServicesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.contactPatientServicesLink(this.page).isVisible();
  }

  /**
   * Clicks the "CONTACT PATIENT SERVICES" CTA.
   */
  async clickContactPatientServices() {
    await loc.contactPatientServicesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.contactPatientServicesLink(this.page).click();
  }

  // ── Section Visibility ────────────────────────────────────────────────

  /**
   * Returns whether the Response Care heading is visible.
   * @returns {Promise<boolean>}
   */
  async isResponseCareVisible() {
    await loc.responseCareHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.responseCareHeading(this.page).isVisible();
  }

  /**
   * Returns whether the Stay Heart Safe heading is visible.
   * @returns {Promise<boolean>}
   */
  async isHeartSafeVisible() {
    await loc.heartSafeHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.heartSafeHeading(this.page).isVisible();
  }
}

module.exports = MedtronicPatientsPage;
