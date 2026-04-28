/**
 * Page Object for Adaptive Planning Navigation
 * Framework Rule: Page objects contain action methods, no assertions
 */

const loc = require('./locators/adaptive-planning-nav.locators');

class AdaptivePlanningNavPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific menu item
   * @param {string} menuText - Text of the menu item to click
   */
  async navigateToMenuItem(menuText) {
    await loc.sidebar(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.menuItem(this.page, menuText).waitFor({ state: 'visible', timeout: 15000 });
    await loc.menuItem(this.page, menuText).click();
  }

  /**
   * Navigate to Budget Entry - Sales page
   */
  async navigateToBudgetEntrySales() {
    await this.navigateToMenuItem('Budget Entry - Sales');
    // Wait for page to load
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  }

  /**
   * Get active menu item text
   * @returns {Promise<string>}
   */
  async getActiveMenuItemText() {
    await loc.activeMenuItem(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.activeMenuItem(this.page).textContent();
  }

  /**
   * Check if sidebar is visible
   * @returns {Promise<boolean>}
   */
  async isSidebarVisible() {
    try {
      await loc.sidebar(this.page).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = AdaptivePlanningNavPage;