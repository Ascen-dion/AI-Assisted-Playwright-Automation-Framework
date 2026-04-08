/**
 * Locator definitions for https://www.zs.com
 * Each exported function takes 'page' and returns a Playwright Locator.
 */
const locators = {
  zsLogo: (page) => page.locator('img[alt="ZS Logo"]').first(),
  header: (page) => page.locator('header').first(),
  homepageLink: (page) => page.locator('a:has(img[alt="ZS Logo"])').first(),
  heroTitle: (page) => page.locator('h1').first(),
  skipToMain: (page) => page.locator('a[href="#main-content"]').first(),
  aboutUsLink: (page) => page.locator('a[href="https://www.zs.com/about"]').first(),
  connectWithExpert: (page) => page.locator('a[href="https://www.zs.com/forms/contact-us"]').first(),
  searchButton: (page) => page.locator('button[aria-label="Open Search"]').first(),
  menuButton: (page) => page.locator('button[aria-label="Open Menu"]').first(),
  parallaxContent: (page) => page.locator('.parallax-content-item-wrapper').first(),
  cardsContainer: (page) => page.locator('.cards-container').first(),
  cardTitles: (page) => page.locators('.card-title'),
  footer: (page) => page.locator('footer').first(),
};

module.exports = locators;