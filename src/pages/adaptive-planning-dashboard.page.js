/**
 * Page Object for Adaptive Planning Dashboard Page
 * Framework Rule: Page objects contain action methods, no assertions
 */

const loc = require('./locators/adaptive-planning-dashboard.locators');

class AdaptivePlanningDashboardPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboard() {
    await loc.container(this.page).waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Check if dashboard is loaded
   * @returns {Promise<boolean>}
   */
  async isDashboardLoaded() {
    try {
      await loc.container(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get welcome message text
   * @returns {Promise<string>}
   */
  async getWelcomeMessage() {
    await loc.welcomeMsg(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.welcomeMsg(this.page).textContent();
  }
}

module.exports = AdaptivePlanningDashboardPage;