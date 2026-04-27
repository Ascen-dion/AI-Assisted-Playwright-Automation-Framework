const { expect } = require('@playwright/test');
const TD = require('../data/workday-test-data');

class LoginPage {
  constructor(page) {
    this.page = page;
    
    this.locators = {
      usernameField: page.locator('input[name="emailAddress"], #login-email, input[type="email"]').first(),
      passwordField: page.locator('input[name="password"], #login-password, input[type="password"]').first(),
      rememberCheckbox: page.locator('input[type="checkbox"], #rememberUsername').first(),
      signInButton: page.locator('button[type="submit"], #login-button, button:has-text("Sign In")').first(),
      forgotPasswordLink: page.locator('a:has-text("Forgot Password")').first(),
      errorMessage: page.locator('.error-message, .login-error, [role="alert"]').first()
    };
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto(TD.urls.login);
    await this.page.waitForLoadState('networkidle');
    await expect(this.locators.usernameField).toBeVisible();
  }

  /**
   * Perform login with username and password
   * @param {string} username - Username/email
   * @param {string} password - Password
   */
  async login(username, password) {
    await this.locators.usernameField.fill(username);
    await this.locators.passwordField.fill(password);
    await this.locators.signInButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify login error message is displayed
   * @param {string} expectedError - Expected error message
   */
  async verifyErrorMessage(expectedError) {
    await expect(this.locators.errorMessage).toBeVisible();
    await expect(this.locators.errorMessage).toContainText(expectedError);
  }
}

module.exports = LoginPage;