// === FILE: src/web/pages/sunlife-homepage.page.js ===
const loc = require('../locators/sunlife-homepage.locators');

const URL = 'https://www.sunlife.com.ph/en/';

class SunLifeHomePage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async openMenu() {
    await loc.openMenuButton(this.page).click();
    await loc.menuDialog(this.page).waitFor({ state: 'visible', timeout: 10000 });
  }

  async isLoginLinkVisible() {
    await loc.loginLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.loginLink(this.page).isVisible();
  }

  async getLoginLinkHref() {
    return await loc.loginLink(this.page).getAttribute('href');
  }

  async isWhereToPayLinkVisible() {
    await loc.whereToPayLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.whereToPayLink(this.page).isVisible();
  }

  async getWhereToPayLinkHref() {
    return await loc.whereToPayLink(this.page).getAttribute('href');
  }

  async isAdvisorListLinkVisible() {
    await loc.advisorListLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.advisorListLink(this.page).isVisible();
  }

  async getAdvisorListLinkHref() {
    return await loc.advisorListLink(this.page).getAttribute('href');
  }
}

module.exports = SunLifeHomePage;
