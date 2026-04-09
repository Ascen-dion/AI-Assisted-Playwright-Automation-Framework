/**
 * Reusable locators for the brownfield e-commerce application.
 */
const locators = {
  appShell: (page) => page.locator('main, [role="main"], #root').first(),
  header: (page) => page.locator('header').first(),
  footer: (page) => page.locator('footer').first(),
  searchInput: (page) =>
    page
      .locator('input[type="search"], input[placeholder*="search" i], [role="searchbox"]')
      .first(),
  productCards: (page) =>
    page.locator('[data-testid*="product" i], .product, .product-card, article').first(),
  addToCartButtons: (page) =>
    page
      .locator('button:has-text("Add to Cart"), button:has-text("Add"), [data-testid*="add-to-cart" i]')
      .first(),
  cartLink: (page) =>
    page
      .locator('a[href*="cart" i], button:has-text("Cart"), [data-testid*="cart" i]')
      .first()
};

module.exports = locators;
