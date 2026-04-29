const locators = {
  sidebar: (page) => page.locator('nav').first(),
  menuItem: (page, text) => page.getByRole('link', { name: text }).first(),
  activeMenuItem: (page) => page.locator('.active, [aria-current="page"]').first(),
  backButton: (page) => page.locator('button:has-text("Back"), [aria-label="Back"], .back-button').first(),
  budgetEntrySalesLink: (page) => page.getByRole('link', { name: 'Budget Entry - Sales' }).first()
};

module.exports = locators;