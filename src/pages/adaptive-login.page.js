/**
 * Page Object for Adaptive Planning Login Page
 * Following framework POM pattern with logger integration
 */

const locators = require('./locators/adaptive-login.locators');
const logger = require('../helpers/logger');

class AdaptiveLoginPage {
  constructor(page) {
    this.page = page;
    this.locators = locators;
  }

  /**
   * Navigate to login page
   */
  async navigate(url) {
    logger.info(`Navigating to login page: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Login page loaded successfully');
  }

  /**
   * Enter username
   */
  async enterUsername(username) {
    logger.info(`Entering username: ${username}`);
    await this.locators.usernameField(this.page).waitFor({ state: 'visible' });
    await this.locators.usernameField(this.page).fill(username);
  }

  /**
   * Enter password
   */
  async enterPassword(password) {
    logger.info('Entering password');
    await this.locators.passwordField(this.page).waitFor({ state: 'visible' });
    await this.locators.passwordField(this.page).fill(password);
  }

  /**
   * Click sign in button
   */
  async clickSignIn() {
    logger.info('Clicking Sign In button');
    await this.locators.signInButton(this.page).waitFor({ state: 'visible' });
    await this.locators.signInButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    logger.info('Sign in completed');
  }

  /**
   * Complete login process
   */
  async login(username, password) {
    logger.info('Starting login process');
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSignIn();
    logger.info('Login process completed');
  }

  /**
   * Verify login page loaded
   */
  async verifyLoginPageLoaded() {
    logger.info('Verifying login page is loaded');
    await this.locators.usernameField(this.page).waitFor({ state: 'visible' });
    await this.locators.passwordField(this.page).waitFor({ state: 'visible' });
    await this.locators.signInButton(this.page).waitFor({ state: 'visible' });
    logger.info('Login page verified successfully');
  }
}

module.exports = AdaptiveLoginPage;