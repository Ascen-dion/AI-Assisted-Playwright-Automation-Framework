/**
 * Workday Login Page Object
 * Handles login functionality for Workday Adaptive Planning
 */

const loginLocators = require('./locators/workday-login.locators');
const sharedLocators = require('./locators/workday-shared.locators');

class WorkdayLoginPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to Workday login page
   * @param {string} url - Login URL from test data
   */
  async goto(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Perform login with credentials
   * @param {string} username - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to check remember me checkbox
   */
  async login(username, password, rememberMe = false) {
    await loginLocators.usernameField(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loginLocators.usernameField(this.page).fill(username);
    await loginLocators.passwordField(this.page).fill(password);
    
    if (rememberMe) {
      await loginLocators.rememberCheckbox(this.page).check();
    }
    
    await loginLocators.signInButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  /**
   * Check if login error is displayed
   * @returns {Promise<boolean>}
   */
  async isErrorMessageVisible() {
    try {
      await loginLocators.errorMessage(this.page).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get error message text
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    await loginLocators.errorMessage(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loginLocators.errorMessage(this.page).textContent();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await loginLocators.forgotPasswordLink(this.page).click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = WorkdayLoginPage;