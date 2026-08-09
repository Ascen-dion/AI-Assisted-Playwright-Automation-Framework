/**
 * Salesforce Login Page
 * 
 * This page object handles Salesforce authentication and login flows.
 */

const loc = require('../locators/salesforce-login.locators');

class SalesforceLoginPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to Salesforce login page
   * @param {string} loginUrl - The Salesforce login URL
   */
  async navigateTo(loginUrl) {
    await this.page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
    // Wait for redirect to login page if needed
    await this.page.waitForTimeout(2000);
  }

  /**
   * Log in to Salesforce
   * @param {string} username - Salesforce username
   * @param {string} password - Salesforce password
   */
  async login(username, password) {
    // Check if login form is present (if not, already logged in)
    const loginFormVisible = await loc.usernameInput(this.page).isVisible({ timeout: 3000 }).catch(() => false);
    
    if (!loginFormVisible) {
      console.log('Already logged in to Salesforce (no login form detected), skipping login');
      
      // Even if logged in, ensure we're on a Lightning page, not stuck on login URL
      const currentUrl = this.page.url();
      if (currentUrl.includes('/login')) {
        console.log('On login URL but authenticated - navigating to Lightning home...');
        const baseUrl = process.env.SALESFORCE_ORG_URL;
        await this.page.goto(`${baseUrl}/lightning/page/home`);
        await this.page.waitForTimeout(3000);
      }
      return;
    }
    
    console.log('Login form detected, proceeding with login...');
    
    // Fill username
    await loc.usernameInput(this.page).fill(username);
    
    // Fill password
    await loc.passwordInput(this.page).waitFor({ state: 'visible', timeout: 5000 });
    await loc.passwordInput(this.page).fill(password);
    
    // Click login button
    await loc.loginButton(this.page).click();
    
    // Wait for navigation to home page or any Lightning page
    await this.page.waitForURL(/.*\/lightning\/.*/, { timeout: 60000 }).catch(() => {});
    
    // Additional wait for Lightning to fully initialize
    await this.page.waitForTimeout(3000);
  }

  /**
   * Check if login error is displayed
   * @returns {Promise<boolean>}
   */
  async isErrorDisplayed() {
    return await loc.errorMessage(this.page).isVisible();
  }

  /**
   * Get login error message text
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    return await loc.errorMessage(this.page).innerText();
  }

  /**
   * Check "Remember me" checkbox
   */
  async checkRememberMe() {
    await loc.rememberMeCheckbox(this.page).check();
  }

  /**
   * Click "Forgot password" link
   */
  async clickForgotPassword() {
    await loc.forgotPasswordLink(this.page).click();
  }

  /**
   * Verify login page is loaded
   */
  async verifyLoginPage() {
    await loc.usernameInput(this.page).waitFor({ state: 'visible', timeout: 10000 });
    await loc.passwordInput(this.page).waitFor({ state: 'visible', timeout: 10000 });
    await loc.loginButton(this.page).waitFor({ state: 'visible', timeout: 10000 });
  }
}

module.exports = SalesforceLoginPage;
