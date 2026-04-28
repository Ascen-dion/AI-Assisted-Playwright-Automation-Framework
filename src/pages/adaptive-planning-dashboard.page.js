const loc = require('./locators/adaptive-planning-dashboard.locators');

class AdaptivePlanningDashboardPage {
  constructor(page) {
    this.page = page;
  }

  async isDashboardVisible() {
    await loc.container(this.page).waitFor({ state: 'visible', timeout: 30000 });
    return await loc.container(this.page).isVisible();
  }

  async getWelcomeMessage() {
    await loc.welcomeMessage(this.page).waitFor({ state: 'visible', timeout: 30000 });
    return await loc.welcomeMessage(this.page).textContent();
  }

  async getCurrentPageUrl() {
    return this.page.url();
  }
}

module.exports = AdaptivePlanningDashboardPage;