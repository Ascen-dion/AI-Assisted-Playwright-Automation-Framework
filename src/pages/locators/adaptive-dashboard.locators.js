/**
 * Locators for Adaptive Planning Dashboard
 * Following framework convention: locators return Playwright locator functions
 */

const locators = {
  container: (page) => page.locator('main, .dashboard, [role="main"]').first(),
  welcomeMsg: (page) => page.locator('h1, h2, .welcome-message').first()
};

module.exports = locators;