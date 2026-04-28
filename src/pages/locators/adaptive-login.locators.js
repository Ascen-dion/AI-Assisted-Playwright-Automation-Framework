/**
 * Locators for Adaptive Planning Login Page
 * @module locators/adaptive-login
 */

const loginLocators = {
  usernameField: (page) => page.locator('#inputEmail'),
  passwordField: (page) => page.locator('#inputPassword'),
  signInButton: (page) => page.locator('#submit'),
  rememberCheckbox: (page) => page.locator('#rememberUsername'),
  forgotPasswordLink: (page) => page.getByText('Forgot Password'),
  errorMessage: (page) => page.locator('.error-message, .login-error, [role="alert"]').first()
};

module.exports = loginLocators;