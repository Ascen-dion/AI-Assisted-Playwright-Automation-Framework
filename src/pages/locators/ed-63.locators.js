/**
 * Locator definitions for https://www.zs.com
 * Each exported function takes 'page' and returns a Playwright Locator.
 */
const zsLogo = (page) => page.locator('img[alt="ZS Logo"]').first();
const headerSection = (page) => page.locator('header').first();
const homepageLink = (page) => page.locator('a[href="https://www.zs.com/"]').first();
const aboveFoldContent = (page) => page.locator('body > :is(header, main, section):first-child');

module.exports = {
  zsLogo,
  headerSection,
  homepageLink,
  aboveFoldContent
};