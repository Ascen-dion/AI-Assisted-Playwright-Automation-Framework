/**
 * Locators for Adaptive Planning Navigation
 * All locators are functions that accept page and return a locator object
 */

const locators = {
  sidebar: (page) => page.locator('nav'),
  menuItem: (page, text) => page.getByRole('link', { name: text }),
  activeMenuItem: (page) => page.locator('.active, [aria-current="page"]').first(),
  backButton: (page) => page.locator('button:has-text("Back"), [aria-label="Back"], .back-button').first()
};

module.exports = locators;