const loc = require('./locators/adaptive-dashboard.locators');

class AdaptiveDashboardPage {
  constructor(page) {
    this.page = page;
  }

  async isDashboardVisible() {
    return await loc.container(this.page).isVisible();
  }

  async getWelcomeMessage() {
    return await loc.welcomeMsg(this.page).textContent();
  }

  getDashboardContainer() {
    return loc.container(this.page);
  }

  getWelcomeMessageElement() {
    return loc.welcomeMsg(this.page);
  }

  async getCurrentUrl() {
    return this.page.url();
  }
}

module.exports = AdaptiveDashboardPage;