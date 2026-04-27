const loc = require('./locators/adaptive-login.locators');

class AdaptiveLoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async login(username, password) {
    await loc.usernameField(this.page).fill(username);
    await loc.passwordField(this.page).fill(password);
    await loc.signInButton(this.page).click();
  }

  async enterUsername(username) {
    await loc.usernameField(this.page).fill(username);
  }

  async enterPassword(password) {
    await loc.passwordField(this.page).fill(password);
  }

  async clickSignIn() {
    await loc.signInButton(this.page).click();
  }

  async isErrorMessageVisible() {
    return await loc.errorMessage(this.page).isVisible();
  }

  getUsernameField() {
    return loc.usernameField(this.page);
  }

  getPasswordField() {
    return loc.passwordField(this.page);
  }

  getSignInButton() {
    return loc.signInButton(this.page);
  }
}

module.exports = AdaptiveLoginPage;