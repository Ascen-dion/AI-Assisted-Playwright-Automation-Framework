/**
 * Page Object for Adaptive Planning Navigation
 */

const loc = require('./locators/adaptive-navigation.locators');

class AdaptiveNavigationPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a menu item by name
   * @param {string} menuName - Name of the menu item to click
   */
  async navigateToMenuItem(menuName) {
    await loc.menuItem(this.page, menuName).waitFor({ state: 'visible', timeout: 10000 });
    await loc.menuItem(this.page, menuName).click();
  }

  /**
   * Navigate to Budget Entry - Sales page
   */
  async navigateToBudgetEntrySales() {
    await this.navigateToMenuItem('Budget Entry - Sales');
  }

  /**
   * Check if sidebar is visible
   * @returns {Promise<boolean>} - True if sidebar is visible
   */
  async isSidebarVisible() {
    try {
      await loc.sidebar(this.page).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get active menu item text
   * @returns {Promise<string>} - Text of active menu item
   */
  async getActiveMenuItemText() {
    await loc.activeMenuItem(this.page).waitFor({ state: 'visible', timeout: 5000 });
    return await loc.activeMenuItem(this.page).textContent();
  }
}

module.exports = AdaptiveNavigationPage;