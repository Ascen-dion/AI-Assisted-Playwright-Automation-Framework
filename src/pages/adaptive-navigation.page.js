const loc = require('./locators/adaptive-navigation.locators');
const TD = require('../data/adaptive-test-data');

class AdaptiveNavigationPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToBudgetEntrySales() {
    await loc.budgetEntrySalesLink(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  }

  async clickMenuItem(menuText) {
    await loc.menuItem(this.page, menuText).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async isMenuItemActive(menuText) {
    const activeItem = await loc.activeMenuItem(this.page).textContent();
    return activeItem.includes(menuText);
  }
}

module.exports = AdaptiveNavigationPage;