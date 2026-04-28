const logger = require('../helpers/logger');
const locators = require('./locators/adaptive-dashboard.locators');

class AdaptiveDashboardPage {
  constructor(page) {
    this.page = page;
  }

  async isDashboardLoaded() {
    try {
      logger.info('Verifying dashboard is loaded');
      const container = locators.container(this.page);
      await container.waitFor({ state: 'visible', timeout: 15000 });
      const isVisible = await container.isVisible();
      logger.info(`Dashboard loaded: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.error(`Failed to verify dashboard: ${error.message}`);
      throw error;
    }
  }

  async getWelcomeMessage() {
    try {
      logger.info('Getting welcome message');
      const welcomeMsg = locators.welcomeMsg(this.page);
      await welcomeMsg.waitFor({ state: 'visible', timeout: 15000 });
      const message = await welcomeMsg.textContent();
      logger.info(`Welcome message: ${message}`);
      return message.trim();
    } catch (error) {
      logger.error(`Failed to get welcome message: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AdaptiveDashboardPage;