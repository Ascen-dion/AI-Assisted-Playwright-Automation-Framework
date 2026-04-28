const logger = require('../helpers/logger');
const locators = require('./locators/adaptive-navigation.locators');

class AdaptiveNavigationPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToMenuItem(menuItemName) {
    try {
      logger.info(`Navigating to menu item: ${menuItemName}`);
      const menuItem = locators.menuItem(this.page, menuItemName);
      await menuItem.waitFor({ state: 'visible', timeout: 15000 });
      await menuItem.click();
      await this.page.waitForLoadState('networkidle', { timeout: 60000 });
      logger.info(`Successfully navigated to ${menuItemName}`);
    } catch (error) {
      logger.error(`Failed to navigate to menu item ${menuItemName}: ${error.message}`);
      throw error;
    }
  }

  async navigateToBudgetEntrySales() {
    try {
      logger.info('Navigating to Budget Entry - Sales page');
      await this.navigateToMenuItem('Budget Entry - Sales');
      logger.info('Successfully navigated to Budget Entry - Sales page');
    } catch (error) {
      logger.error(`Failed to navigate to Budget Entry - Sales: ${error.message}`);
      throw error;
    }
  }

  async isMenuItemActive(menuItemName) {
    try {
      logger.info(`Checking if menu item is active: ${menuItemName}`);
      const activeMenuItem = locators.activeMenuItem(this.page);
      await activeMenuItem.waitFor({ state: 'visible', timeout: 15000 });
      const text = await activeMenuItem.textContent();
      const isActive = text.includes(menuItemName);
      logger.info(`Menu item ${menuItemName} active status: ${isActive}`);
      return isActive;
    } catch (error) {
      logger.error(`Failed to check menu item active status: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AdaptiveNavigationPage;