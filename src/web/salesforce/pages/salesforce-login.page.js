/**
 * Salesforce Login Page
 * 
 * This page object handles Salesforce authentication and login flows.
 */

const loc = require('../locators/salesforce-login.locators');

class SalesforceLoginPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to Salesforce login page
   * @param {string} loginUrl - The Salesforce login URL
   */
  async navigateTo(loginUrl) {
    await this.page.goto(loginUrl);
  }

  /**
   * Log in to Salesforce
   * @param {string} username - Salesforce username
   * @param {string} password - Salesforce password
   */
  async login(username, password) {
    await loc.usernameInput(this.page).fill(username);
    await loc.passwordInput(this.page).fill(password);
    await loc.loginButton(this.page).click();
    
    // Wait for navigation to home page
    await this.page.waitForURL(/.*\/lightning\/page\/home/, { timeout: 30000 }).catch(() => {});
  }

  /**
   * Check if login error is displayed
   * @returns {Promise<boolean>}
   */
  async isErrorDisplayed() {
    return await loc.errorMessage(this.page).isVisible();
  }

  /**
   * Get login error message text
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    return await loc.errorMessage(this.page).innerText();
  }

  /**
   * Check "Remember me" checkbox
   */
  async checkRememberMe() {
    await loc.rememberMeCheckbox(this.page).check();
  }

  /**
   * Click "Forgot password" link
   */
  async clickForgotPassword() {
    await loc.forgotPasswordLink(this.page).click();
  }

  /**
   * Verify login page is loaded
   */
  async verifyLoginPage() {
    await loc.usernameInput(this.page).waitFor({ state: 'visible', timeout: 10000 });
    await loc.passwordInput(this.page).waitFor({ state: 'visible', timeout: 10000 });
    await loc.loginButton(this.page).waitFor({ state: 'visible', timeout: 10000 });
  }
}

module.exports = SalesforceLoginPage;
