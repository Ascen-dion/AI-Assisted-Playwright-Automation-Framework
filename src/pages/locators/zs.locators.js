/**
 * Locator definitions for https://www.zs.com/
 *
 * Centralised here so a DOM change only needs fixing in one place.
 * Each exported function takes a `page` and returns a Playwright Locator.
 */

/** ZS company logo - using specific selector found during page inspection */
const zsLogo = (page) => {
  // Primary selector - exact match for ZS logo
  return page.locator('img[alt="ZS Logo"]');
};

/** Header/navigation area where logo is typically located */
const headerSection = (page) => page.locator('header, .header, nav, .nav, .navbar').first();

/** Main page content to verify page loaded */
const mainContent = (page) => page.locator('main, .main, #main, .content, body').first();

module.exports = {
  zsLogo,
  headerSection,
  mainContent
};