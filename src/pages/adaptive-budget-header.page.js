const logger = require('../helpers/logger');
const locators = require('./locators/adaptive-budget-header.locators');

class AdaptiveBudgetHeaderPage {
  constructor(page) {
    this.page = page;
  }

  async getPageTitle() {
    try {
      logger.info('Getting page title');
      const pageTitle = locators.pageTitle(this.page);
      await pageTitle.waitFor({ state: 'visible', timeout: 15000 });
      const title = await pageTitle.textContent();
      logger.info(`Page title: ${title}`);
      return title.trim();
    } catch (error) {
      logger.error(`Failed to get page title: ${error.message}`);
      throw error;
    }
  }

  async getDepartmentContext() {
    try {
      logger.info('Getting department context');
      const levelSelector = locators.levelSelector(this.page);
      await levelSelector.waitFor({ state: 'visible', timeout: 15000 });
      const department = await levelSelector.textContent();
      logger.info(`Department context: ${department}`);
      return department.trim();
    } catch (error) {
      logger.error(`Failed to get department context: ${error.message}`);
      throw error;
    }
  }

  async getTimePeriodContext() {
    try {
      logger.info('Getting time period context');
      const timeSelector = locators.timeSelector(this.page);
      await timeSelector.waitFor({ state: 'visible', timeout: 15000 });
      const timePeriod = await timeSelector.textContent();
      logger.info(`Time period context: ${timePeriod}`);
      return timePeriod.trim();
    } catch (error) {
      logger.error(`Failed to get time period context: ${error.message}`);
      throw error;
    }
  }

  async getCurrencyContext() {
    try {
      logger.info('Getting currency context');
      const currencySelector = locators.currencySelector(this.page);
      await currencySelector.waitFor({ state: 'visible', timeout: 15000 });
      const currency = await currencySelector.textContent();
      logger.info(`Currency context: ${currency}`);
      return currency.trim();
    } catch (error) {
      logger.error(`Failed to get currency context: ${error.message}`);
      throw error;
    }
  }

  async getPlanVersionContext() {
    try {
      logger.info('Getting plan version context');
      const versionButton = locators.versionButton(this.page);
      await versionButton.waitFor({ state: 'visible', timeout: 15000 });
      const version = await versionButton.textContent();
      logger.info(`Plan version context: ${version}`);
      return version.trim();
    } catch (error) {
      logger.error(`Failed to get plan version context: ${error.message}`);
      throw error;
    }
  }

  async verifyContext(expectedDepartment, expectedTimePeriod, expectedCurrency, expectedVersion) {
    try {
      logger.info('Verifying context settings');
      const department = await this.getDepartmentContext();
      const timePeriod = await this.getTimePeriodContext();
      const currency = await this.getCurrencyContext();
      const version = await this.getPlanVersionContext();

      const isValid = department.includes(expectedDepartment) &&
                      timePeriod.includes(expectedTimePeriod) &&
                      currency.includes(expectedCurrency) &&
                      version.includes(expectedVersion);

      logger.info(`Context verification result: ${isValid}`);
      return isValid;
    } catch (error) {
      logger.error(`Failed to verify context: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AdaptiveBudgetHeaderPage;