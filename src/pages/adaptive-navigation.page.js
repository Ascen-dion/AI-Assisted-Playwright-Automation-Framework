/**
 * Page Object for Adaptive Planning Navigation
 * @class AdaptiveNavigationPage
 */

const navLocators = require('./locators/adaptive-navigation.locators');
const logger = require('../helpers/logger');

class AdaptiveNavigationPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to Budget Entry - Sales page
   */
  async navigateToBudgetEntrySales() {
    logger.info('Navigating to Budget Entry - Sales page');
    const menuItem = navLocators.menuItem(this.page, 'Budget Entry - Sales');
    await menuItem.waitFor({ state: 'visible', timeout: 15000 });
    await menuItem.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to Budget Entry - Sales page');
  }

  /**
   * Click on a menu item by text
   * @param {string} menuText - Text of the menu item
   */
  async clickMenuItem(menuText) {
    logger.info(`Clicking menu item: ${menuText}`);
    const menuItem = navLocators.menuItem(this.page, menuText);
    await menuItem.waitFor({ state: 'visible' });
    await menuItem.click();
    await this.page.waitForLoadState('networkidle');
    logger.info(`Menu item clicked: ${menuText}`);
  }

  /**
   * Verify sidebar is visible
   */
  async verifySidebarVisible() {
    logger.info('Verifying sidebar is visible');
    const sidebar = navLocators.sidebar(this.page);
    await sidebar.waitFor({ state: 'visible' });
    logger.info('Sidebar is visible');
  }
}

module.exports = AdaptiveNavigationPage;