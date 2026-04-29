/**
 * Page Object for Workday Adaptive Planning Budget Header Context
 * @class WorkdayBudgetHeaderPage
 */

const loc = require('./locators/workday-budget-header.locators');

class WorkdayBudgetHeaderPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Get page title
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
   * Verify context is set correctly
   * @param {string} department - Expected department
   * @param {string} timePeriod - Expected time period
   * @param {string} currency - Expected currency
   * @param {string} planVersion - Expected plan version
   * @returns {Promise<boolean>}
   */
  async verifyContext(department, timePeriod, currency, planVersion) {
    try {
      const title = await this.getPageTitle();
      const time = await this.getTimePeriod();
      const curr = await this.getCurrency();
      const version = await this.getPlanVersion();
      
      return title.includes(department) && 
             time.includes(timePeriod) && 
             curr.includes(currency) && 
             version.includes(planVersion);
    } catch (error) {
      return false;
    }
  }
}

module.exports = WorkdayBudgetHeaderPage;