const loc = require('./locators/starhub-lifestyle-safety-nav.locators');
const BASE_URL = 'https://www.starhub.com/personal.html';

class StarHubLifestyleSafetyNavPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async dismissCookieConsent() {
    try {
      await this.page.getByRole('button', { name: /got it/i }).click({ timeout: 3000 });
    } catch { /* already dismissed */ }
  }

  async openLifestyleDropdown() {
    await loc.navButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.navButton(this.page).click();
  }

  async clickOverview() {
    await this.openLifestyleDropdown();
    await loc.overviewLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.overviewLink(this.page).click();
  }

  async clickSafeHubPlusOverview() {
    await this.openLifestyleDropdown();
    await loc.safeHubPlusOverviewLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.safeHubPlusOverviewLink(this.page).click();
  }

  async clickSmartSupport() {
    await this.openLifestyleDropdown();
    await loc.smartSupportLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.smartSupportLink(this.page).click();
  }

  async clickCyberProtect() {
    await this.openLifestyleDropdown();
    await loc.cyberProtectLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.cyberProtectLink(this.page).click();
  }

  async clickSmartSupportHome() {
    await this.openLifestyleDropdown();
    await loc.smartSupportHomeLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.smartSupportHomeLink(this.page).click();
  }

  async clickCyberCover() {
    await this.openLifestyleDropdown();
    await loc.cyberCoverLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.cyberCoverLink(this.page).click();
  }

  async clickScamSafe() {
    await this.openLifestyleDropdown();
    await loc.scamSafeLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.scamSafeLink(this.page).click();
  }

  async clickTravelProtection() {
    await this.openLifestyleDropdown();
    await loc.travelProtectionLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.travelProtectionLink(this.page).click();
  }
}

module.exports = StarHubLifestyleSafetyNavPage;