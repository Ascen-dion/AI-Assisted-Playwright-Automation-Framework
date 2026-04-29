/**
 * Page Object for Workday Adaptive Planning Dashboard
 * @class WorkdayDashboardPage
 */

const loc = require('./locators/workday-dashboard.locators');

class WorkdayDashboardPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for dashboard to load
   */
  async waitForLoad() {
    await loc.container(this.page).waitFor({ state: 'visible', timeout: 60000 });
  }

  /**
   * Check if dashboard is loaded
   * @returns {Promise<boolean>}
   */
  async isLoaded() {
    try {
      await loc.container(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get welcome message
   * @returns {Promise<string>}
   */
  async getWelcomeMessage() {
    await loc.welcomeMsg(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.welcomeMsg(this.page).textContent();
  }
}

module.exports = WorkdayDashboardPage;