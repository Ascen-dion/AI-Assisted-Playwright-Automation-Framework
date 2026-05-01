/**
 * Page Object for Workday Adaptive Planning Login Page
 * @module workday-login.page
 */

const locators = require('./locators/workday-login.locators');
const { expect } = require('@playwright/test');

class WorkdayLoginPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to login page
   */
  async navigate() {
    await this.page.goto('https://login.adaptiveplanning.com/app');
    await expect(locators.usernameField(this.page)).toBeVisible();
  }

  /**
   * Fill username field
   * @param {string} username - Username/email to enter
   */
  async fillUsername(username) {
    await expect(locators.usernameField(this.page)).toBeVisible();
    await locators.usernameField(this.page).fill(username);
  }

  /**
   * Fill password field
   * @param {string} password - Password to enter
   */
  async fillPassword(password) {
    await expect(locators.passwordField(this.page)).toBeVisible();
    await locators.passwordField(this.page).fill(password);
  }

  /**
   * Click sign in button
   */
  async clickSignIn() {
    await expect(locators.signInButton(this.page)).toBeEnabled();
    await locators.signInButton(this.page).click();
  }

  /**
   * Toggle remember username checkbox
   */
  async toggleRememberUsername() {
    await expect(locators.rememberCheckbox(this.page)).toBeVisible();
    await locators.rememberCheckbox(this.page).check();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await expect(locators.forgotPasswordLink(this.page)).toBeVisible();
    await locators.forgotPasswordLink(this.page).click();
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    await expect(locators.errorMessage(this.page)).toBeVisible();
    return await locators.errorMessage(this.page).textContent();
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessageDisplayed() {
    await expect(locators.errorMessage(this.page)).toBeVisible();
  }

  /**
   * Complete login flow
   * @param {string} username - Username/email
   * @param {string} password - Password
   */
  async login(username, password) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSignIn();
  }
}

module.exports = WorkdayLoginPage;