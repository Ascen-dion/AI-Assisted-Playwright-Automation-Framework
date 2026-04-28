/**
 * Page Object for Adaptive Planning Dashboard
 * Following framework POM pattern with logger integration
 */

const locators = require('./locators/adaptive-dashboard.locators');
const logger = require('../helpers/logger');

class AdaptiveDashboardPage {
  constructor(page) {
    this.page = page;
    this.locators = locators;
  }

  /**
   * Verify dashboard is loaded
   */
  async verifyDashboardLoaded() {
    logger.info('Verifying dashboard is loaded');
    await this.locators.container(this.page).waitFor({ state: 'visible', timeout: 60000 });
    logger.info('Dashboard verified as loaded');
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboard() {
    logger.info('Waiting for dashboard to load');
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    await this.locators.container(this.page).waitFor({ state: 'visible', timeout: 60000 });
    logger.info('Dashboard loaded successfully');
  }
}

module.exports = AdaptiveDashboardPage;