/**
 * Locators for Adaptive Planning Navigation
 * @module locators/adaptive-navigation
 */

const navLocators = {
  sidebar: (page) => page.locator('nav'),
  menuItem: (page, text) => page.getByRole('link', { name: text }),
  activeMenuItem: (page) => page.locator('.active, [aria-current="page"]').first(),
  backButton: (page) => page.locator('button:has-text("Back"), [aria-label="Back"], .back-button').first()
};

module.exports = navLocators;