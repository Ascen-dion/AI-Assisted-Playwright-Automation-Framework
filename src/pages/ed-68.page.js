const loc = require('./locators/ed-68.locators');
const URL = 'https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net/';

class Ed68Page {
  constructor(page) { this.page = page; }

  async goto() { 
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 }); 
  }

  async isPageLoaded() {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    return true;
  }

  async getHeroTitleText() {
    await loc.heroTitle(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.heroTitle(this.page).textContent();
  }

  async isWelcomeMessageVisible() {
    await loc.heroTitle(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.heroTitle(this.page).isVisible();
  }

  async isWelcomeMessageAboveFold() {
    const box = await loc.heroTitle(this.page).boundingBox();
    const vh = this.page.viewportSize()?.height ?? 768;
    return box !== null && box.y < vh;
  }

  async getHeroSubtitleText() {
    await loc.heroSubtitle(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.heroSubtitle(this.page).textContent();
  }

  async isHeroSubtitleVisible() {
    await loc.heroSubtitle(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.heroSubtitle(this.page).isVisible();
  }

  async isHeroSubtitleAboveFold() {
    const box = await loc.heroSubtitle(this.page).boundingBox();
    const vh = this.page.viewportSize()?.height ?? 768;
    return box !== null && box.y < vh;
  }

  async getNavigationItems() {
    const items = await Promise.all([
      loc.navHome(this.page).textContent(),
      loc.navProducts(this.page).textContent(),
      loc.navCart(this.page).textContent()
    ]);
    return items;
  }

  async isNavigationVisible() {
    const items = [loc.navHome, loc.navProducts, loc.navCart];
    for (const item of items) {
      await item(this.page).waitFor({ state: 'visible', timeout: 15000 });
      if (!await item(this.page).isVisible()) return false;
    }
    return true;
  }

  async getFeatureHeadings() {
    const headings = await Promise.all([
      loc.freeShipping(this.page).textContent(),
      loc.securePayment(this.page).textContent(),
      loc.easyReturns(this.page).textContent(),
      loc.qualityProducts(this.page).textContent()
    ]);
    return headings;
  }

  async isFeaturesVisible() {
    const features = [loc.freeShipping, loc.securePayment, loc.easyReturns, loc.qualityProducts];
    for (const feature of features) {
      await feature(this.page).waitFor({ state: 'visible', timeout: 15000 });
      if (!await feature(this.page).isVisible()) return false;
    }
    return true;
  }
}

module.exports = Ed68Page;