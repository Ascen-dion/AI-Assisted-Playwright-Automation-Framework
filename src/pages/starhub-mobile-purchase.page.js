const loc = require('./locators/starhub-mobile-purchase.locators');
const URL = 'https://www.starhub.com';

class StarHubMobilePurchasePage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async dismissCookieConsent() {
    try {
      await loc.cookieConsentButton(this.page).click({ timeout: 3000 });
      await this.page.waitForTimeout(1000); // Allow modal to close
    } catch (error) {
      // Cookie consent not present or already dismissed
    }
  }

  async navigateToMobileDropdown() {
    await loc.mobileDropdownButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.mobileDropdownButton(this.page).click();
  }

  async clickAllPhones() {
    await loc.allPhonesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.allPhonesLink(this.page).click();
  }

  async selectGalaxyA57Device() {
    // Wait for page to load and products to appear
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(3000); // Additional wait for dynamic content rendering
    
    await loc.galaxyA57Device(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.galaxyA57Device(this.page).click();
  }

  async isProductDetailPageLoaded() {
    await this.page.waitForLoadState('load');
    await loc.productTitle(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.productTitle(this.page).isVisible();
  }

  async getSelectedColor() {
    try {
      await loc.colorAwesomeNavy(this.page).waitFor({ state: 'visible', timeout: 10000 });
      return 'Awesome Navy';
    } catch {
      // Fallback: check other color patterns
      const colorText = await this.page.locator('[class*="colour"], [class*="color"]').textContent();
      return colorText ? colorText.trim() : 'Unknown';
    }
  }

  async getSelectedStorage() {   
    try {
      await loc.storage256GB(this.page).waitFor({ state: 'visible', timeout: 10000 });
      return '256GB';
    } catch {
      // Fallback: check storage display text
      const storageText = await this.page.locator('[class*="storage"]').textContent();
      return storageText ? storageText.trim() : 'Unknown';
    }
  }

  async getSelectedPaymentOption() {
    try {
      await loc.payment24Month(this.page).waitFor({ state: 'visible', timeout: 10000 });
      return '24-month';
    } catch {
      // Fallback: check payment option elements
      return 'Unknown';
    }
  }

  async clickNextButton() {
    await loc.nextButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
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
    return await loc.authMessage(this.page).textContent();
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