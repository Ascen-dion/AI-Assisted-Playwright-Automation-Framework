/**
 * Page Object for Workday Adaptive Planning Budget Header
 * @module workday-budget-header.page
 */

const locators = require('./locators/workday-budget-header.locators');
const { expect } = require('@playwright/test');

class WorkdayBudgetHeaderPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Get page title text
   * @returns {Promise<string>} Page title
   */
  async getPageTitle() {
    await expect(locators.pageTitle(this.page)).toBeVisible();
    return await locators.pageTitle(this.page).textContent();
  }

  /**
   * Verify page title
   * @param {string} expectedTitle - Expected title text
   */
  async verifyPageTitle(expectedTitle) {
    const title = await this.getPageTitle();
    expect(title.trim()).toContain(expectedTitle);
  }

  /**
   * Click version button
   */
  async clickVersionButton() {
    await expect(locators.versionButton(this.page)).toBeVisible();
    await locators.versionButton(this.page).click();
  }

  /**
   * Select time period
   * @param {string} timePeriod - Time period to select
   */
  async selectTimePeriod(timePeriod) {
    const selector = locators.timeSelector(this.page);
    await expect(selector).toBeVisible();
    await selector.click();
    await this.page.getByText(timePeriod, { exact: true }).click();
  }

  /**
   * Select level
   * @param {string} level - Level to select
   */
  async selectLevel(level) {
    const selector = locators.levelSelector(this.page);
    await expect(selector).toBeVisible();
    await selector.click();
    await this.page.getByText(level, { exact: true }).click();
  }

  /**
   * Select currency
   * @param {string} currency - Currency to select
   */
  async selectCurrency(currency) {
    const selector = locators.currencySelector(this.page);
    await expect(selector).toBeVisible();
    await selector.click();
    await this.page.getByText(currency, { exact: true }).click();
  }
}

module.exports = WorkdayBudgetHeaderPage;