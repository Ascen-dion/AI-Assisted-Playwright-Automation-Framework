/**
 * Locators for Adaptive Planning Navigation
 * Framework Rule: All locators must be defined in separate locator files
 */

const locators = {
  sidebar: (page) => page.locator('nav').first(),
  menuItem: (page, text) => page.getByRole('link', { name: text, exact: true }).first(),
  activeMenuItem: (page) => page.locator('.active, [aria-current="page"]').first(),
  backButton: (page) => page.locator('button:has-text("Back"), [aria-label="Back"], .back-button').first()
};

module.exports = locators;