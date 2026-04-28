/**
 * Page Object for Adaptive Planning Dashboard
 * @class AdaptiveDashboardPage
 */

const dashboardLocators = require('./locators/adaptive-dashboard.locators');
const logger = require('../helpers/logger');

class AdaptiveDashboardPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Verify dashboard is loaded
   */
  async verifyDashboardLoaded() {
    logger.info('Verifying dashboard is loaded');
    const container = dashboardLocators.container(this.page);
    await container.waitFor({ state: 'visible', timeout: 15000 });
    logger.info('Dashboard loaded successfully');
  }

  /**
   * Verify user is logged in
   */
  async verifyUserLoggedIn() {
    logger.info('Verifying user is logged in');
    await this.verifyDashboardLoaded();
    logger.info('User is logged in');
  }
}

module.exports = AdaptiveDashboardPage;