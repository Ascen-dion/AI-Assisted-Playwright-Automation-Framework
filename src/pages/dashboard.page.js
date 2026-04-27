/**
 * Dashboard Page Object
 * Handles interactions with the main dashboard/home page
 */

const loc = require('./locators/dashboard.locators');

class DashboardPage {
  constructor(page) {
    this.page = page;
  }

  async isDashboardVisible() {
    return await loc.container(this.page).isVisible();
  }

  async getWelcomeMessage() {
    return await loc.welcomeMsg(this.page).textContent();
  }
}

module.exports = DashboardPage;