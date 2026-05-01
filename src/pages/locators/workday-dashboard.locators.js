/**
 * Locators for Workday Adaptive Planning Dashboard
 * @module workday-dashboard.locators
 */

const dashboardLocators = {
  container: (page) => page.locator('main, .dashboard, [role="main"]').first(),
  welcomeMsg: (page) => page.locator('h1, h2, .welcome-message').first()
};

module.exports = dashboardLocators;