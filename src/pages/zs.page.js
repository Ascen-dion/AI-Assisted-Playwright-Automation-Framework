const loc = require('./locators/zs.locators');

const URL = 'https://www.zs.com/';

/**
 * Page Object for ZS.com website.
 *
 * Encapsulates all user actions so tests stay free of
 * Playwright API details and locator strings.
 */
class ZSPage {
  constructor(page) {
    this.page = page;
  }

  // ── Navigation ────────────────────────────────────────────────

  async goto() {
    await this.page.goto(URL, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Wait a bit longer for any dynamic content to load
    await this.page.waitForTimeout(2000);
  }

  // ── Getters ───────────────────────────────────────────────────

  getZSLogo() {
    return loc.zsLogo(this.page);
  }

  getHeaderSection() {
    return loc.headerSection(this.page);
  }

  getMainContent() {
    return loc.mainContent(this.page);
  }

  // ── Verifications ─────────────────────────────────────────────

  async isLogoVisible() {
    try {
      const logo = this.getZSLogo();
      await logo.waitFor({ state: 'visible', timeout: 10000 });
      return await logo.isVisible();
    } catch (error) {
      console.log('Logo visibility check failed:', error.message);
      return false;
    }
  }

  async getLogoInfo() {
    const logo = this.getZSLogo();
    
    try {
      return {
        isVisible: await logo.isVisible(),
        tagName: await logo.evaluate(el => el.tagName),
        src: await logo.getAttribute('src'),
        alt: await logo.getAttribute('alt'),
        className: await logo.getAttribute('class'),
        id: await logo.getAttribute('id')
      };
    } catch (error) {
      console.log('Could not get logo info:', error.message);
      return null;
    }
  }

  async waitForPageLoad() {
    // Wait for page load event - networkidle is unreliable on sites with continuous trackers
    await this.page.waitForLoadState('load', { timeout: 30000 });
  }
}

module.exports = ZSPage;