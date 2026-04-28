const loc = require('./locators/adaptive-planning-login.locators');
const URL = 'https://login.adaptiveplanning.com/app';

class AdaptivePlanningLoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async enterUsername(username) {
    await loc.usernameField(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await loc.usernameField(this.page).fill(username);
  }

  async enterPassword(password) {
    await loc.passwordField(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await loc.passwordField(this.page).fill(password);
  }

  async clickSignIn() {
    await loc.signInButton(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await loc.signInButton(this.page).click();
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSignIn();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  }

  async isUsernameFieldVisible() {
    return await loc.usernameField(this.page).isVisible();
  }

  async isPasswordFieldVisible() {
    return await loc.passwordField(this.page).isVisible();
  }

  async isSignInButtonVisible() {
    return await loc.signInButton(this.page).isVisible();
  }

  async getErrorMessage() {
    await loc.errorMessage(this.page).waitFor({ state: 'visible', timeout: 10000 });
    return await loc.errorMessage(this.page).textContent();
  }
}

module.exports = AdaptivePlanningLoginPage;