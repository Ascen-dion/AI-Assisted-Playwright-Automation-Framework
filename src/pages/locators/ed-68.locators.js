/**
 * Locator definitions for https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net/
 * Each exported function takes 'page' and returns a Playwright Locator.
 */
const locators = {
  heroTitle: (page) => page.locator('h1.hero-title').first(),
  heroSubtitle: (page) => page.locator('p.hero-subtitle').first(),
  navHome: (page) => page.locator('li.nav-item:has(a[href="/"])').first(),
  navProducts: (page) => page.locator('li.nav-item:has(a[href="/products"])').first(),
  navCart: (page) => page.locator('li.nav-item:has(a[href="/cart"])').first(),
  shopNowLink: (page) => page.locator('a[href="/products"]').first(),
  eShopLogo: (page) => page.locator('a[href="/"]').first(),
  freeShipping: (page) => page.locator('h3').first(),
  securePayment: (page) => page.locator('h3').nth(1),
  easyReturns: (page) => page.locator('h3').nth(2),
  qualityProducts: (page) => page.locator('h3').nth(3),
};

module.exports = locators;