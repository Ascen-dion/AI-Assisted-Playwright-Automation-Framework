/**
 * Page Object for Adaptive Planning Budget Entry Header Context
 * Framework Rule: Page objects contain action methods, no assertions
 */

const loc = require('./locators/adaptive-planning-budget-header.locators');

class AdaptivePlanningBudgetHeaderPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Get page title text
   * @returns {Promise<string>}
   */
  async getPageTitle() {
    await loc.pageTitle(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.pageTitle(this.page).textContent();
  }

  /**
   * Get time period context
   * @returns {Promise<string>}
   */
  async getTimePeriod() {
    await loc.timeSelector(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.timeSelector(this.page).textContent();
  }

  /**
   * Get currency context
   * @returns {Promise<string>}
   */
  async getCurrency() {
    await loc.currencySelector(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.currencySelector(this.page).textContent();
  }

  /**
   * Get plan version context
   * @returns {Promise<string>}
   */
  async getPlanVersion() {
    await loc.versionButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.versionButton(this.page).textContent();
  }

  /**
   * Get department/level context
   * @returns {Promise<string>}
   */
  async getDepartment() {
    await loc.levelSelector(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.levelSelector(this.page).textContent();
  }
}

module.exports = AdaptivePlanningBudgetHeaderPage;