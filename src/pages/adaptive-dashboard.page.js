const loc = require('./locators/adaptive-dashboard.locators');
const TD = require('../data/adaptive-test-data');

class AdaptiveDashboardPage {
  constructor(page) {
    this.page = page;
  }

  async waitForDashboardLoad() {
    await loc.container(this.page).waitFor({ state: 'visible', timeout: 30000 });
  }

  async isDashboardVisible() {
    return await loc.container(this.page).isVisible();
  }

  async waitForLoadingComplete() {
    try {
      await loc.loadingSpinner(this.page).waitFor({ state: 'hidden', timeout: 30000 });
    } catch (error) {
      // Loading spinner may not appear, continue
    }
  }
}

module.exports = AdaptiveDashboardPage;