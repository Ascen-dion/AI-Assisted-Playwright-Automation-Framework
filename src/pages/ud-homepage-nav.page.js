// === FILE: src/pages/ud-homepage-nav.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/ud-homepage-nav.locators');

const URL = 'https://uniondigitalbank.io/en';

class UdHomepageNavPage extends BasePage {
  async goto() {
    await super.goto(URL);
  }

  async dismissCookieConsent() {
    try {
      await loc.cookieConsentButton(this.page).click({ timeout: 5000 });
    } catch {
      // consent already dismissed or not present
    }
  }

  async clickProductsNav() {
    await loc.productsNavItem(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.productsNavItem(this.page).click();
  }

  async clickLoanPaymentGuidesNav() {
    await loc.loanPaymentGuidesNavItem(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.loanPaymentGuidesNavItem(this.page).click();
  }

  async clickAboutUsNav() {
    await loc.aboutUsNavLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.aboutUsNavLink(this.page).click();
  }

  async clickHelpCenterNav() {
    await loc.helpCenterNavLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.helpCenterNavLink(this.page).click();
  }

  async isHomepageBannerVisible() {
    await loc.homepageBannerSection(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.homepageBannerSection(this.page).isVisible();
  }

  async isDownloadButtonVisible() {
    await loc.downloadTheAppButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.downloadTheAppButton(this.page).isVisible();
  }
}

module.exports = UdHomepageNavPage;
