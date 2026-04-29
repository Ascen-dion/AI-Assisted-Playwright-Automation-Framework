/**
 * Page Object for Workday Login Page
 * Handles login functionality
 */

const locators = require('./locators/workday-budget-sales.locators');
const { expect } = require('@playwright/test');

class WorkdayLoginPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to application URL
   * @param {string} url - Application URL
   */
  async navigateToApp(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await expect(this.page).toHaveURL(/.*/, { timeout: 15000 });
  }

  /**
   * Verify login page loads successfully
   */
  async verifyLoginPageLoaded() {
    await expect(locators.usernameField(this.page)).toBeVisible({ timeout: 15000 });
    await expect(locators.passwordField(this.page)).toBeVisible({ timeout: 15000 });
    await expect(locators.signInButton(this.page)).toBeVisible({ timeout: 15000 });
  }

  /**
   * Enter username
   * @param {string} username - Username to enter
   */
  async enterUsername(username) {
    await locators.usernameField(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await locators.usernameField(this.page).fill(username);
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   */
  async enterPassword(password) {
    await locators.passwordField(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await locators.passwordField(this.page).fill(password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await locators.signInButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await locators.signInButton(this.page).click();
  }

  /**
   * Complete login with credentials
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /**
   * Verify credentials are accepted (no error message)
   */
  async verifyCredentialsAccepted() {
    // Wait for page transition or error
    await this.page.waitForTimeout(2000);
    const errorVisible = await locators.errorMessage(this.page).isVisible().catch(() => false);
    expect(errorVisible).toBe(false);
  }
}

module.exports = WorkdayLoginPage;