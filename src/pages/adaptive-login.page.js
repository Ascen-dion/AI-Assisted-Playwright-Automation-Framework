const loc = require('./locators/adaptive-login.locators');
const TD = require('../data/adaptive-test-data');

class AdaptiveLoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(TD.urls.login, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async login(username, password) {
    await loc.usernameField(this.page).fill(username);
    await loc.passwordField(this.page).fill(password);
    await loc.signInButton(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  }

  async isErrorMessageVisible() {
    return await loc.errorMessage(this.page).isVisible();
  }

  async getErrorMessage() {
    return await loc.errorMessage(this.page).textContent();
  }
}

module.exports = AdaptiveLoginPage;