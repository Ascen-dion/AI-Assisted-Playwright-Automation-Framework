/**
 * Locators for Adaptive Planning Dashboard Page
 * @module locators/adaptive-dashboard
 */

const dashboardLocators = {
  container: (page) => page.locator('main, .dashboard, [role="main"]').first(),
  welcomeMessage: (page) => page.locator('h1, h2, .welcome-message').first()
};

module.exports = dashboardLocators;