/**
 * Workday Navigation Page Object
 * Handles navigation and menu interactions
 */

const navLocators = require('./locators/workday-navigation.locators');
const sharedLocators = require('./locators/workday-shared.locators');

class WorkdayNavigationPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a menu item by text
   * @param {string} menuText - Text of the menu item to click
   */
  async navigateToMenuItem(menuText) {
    await navLocators.sidebar(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await navLocators.menuItem(this.page, menuText).click();
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  /**
   * Verify menu item is active
   * @param {string} menuText - Text of the menu item
   * @returns {Promise<boolean>}
   */
  async isMenuItemActive(menuText) {
    const activeItem = await navLocators.activeMenuItem(this.page);
    const text = await activeItem.textContent();
    return text.includes(menuText);
  }

  /**
   * Click back button
   */
  async clickBack() {
    await navLocators.backButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await navLocators.backButton(this.page).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for sidebar to be visible
   */
  async waitForSidebar() {
    await navLocators.sidebar(this.page).waitFor({ state: 'visible', timeout: 15000 });
  }
}

module.exports = WorkdayNavigationPage;