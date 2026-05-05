/**
 * Workday Budget Header Page Object
 * Handles budget header controls (version, time, level, currency selectors)
 */

const budgetHeaderLocators = require('./locators/workday-budget-header.locators');
const sharedLocators = require('./locators/workday-shared.locators');

class WorkdayBudgetHeaderPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Get page title text
   * @returns {Promise<string>}
   */
  async getPageTitle() {
    await budgetHeaderLocators.pageTitle(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await budgetHeaderLocators.pageTitle(this.page).textContent();
  }

  /**
   * Click version button
   */
  async clickVersionButton() {
    await budgetHeaderLocators.versionButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await budgetHeaderLocators.versionButton(this.page).click();
  }

  /**
   * Select time period
   * @param {string} timePeriod - Time period to select
   */
  async selectTimePeriod(timePeriod) {
    await budgetHeaderLocators.timeSelector(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await budgetHeaderLocators.timeSelector(this.page).click();
    await this.page.getByText(timePeriod, { exact: true }).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select level
   * @param {string} level - Level to select
   */
  async selectLevel(level) {
    await budgetHeaderLocators.levelSelector(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await budgetHeaderLocators.levelSelector(this.page).click();
    await this.page.getByText(level, { exact: true }).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select currency
   * @param {string} currency - Currency to select
   */
  async selectCurrency(currency) {
    await budgetHeaderLocators.currencySelector(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await budgetHeaderLocators.currencySelector(this.page).click();
    await this.page.getByText(currency, { exact: true }).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify page title is visible
   * @returns {Promise<boolean>}
   */
  async isPageTitleVisible() {
    try {
      await budgetHeaderLocators.pageTitle(this.page).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = WorkdayBudgetHeaderPage;