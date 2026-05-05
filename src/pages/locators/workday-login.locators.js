/**
 * Workday Login Page Locators
 * Auto-generated from Workday-Locators.txt
 */

const loginLocators = {
  usernameField: (page) => page.locator('#inputEmail').first(),
  passwordField: (page) => page.locator('#inputPassword').first(),
  signInButton: (page) => page.locator('#submit').first(),
  rememberCheckbox: (page) => page.locator('#rememberUsername').first(),
  forgotPasswordLink: (page) => page.getByText('Forgot Password').first(),
  errorMessage: (page) => page.locator('.error-message, .login-error, [role="alert"]').first()
};

module.exports = loginLocators;