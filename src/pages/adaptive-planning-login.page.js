/**
 * Page Object for Adaptive Planning Login Page
 * Framework Rule: Page objects contain action methods, no assertions
 */

const loc = require('./locators/adaptive-planning-login.locators');

class AdaptivePlanningLoginPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to Adaptive Planning login page
   */
  async goto() {
    await this.page.goto('https://login.adaptiveplanning.com/app', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
  }

  /**
   * Enter username
   * @param {string} username - Username to enter
   */
  async enterUsername(username) {
    await loc.usernameField(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.usernameField(this.page).fill(username);
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   */
  async enterPassword(password) {
    await loc.passwordField(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.passwordField(this.page).fill(password);
  }

  /**
   * Click sign in button
   */
  async clickSignIn() {
    await loc.signInButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.signInButton(this.page).click();
  }

  /**
   * Perform complete login
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSignIn();
  }

  /**
   * Check if error message is visible
   * @returns {Promise<boolean>}
   */
  async isErrorMessageVisible() {
    try {
      await loc.errorMessage(this.page).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = AdaptivePlanningLoginPage;