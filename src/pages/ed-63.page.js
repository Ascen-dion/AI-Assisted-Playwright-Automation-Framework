const loc = require('./locators/ed-63.locators');
const URL = 'https://www.zs.com';

class Ed63Page {
  constructor(page) { this.page = page; }

  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async isLogoDisplayed() {
    await loc.zsLogo(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.zsLogo(this.page).isVisible();
  }

  async isLogoInHeader() {
    // Verify the logo exists inside the header element
    const logoInHeader = loc.headerSection(this.page).locator('img[alt="ZS Logo"]').first();
    return await logoInHeader.isVisible();
  }

  async isLogoClickable() {
    // The logo is wrapped in an <a> tag — check that anchor's href
    const logoAnchor = this.page.locator('a:has(img[alt="ZS Logo"])').first();
    const href = await logoAnchor.getAttribute('href');
    return href !== null && href.includes('zs.com');
  }

  async isLogoAboveFold() {
    // Check the logo's top edge is within the initial viewport height
    const logo = loc.zsLogo(this.page);
    const viewportHeight = this.page.viewportSize()?.height ?? 768;
    const box = await logo.boundingBox();
    return box !== null && box.y < viewportHeight;
  }
}
module.exports = Ed63Page;