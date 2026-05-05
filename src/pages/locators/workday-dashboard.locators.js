/**
 * Workday Dashboard Page Locators
 * Auto-generated from Workday-Locators.txt
 */

const dashboardLocators = {
  container: (page) => page.locator('main, .dashboard, [role="main"]').first(),
  welcomeMsg: (page) => page.locator('h1, h2, .welcome-message').first()
};

module.exports = dashboardLocators;