const loc = require('./locators/ed-64.locators');
const URL = 'https://www.zs.com';

class Ed64Page {
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
    await loc.zsLogo(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.zsLogo(this.page).isEnabled();
  }

  async getLogoHref() {
    return await loc.homepageLink(this.page).getAttribute('href');
  }

  async isLogoVisibleOnViewport() {
    const box = await loc.zsLogo(this.page).boundingBox();
    const vh = this.page.viewportSize()?.height ?? 768;
    return box !== null && box.y < vh;
  }

  async isLogoVisibleOnAllScreenSizes() {
    const viewports = [
      { width: 1920, height: 1080 },  // Desktop
      { width: 768, height: 1024 },   // Tablet
      { width: 375, height: 667 }     // Mobile
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await this.page.waitForTimeout(1000);
      if (!await this.isLogoVisibleOnViewport()) {
        return false;
      }
    }
    return true;
  }

  async isContentVisibleOnAllScreenSizes() {
    const viewports = [
      { width: 1920, height: 1080 },  // Desktop
      { width: 768, height: 1024 },   // Tablet
      { width: 375, height: 667 }     // Mobile
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await this.page.waitForTimeout(1000);

      // Check key elements are visible
      if (!await loc.heroTitle(this.page).isVisible()) return false;
      if (!await loc.cardsContainer(this.page).isVisible()) return false;
      if (!await loc.footer(this.page).isVisible()) return false;
    }
    return true;
  }
}
module.exports = Ed64Page;