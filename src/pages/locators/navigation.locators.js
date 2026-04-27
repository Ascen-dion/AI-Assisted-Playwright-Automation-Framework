/**
 * Navigation Page Locators
 * Locators for navigation elements across the application
 */

const navigationLocators = {
  sidebar: (page) => page.locator('nav'),
  menuItem: (page, text) => page.locator(`role=link[name='${text}']`),
  activeMenuItem: (page) => page.locator('.active, [aria-current="page"]').first(),
  backButton: (page) => page.locator('button:has-text("Back"), [aria-label="Back"], .back-button').first()
};

module.exports = navigationLocators;