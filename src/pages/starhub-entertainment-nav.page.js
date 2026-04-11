const loc = require('./locators/starhub-entertainment-nav.locators');
const BASE_URL = 'https://www.starhub.com/personal.html';

class StarHubEntertainmentNavPage {
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

  async openEntertainmentDropdown() {
    await loc.navButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.navButton(this.page).click();
  }

  async clickOverview() {
    await this.openEntertainmentDropdown();
    await loc.overviewLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.overviewLink(this.page).click();
  }

  async clickTVPasses() {
    await this.openEntertainmentDropdown();
    await loc.tvPassesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.tvPassesLink(this.page).click();
  }

  async clickPremierLeague() {
    await this.openEntertainmentDropdown();
    await loc.premierLeagueLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.premierLeagueLink(this.page).click();
  }

  async clickAddOns() {
    await this.openEntertainmentDropdown();
    await loc.addOnsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.addOnsLink(this.page).click();
  }

  async clickCloudRecording() {
    await this.openEntertainmentDropdown();
    await loc.cloudRecordingLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.cloudRecordingLink(this.page).click();
  }

  async clickMobileApp() {
    await this.openEntertainmentDropdown();
    await loc.mobileAppLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.mobileAppLink(this.page).click();
  }

  async clickTVDevices() {
    await this.openEntertainmentDropdown();
    await loc.tvDevicesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.tvDevicesLink(this.page).click();
  }

  async clickChannelList() {
    await this.openEntertainmentDropdown();
    await loc.channelListLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.channelListLink(this.page).click();
  }

  async clickNetflix() {
    await this.openEntertainmentDropdown();
    await loc.netflixLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.netflixLink(this.page).click();
  }

  async clickDisneyPlus() {
    await this.openEntertainmentDropdown();
    await loc.disneyPlusLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.disneyPlusLink(this.page).click();
  }

  async clickAmazonPrime() {
    await this.openEntertainmentDropdown();
    await loc.amazonPrimeLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.amazonPrimeLink(this.page).click();
  }

  async clickHBOMax() {
    await this.openEntertainmentDropdown();
    await loc.hboMaxLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.hboMaxLink(this.page).click();
  }

  async clickWorldCup() {
    await this.openEntertainmentDropdown();
    await loc.worldCupLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.worldCupLink(this.page).click();
  }
}

module.exports = StarHubEntertainmentNavPage;