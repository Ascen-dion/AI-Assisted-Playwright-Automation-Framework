const loc = require('./locators/starhub-mobile-purchase.locators');
const BASE_URL = 'https://www.starhub.com/personal.html';
const PDP_URL = 'https://consumer.starhub.com/personal/store/mobile/devices/samsung/galaxy-a57-5g';

class StarHubMobilePurchasePage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async gotoPDP() {
    await this.page.goto(PDP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async dismissCookieConsent() {
    try {
      await loc.cookieConsentButton(this.page).click({ timeout: 3000 });
    } catch { /* already dismissed */ }
  }

  async navigateToMobileDropdown() {
    await loc.mobileDropdownButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.mobileDropdownButton(this.page).click();
  }

  async clickAllPhones() {
    await loc.allPhonesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.allPhonesLink(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async selectGalaxyA57Device() {
    await loc.galaxyA57Device(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.galaxyA57Device(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async isProductDetailPageLoaded() {
    await loc.productTitle(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.productTitle(this.page).isVisible();
  }

  async getSelectedColor() {
    await loc.colourSection(this.page).waitFor({ state: 'visible', timeout: 10000 });
    const text = await loc.colourSection(this.page).textContent();
    return text.replace('Colour:', '').trim();
  }

  async getSelectedStorage() {
    await loc.storageSection(this.page).waitFor({ state: 'visible', timeout: 10000 });
    const text = await loc.storageSection(this.page).textContent();
    const match = text.match(/(\d+\s?GB)/);
    return match ? match[1] : text.replace('Storage:', '').trim();
  }

  async getSelectedPaymentOption() {
    await loc.paymentOptionActive(this.page).waitFor({ state: 'visible', timeout: 10000 });
    return (await loc.paymentOptionActive(this.page).textContent()).trim();
  }

  async clickNextButton() {
    await loc.nextButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.nextButton(this.page).scrollIntoViewIfNeeded();
    await loc.nextButton(this.page).click();
  }

  async isAuthModalVisible() {
    try {
      await loc.authMessage(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.authMessage(this.page).isVisible();
    } catch {
      return false;
    }
  }

  async getAuthMessage() {
    await loc.authMessage(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return (await loc.authMessage(this.page).textContent()).trim();
  }

  async isHubIdLoginButtonVisible() {
    await loc.hubIdLoginButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.hubIdLoginButton(this.page).isVisible();
  }

  async isSignUpLinkVisible() {
    await loc.signUpLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.signUpLink(this.page).isVisible();
  }

  async getCurrentUrl() {
    return this.page.url();
  }

  async getPageTitle() {
    return await this.page.title();
  }
}

module.exports = StarHubMobilePurchasePage;