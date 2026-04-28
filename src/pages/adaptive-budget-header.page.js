/**
 * Page Object for Adaptive Planning Budget Header/Context
 * @class AdaptiveBudgetHeaderPage
 */

const budgetHeaderLocators = require('./locators/adaptive-budget-header.locators');
const logger = require('../helpers/logger');

class AdaptiveBudgetHeaderPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Verify page title contains expected text
   * @param {string} expectedTitle - Expected title text
   */
  async verifyPageTitle(expectedTitle) {
    logger.info(`Verifying page title contains: ${expectedTitle}`);
    const pageTitle = budgetHeaderLocators.pageTitle(this.page);
    await pageTitle.waitFor({ state: 'visible' });
    const titleText = await pageTitle.textContent();
    if (!titleText.includes(expectedTitle)) {
      throw new Error(`Expected title to contain "${expectedTitle}", but got "${titleText}"`);
    }
    logger.info(`Page title verified: ${titleText}`);
  }

  /**
   * Get current time period
   * @returns {Promise<string>} Current time period
   */
  async getTimePeriod() {
    logger.info('Getting current time period');
    const timeSelector = budgetHeaderLocators.timeSelector(this.page);
    await timeSelector.waitFor({ state: 'visible' });
    const timePeriod = await timeSelector.textContent();
    logger.info(`Time period: ${timePeriod}`);
    return timePeriod.trim();
  }

  /**
   * Get current currency
   * @returns {Promise<string>} Current currency
   */
  async getCurrency() {
    logger.info('Getting current currency');
    const currencySelector = budgetHeaderLocators.currencySelector(this.page);
    await currencySelector.waitFor({ state: 'visible' });
    const currency = await currencySelector.textContent();
    logger.info(`Currency: ${currency}`);
    return currency.trim();
  }

  /**
   * Verify department context
   * @param {string} expectedDepartment - Expected department name
   */
  async verifyDepartmentContext(expectedDepartment) {
    logger.info(`Verifying department context: ${expectedDepartment}`);
    const pageTitle = budgetHeaderLocators.pageTitle(this.page);
    await pageTitle.waitFor({ state: 'visible' });
    const titleText = await pageTitle.textContent();
    if (!titleText.includes(expectedDepartment)) {
      throw new Error(`Expected department "${expectedDepartment}" in title, but got "${titleText}"`);
    }
    logger.info(`Department context verified: ${expectedDepartment}`);
  }

  /**
   * Verify time period context
   * @param {string} expectedPeriod - Expected time period
   */
  async verifyTimePeriodContext(expectedPeriod) {
    logger.info(`Verifying time period context: ${expectedPeriod}`);
    const timePeriod = await this.getTimePeriod();
    if (!timePeriod.includes(expectedPeriod)) {
      throw new Error(`Expected time period "${expectedPeriod}", but got "${timePeriod}"`);
    }
    logger.info(`Time period context verified: ${expectedPeriod}`);
  }

  /**
   * Verify currency context
   * @param {string} expectedCurrency - Expected currency
   */
  async verifyCurrencyContext(expectedCurrency) {
    logger.info(`Verifying currency context: ${expectedCurrency}`);
    const currency = await this.getCurrency();
    if (!currency.includes(expectedCurrency)) {
      throw new Error(`Expected currency "${expectedCurrency}", but got "${currency}"`);
    }
    logger.info(`Currency context verified: ${expectedCurrency}`);
  }

  /**
   * Verify plan version context
   * @param {string} expectedVersion - Expected plan version
   */
  async verifyPlanVersionContext(expectedVersion) {
    logger.info(`Verifying plan version context: ${expectedVersion}`);
    const versionButton = budgetHeaderLocators.versionButton(this.page);
    await versionButton.waitFor({ state: 'visible' });
    const versionText = await versionButton.textContent();
    if (!versionText.includes(expectedVersion)) {
      throw new Error(`Expected version "${expectedVersion}", but got "${versionText}"`);
    }
    logger.info(`Plan version context verified: ${expectedVersion}`);
  }
}

module.exports = AdaptiveBudgetHeaderPage;