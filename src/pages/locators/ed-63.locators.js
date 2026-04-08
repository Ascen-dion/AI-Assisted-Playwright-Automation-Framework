/**
 * Locator definitions for https://www.zs.com
 * Each exported function takes 'page' and returns a Playwright Locator.
 */
const locators = {
  zsLogo: (page) => page.locator('img[alt="ZS Logo"]').first(),
  header: (page) => page.locator('header').first(),
  homepageLink: (page) => page.locator('a:has(img[alt="ZS Logo"])').first(),
  mainContent: (page) => page.locator('[id="main-content"]').first()
};

module.exports = locators;