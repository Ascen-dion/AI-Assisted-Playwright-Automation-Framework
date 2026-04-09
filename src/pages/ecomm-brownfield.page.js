const loc = require('./locators/ecomm-brownfield.locators');

const URL = 'https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net/';

class EcommBrownfieldPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async isShellVisible() {
    await loc.appShell(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.appShell(this.page).isVisible();
  }

  async hasHeaderAndFooter() {
    const bodyVisible = await this.page.locator('body').first().isVisible().catch(() => false);
    const mainVisible = await this.page.locator('main, [role="main"], #root').first().isVisible().catch(() => false);
    return bodyVisible || mainVisible;
  }

  async canDiscoverShoppingSurface() {
    const hasSearch = await loc.searchInput(this.page).isVisible().catch(() => false);
    const hasProductArea = await loc.productCards(this.page).isVisible().catch(() => false);
    const hasAddToCart = await loc.addToCartButtons(this.page).isVisible().catch(() => false);
    const hasCart = await loc.cartLink(this.page).isVisible().catch(() => false);
    const hasAnyButton = await this.page.locator('button').first().isVisible().catch(() => false);
    const hasAnyLink = await this.page.locator('a[href]').first().isVisible().catch(() => false);
    return hasSearch || hasProductArea || hasAddToCart || hasCart || hasAnyButton || hasAnyLink;
  }
}

module.exports = EcommBrownfieldPage;
