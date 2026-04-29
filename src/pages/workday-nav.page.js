/**
 * Page Object for Workday Adaptive Planning Navigation
 * @class WorkdayNavPage
 */

const loc = require('./locators/workday-nav.locators');

class WorkdayNavPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a menu item by text
   * @param {string} menuText - Text of the menu item
   */
  async navigateToMenuItem(menuText) {
    await loc.menuItem(this.page, menuText).waitFor({ state: 'visible', timeout: 15000 });
    await loc.menuItem(this.page, menuText).click();
  }

  /**
   * Navigate to Budget Entry - Sales page
   */
  async navigateToBudgetEntrySales() {
    await this.navigateToMenuItem('Budget Entry - Sales');
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  }

  /**
   * Check if sidebar is visible
   * @returns {Promise<boolean>}
   */
  async isSidebarVisible() {
    try {
      await loc.sidebar(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get active menu item text
   * @returns {Promise<string>}
   */
  async getActiveMenuItem() {
    await loc.activeMenuItem(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.activeMenuItem(this.page).textContent();
  }
}

module.exports = WorkdayNavPage;