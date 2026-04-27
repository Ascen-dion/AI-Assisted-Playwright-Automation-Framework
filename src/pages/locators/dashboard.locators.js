/**
 * Dashboard Page Locators
 * Locators for the main dashboard/home page
 */

const dashboardLocators = {
  container: (page) => page.locator('main, .dashboard, [role="main"]').first(),
  welcomeMsg: (page) => page.locator('h1, h2, .welcome-message').first()
};

module.exports = dashboardLocators;