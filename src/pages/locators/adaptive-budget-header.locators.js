/**
 * Locators for Adaptive Planning Budget Header/Context
 * @module locators/adaptive-budget-header
 */

const budgetHeaderLocators = {
  pageTitle: (page) => page.locator('.perspective-title'),
  versionButton: (page) => page.locator('button:has-text("Working Budget")'),
  timeSelector: (page) => page.locator('text=Time >> .. >> button, select, input').first(),
  levelSelector: (page) => page.locator('text=Level >> .. >> button, select, input').first(),
  currencySelector: (page) => page.locator('text=Currency >> .. >> button, select, input').first()
};

module.exports = budgetHeaderLocators;