/**
 * Page Object for Adaptive Planning Dashboard
 */

const loc = require('./locators/adaptive-dashboard.locators');

class AdaptiveDashboardPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardToLoad() {
    await loc.container(this.page).waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Check if dashboard is loaded
   * @returns {Promise<boolean>} - True if dashboard is loaded
   */
  async isDashboardLoaded() {
    try {
      await this.waitForDashboardToLoad();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get welcome message text
   * @returns {Promise<string>} - Welcome message text
   */
  async getWelcomeMessage() {
    await loc.welcomeMsg(this.page).waitFor({ state: 'visible', timeout: 10000 });
    return await loc.welcomeMsg(this.page).textContent();
  }
}

module.exports = AdaptiveDashboardPage;