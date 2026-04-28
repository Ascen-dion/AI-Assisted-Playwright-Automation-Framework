/**
 * Locators for Adaptive Planning Dashboard Page
 * Framework Rule: All locators must be defined in separate locator files
 */

const locators = {
  container: (page) => page.locator('main, .dashboard, [role="main"]').first(),
  welcomeMsg: (page) => page.locator('h1, h2, .welcome-message').first()
};

module.exports = locators;