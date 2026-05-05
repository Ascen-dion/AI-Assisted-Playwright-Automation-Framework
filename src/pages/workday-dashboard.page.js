/**
 * Workday Dashboard Page Object
 * Handles dashboard interactions
 */

const dashboardLocators = require('./locators/workday-dashboard.locators');
const sharedLocators = require('./locators/workday-shared.locators');

class WorkdayDashboardPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboard() {
    await dashboardLocators.container(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get welcome message text
   * @returns {Promise<string>}
   */
  async getWelcomeMessage() {
    await dashboardLocators.welcomeMsg(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await dashboardLocators.welcomeMsg(this.page).textContent();
  }

  /**
   * Verify dashboard is loaded
   * @returns {Promise<boolean>}
   */
  async isDashboardLoaded() {
    try {
      await dashboardLocators.container(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = WorkdayDashboardPage;