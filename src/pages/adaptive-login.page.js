const logger = require('../helpers/logger');
const locators = require('./locators/adaptive-login.locators');

class AdaptiveLoginPage {
  constructor(page) {
    this.page = page;
  }

  async navigate(url) {
    try {
      logger.info(`Navigating to login page: ${url}`);
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await this.page.waitForLoadState('networkidle');
      logger.info('Login page loaded successfully');
    } catch (error) {
      logger.error(`Failed to navigate to login page: ${error.message}`);
      throw error;
    }
  }

  async enterUsername(username) {
    try {
      logger.info(`Entering username: ${username}`);
      const usernameField = locators.usernameField(this.page);
      await usernameField.waitFor({ state: 'visible', timeout: 15000 });
      await usernameField.clear();
      await usernameField.fill(username);
      logger.info('Username entered successfully');
    } catch (error) {
      logger.error(`Failed to enter username: ${error.message}`);
      throw error;
    }
  }

  async enterPassword(password) {
    try {
      logger.info('Entering password');
      const passwordField = locators.passwordField(this.page);
      await passwordField.waitFor({ state: 'visible', timeout: 15000 });
      await passwordField.clear();
      await passwordField.fill(password);
      logger.info('Password entered successfully');
    } catch (error) {
      logger.error(`Failed to enter password: ${error.message}`);
      throw error;
    }
  }

  async clickSignIn() {
    try {
      logger.info('Clicking Sign In button');
      const signInButton = locators.signInButton(this.page);
      await signInButton.waitFor({ state: 'visible', timeout: 15000 });
      await signInButton.click();
      logger.info('Sign In button clicked successfully');
    } catch (error) {
      logger.error(`Failed to click Sign In button: ${error.message}`);
      throw error;
    }
  }

  async login(username, password) {
    try {
      logger.info('Performing login');
      await this.enterUsername(username);
      await this.enterPassword(password);
      await this.clickSignIn();
      await this.page.waitForLoadState('networkidle', { timeout: 60000 });
      logger.info('Login completed successfully');
    } catch (error) {
      logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  async isLoginPageLoaded() {
    try {
      logger.info('Verifying login page is loaded');
      const usernameField = locators.usernameField(this.page);
      await usernameField.waitFor({ state: 'visible', timeout: 15000 });
      const isVisible = await usernameField.isVisible();
      logger.info(`Login page loaded: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.error(`Failed to verify login page: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AdaptiveLoginPage;