const locators = {
  container: (page) => page.locator('main, .dashboard, [role="main"]').first(),
  welcomeMsg: (page) => page.locator('h1, h2, .welcome-message').first(),
  loadingSpinner: (page) => page.locator('.loading, .spinner, [role="progressbar"]').first()
};

module.exports = locators;