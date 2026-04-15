// === FILE: src/pages/base.page.js ===
/**
 * BasePage — shared foundation for all StarHub page objects.
 *
 * Every page object extends this class to inherit:
 *   - constructor(page)
 *   - goto(url)           — navigate with standard options
 *   - dismissCookieConsent() — safety net; globalSetup handles consent for new specs
 *   - getPageUrl()        — current page URL
 *   - getPageTitle()      — current page title
 *
 * Page-specific URLs and locators remain in each subclass.
 */

const COOKIE_CONSENT_SELECTOR = '[role="button"][aria-label*="Got it" i], button';

class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to the given URL using the project-standard load strategy.
   * @param {string} url
   */
  async goto(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  /**
   * Safety-net consent dismissal. globalSetup already handles this for new specs.
   * Kept here so legacy page objects that call it still work without error.
   */
  async dismissCookieConsent() {
    try {
      await this.page
        .getByRole('button', { name: /got it/i })
        .first()
        .click({ timeout: 3000 });
    } catch {}
  }

  /** Returns the current page URL. */
  async getPageUrl() {
    return this.page.url();
  }

  /** Returns the current page title. */
  async getPageTitle() {
    return this.page.title();
  }
}

module.exports = BasePage;
