/**
 * Page Object for Adaptive Planning Budget Header Context
 */

const loc = require('./locators/adaptive-budget-header.locators');

class AdaptiveBudgetHeaderPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Get page title text
   * @returns {Promise<string>} - Page title text
   */
  async getPageTitle() {
    await loc.pageTitle(this.page).waitFor({ state: 'visible', timeout: 10000 });
    const text = await loc.pageTitle(this.page).textContent();
    return text.trim();
  }

  /**
   * Check if page title contains specific text
   * @param {string} expectedText - Expected text in title
   * @returns {Promise<boolean>} - True if title contains text
   */
  async doesPageTitleContain(expectedText) {
    const title = await this.getPageTitle();
    return title.includes(expectedText);
  }

  /**
   * Get selected time period
   * @returns {Promise<string>} - Selected time period
   */
  async getSelectedTimePeriod() {
    await loc.timeSelector(this.page).waitFor({ state: 'visible', timeout: 5000 });
    return await loc.timeSelector(this.page).textContent();
  }

  /**
   * Get selected currency
   * @returns {Promise<string>} - Selected currency
   */
  async getSelectedCurrency() {
    await loc.currencySelector(this.page).waitFor({ state: 'visible', timeout: 5000 });
    return await loc.currencySelector(this.page).textContent();
  }

  /**
   * Verify context settings
   * @param {Object} context - Expected context values
   * @returns {Promise<boolean>} - True if all context matches
   */
  async verifyContext(context) {
    try {
      const title = await this.getPageTitle();
      if (context.department && !title.includes(context.department)) {
        return false;
      }
      
      if (context.timePeriod) {
        const time = await this.getSelectedTimePeriod();
        if (!time.includes(context.timePeriod)) {
          return false;
        }
      }
      
      if (context.currency) {
        const currency = await this.getSelectedCurrency();
        if (!currency.includes(context.currency)) {
          return false;
        }
      }
      
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = AdaptiveBudgetHeaderPage;