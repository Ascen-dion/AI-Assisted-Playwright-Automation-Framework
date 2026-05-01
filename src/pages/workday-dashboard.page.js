/**
 * Page Object for Workday Adaptive Planning Dashboard
 * @module workday-dashboard.page
 */

const locators = require('./locators/workday-dashboard.locators');
const { expect } = require('@playwright/test');

class WorkdayDashboardPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Verify dashboard is loaded
   */
  async verifyDashboardLoaded() {
    await expect(locators.container(this.page)).toBeVisible();
  }

  /**
   * Get welcome message text
   * @returns {Promise<string>} Welcome message
   */
  async getWelcomeMessage() {
    await expect(locators.welcomeMsg(this.page)).toBeVisible();
    return await locators.welcomeMsg(this.page).textContent();
  }

  /**
   * Verify welcome message is displayed
   */
  async verifyWelcomeMessageDisplayed() {
    await expect(locators.welcomeMsg(this.page)).toBeVisible();
  }

  /**
   * Verify user is on dashboard
   */
  async verifyOnDashboard() {
    await this.verifyDashboardLoaded();
    await expect(this.page).toHaveURL(/.*app.*/);
  }
}

module.exports = WorkdayDashboardPage;