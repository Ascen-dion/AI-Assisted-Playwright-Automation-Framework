/**
 * Page Object for Workday Adaptive Planning Login Page
 * @class WorkdayLoginPage
 */

const loc = require('./locators/workday-login.locators');
const URL = 'https://login.adaptiveplanning.com/app';

class WorkdayLoginPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
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
   * Check if login page is loaded
   * @returns {Promise<boolean>}
   */
  async isLoaded() {
    try {
      await loc.usernameField(this.page).waitFor({ state: 'visible', timeout: 15000 });
      await loc.passwordField(this.page).waitFor({ state: 'visible', timeout: 15000 });
      await loc.signInButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get error message text
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    await loc.errorMessage(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.errorMessage(this.page).textContent();
  }
}

module.exports = WorkdayLoginPage;