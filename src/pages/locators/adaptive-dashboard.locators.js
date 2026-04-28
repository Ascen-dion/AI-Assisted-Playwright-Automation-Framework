/**
 * Locators for Adaptive Planning Dashboard
 * All locators are functions that accept page and return a locator object
 */

const locators = {
  container: (page) => page.locator('main, .dashboard, [role="main"]').first(),
  welcomeMsg: (page) => page.locator('h1, h2, .welcome-message').first()
};

module.exports = locators;