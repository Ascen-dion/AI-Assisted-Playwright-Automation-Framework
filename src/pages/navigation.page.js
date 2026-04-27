/**
 * Navigation Page Object
 * Handles navigation across the Adaptive Planning application
 */

const loc = require('./locators/navigation.locators');

class NavigationPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToMenuItem(menuText) {
    await loc.menuItem(this.page, menuText).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  }

  async clickBackButton() {
    await loc.backButton(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  }

  async isBackButtonVisible() {
    return await loc.backButton(this.page).isVisible();
  }

  async getActiveMenuItem() {
    return await loc.activeMenuItem(this.page).textContent();
  }
}

module.exports = NavigationPage;