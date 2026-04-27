const loc = require('./locators/adaptive-navigation.locators');

class AdaptiveNavigationPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToMenuItem(menuText) {
    await loc.menuItem(this.page, menuText).click();
  }

  async clickBackButton() {
    await loc.backButton(this.page).click();
  }

  async isBackButtonVisible() {
    return await loc.backButton(this.page).isVisible();
  }

  getBackButton() {
    return loc.backButton(this.page);
  }

  getActiveMenuItem() {
    return loc.activeMenuItem(this.page);
  }

  getSidebar() {
    return loc.sidebar(this.page);
  }
}

module.exports = AdaptiveNavigationPage;