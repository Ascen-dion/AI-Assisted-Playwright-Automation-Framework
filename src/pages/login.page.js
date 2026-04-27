/**
 * Login Page Object
 * Handles login functionality for Adaptive Planning
 */

const loc = require('./locators/login.locators');
const URL = 'https://login.adaptiveplanning.com/app';

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async login(username, password) {
    await loc.usernameField(this.page).fill(username);
    await loc.passwordField(this.page).fill(password);
    await loc.signInButton(this.page).click();
    // Wait for navigation to complete
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  }

  async isErrorMessageVisible() {
    return await loc.errorMessage(this.page).isVisible();
  }

  async getErrorMessage() {
    return await loc.errorMessage(this.page).textContent();
  }
}

module.exports = LoginPage;