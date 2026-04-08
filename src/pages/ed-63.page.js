const loc = require('./locators/ed-63.locators');
const URL = 'https://www.zs.com';

class Ed63Page {
  constructor(page) { this.page = page; }

  async goto() { 
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 }); 
  }

  async isPageLoaded() {
    await this.page.waitForLoadState('domcontentloaded');
    return await this.page.isVisible();
  }

  async isLogoDisplayed() {
    await loc.zsLogo(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.zsLogo(this.page).isVisible();
  }

  async isLogoInHeader() {
    await loc.header(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.header(this.page).locator('img[alt="ZS Logo"]').first().isVisible();
  }

  async isLogoClickable() {
    return await loc.homepageLink(this.page).isEnabled();
  }

  async getLogoHref() {
    return await loc.homepageLink(this.page).getAttribute('href');
  }

  async isLogoAboveFold() {
    const box = await loc.zsLogo(this.page).boundingBox();
    const vh = this.page.viewportSize()?.height ?? 768;
    return box !== null && box.y < vh;
  }
}
module.exports = Ed63Page;