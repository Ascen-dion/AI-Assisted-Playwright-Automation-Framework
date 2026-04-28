/**
 * Page Object for Adaptive Planning Login Page
 * @class AdaptiveLoginPage
 */

const loginLocators = require('./locators/adaptive-login.locators');
const logger = require('../helpers/logger');

class AdaptiveLoginPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to login page
   */
  async goto() {
    logger.info('Navigating to Adaptive Planning login page');
    await this.page.goto('https://login.adaptiveplanning.com/app');
    await this.page.waitForLoadState('networkidle');
    logger.info('Login page loaded successfully');
  }

  /**
   * Enter username
   * @param {string} username - Username to enter
   */
  async enterUsername(username) {
    logger.info(`Entering username: ${username}`);
    const usernameField = loginLocators.usernameField(this.page);
    await usernameField.waitFor({ state: 'visible' });
    await usernameField.fill(username);
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   */
  async enterPassword(password) {
    logger.info('Entering password');
    const passwordField = loginLocators.passwordField(this.page);
    await passwordField.waitFor({ state: 'visible' });
    await passwordField.fill(password);
  }

  /**
   * Click sign in button
   */
  async clickSignIn() {
    logger.info('Clicking Sign In button');
    const signInButton = loginLocators.signInButton(this.page);
    await signInButton.waitFor({ state: 'visible' });
    await signInButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Sign In button clicked');
  }

  /**
   * Perform complete login
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    logger.info('Performing login');
    await this.goto();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSignIn();
    logger.info('Login completed');
  }

  /**
   * Verify login page is loaded
   */
  async verifyLoginPageLoaded() {
    logger.info('Verifying login page is loaded');
    const usernameField = loginLocators.usernameField(this.page);
    await usernameField.waitFor({ state: 'visible', timeout: 10000 });
    logger.info('Login page verified');
  }

  /**
   * Get error message
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    const errorMsg = loginLocators.errorMessage(this.page);
    if (await errorMsg.isVisible()) {
      return await errorMsg.textContent();
    }
    return null;
  }
}

module.exports = AdaptiveLoginPage;