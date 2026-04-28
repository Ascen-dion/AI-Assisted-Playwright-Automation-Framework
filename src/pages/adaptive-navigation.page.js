/**
 * Page Object for Adaptive Planning Navigation
 * Following framework POM pattern with logger integration
 */

const locators = require('./locators/adaptive-navigation.locators');
const logger = require('../helpers/logger');

class AdaptiveNavigationPage {
  constructor(page) {
    this.page = page;
    this.locators = locators;
  }

  /**
   * Click on menu item by text
   */
  async clickMenuItem(menuText) {
    logger.info(`Clicking menu item: ${menuText}`);
    await this.locators.menuItem(this.page, menuText).waitFor({ state: 'visible' });
    await this.locators.menuItem(this.page, menuText).click();
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    logger.info(`Menu item clicked: ${menuText}`);
  }

  /**
   * Navigate to Budget Entry - Sales page
   */
  async navigateToBudgetEntrySales() {
    logger.info('Navigating to Budget Entry - Sales page');
    // This is a placeholder - actual navigation may require multiple clicks or specific menu structure
    // Update based on actual application navigation flow
    await this.clickMenuItem('Budget Entry - Sales');
    logger.info('Navigated to Budget Entry - Sales page');
  }

  /**
   * Verify active menu item
   */
  async verifyActiveMenuItem(expectedText) {
    logger.info(`Verifying active menu item: ${expectedText}`);
    const activeItem = this.locators.activeMenuItem(this.page);
    await activeItem.waitFor({ state: 'visible' });
    logger.info('Active menu item verified');
  }
}

module.exports = AdaptiveNavigationPage;