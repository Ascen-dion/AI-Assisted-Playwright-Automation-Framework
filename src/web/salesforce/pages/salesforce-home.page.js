/**
 * Salesforce Home Page
 * 
 * This page object handles interactions with the Salesforce Lightning home page.
 */

const loc = require('../locators/salesforce-home.locators');

class SalesforceHomePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to Salesforce home page
   * @param {string} baseUrl - The Salesforce instance base URL
   */
  async navigateTo(baseUrl) {
    await this.page.goto(`${baseUrl}/lightning/page/home`);
    await this.waitForPageLoad();
  }

  /**
   * Wait for Lightning page to fully load
   */
  async waitForPageLoad() {
    // Wait for Lightning spinner to disappear
    await this.page.waitForSelector('lightning-spinner', { state: 'detached', timeout: 10000 }).catch(() => {});
    
    // Wait for main content to be visible
    await loc.mainContent(this.page).waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Open the App Launcher
   */
  async openAppLauncher() {
    await loc.appLauncherButton(this.page).click();
    await loc.appLauncherModal(this.page).waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Search for an app or object in App Launcher
   * @param {string} searchTerm - The app or object name to search for
   */
  async searchInAppLauncher(searchTerm) {
    await this.openAppLauncher();
    await loc.appLauncherSearch(this.page).fill(searchTerm);
    await this.page.waitForTimeout(1000); // Wait for search results
  }

  /**
   * Navigate to an object from App Launcher
   * @param {string} objectName - The Salesforce object name (e.g., "Accounts", "Contacts")
   */
  async navigateToObject(objectName) {
    await this.searchInAppLauncher(objectName);
    await this.page.locator(`a[data-label="${objectName}"], a:has-text("${objectName}")`).first().click();
    await this.waitForPageLoad();
  }

  /**
   * Use global search
   * @param {string} searchTerm - The search term
   */
  async useGlobalSearch(searchTerm) {
    await loc.globalSearchInput(this.page).click();
    await loc.globalSearchInput(this.page).fill(searchTerm);
    await this.page.keyboard.press('Enter');
    await this.waitForPageLoad();
  }

  /**
   * Open user profile menu
   */
  async openUserProfileMenu() {
    await loc.userProfileButton(this.page).click();
  }

  /**
   * Log out from Salesforce
   */
  async logout() {
    await this.openUserProfileMenu();
    await loc.logoutLink(this.page).click();
  }

  /**
   * Navigate to Setup
   */
  async navigateToSetup() {
    await this.openUserProfileMenu();
    await loc.setupLink(this.page).click();
    await this.waitForPageLoad();
  }

  /**
   * Verify success toast message
   * @param {string} expectedMessage - Optional expected message text
   */
  async verifySuccessToast(expectedMessage = null) {
    const toast = loc.toastMessage(this.page);
    await toast.waitFor({ state: 'visible', timeout: 5000 });
    
    if (expectedMessage) {
      const toastText = await toast.innerText();
      if (!toastText.includes(expectedMessage)) {
        throw new Error(`Expected toast message to include "${expectedMessage}", but got "${toastText}"`);
      }
    }
  }

  /**
   * Verify home page is loaded
   */
  async verifyHomePage() {
    await loc.navigationBar(this.page).waitFor({ state: 'visible', timeout: 10000 });
    await loc.appLauncherButton(this.page).waitFor({ state: 'visible', timeout: 10000 });
  }
}

module.exports = SalesforceHomePage;
