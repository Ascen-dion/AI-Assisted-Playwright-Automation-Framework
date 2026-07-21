/**
 * Salesforce Login Page Locators
 * 
 * This module contains all locators for the Salesforce login page.
 */

const locators = {
  /**
   * Username input field
   */
  usernameInput: (page) => page.locator('input#username'),

  /**
   * Password input field
   */
  passwordInput: (page) => page.locator('input#password'),

  /**
   * Login button
   */
  loginButton: (page) => page.locator('input#Login'),

  /**
   * Error message container
   */
  errorMessage: (page) => page.locator('#error'),

  /**
   * Remember me checkbox
   */
  rememberMeCheckbox: (page) => page.locator('input#rememberUn'),

  /**
   * Forgot password link
   */
  forgotPasswordLink: (page) => page.locator('a#forgot_password_link'),
};

module.exports = locators;
