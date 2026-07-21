/**
 * Salesforce Home Page Locators
 * 
 * This module contains all locators for the Salesforce Lightning home page.
 */

const locators = {
  /**
   * App Launcher button (waffle icon)
   */
  appLauncherButton: (page) => page.locator('button.slds-icon-waffle'),

  /**
   * App Launcher modal
   */
  appLauncherModal: (page) => page.locator('div.appLauncher'),

  /**
   * App Launcher search input
   */
  appLauncherSearch: (page) => page.locator('input[placeholder*="Search apps"]'),

  /**
   * Global search input
   */
  globalSearchInput: (page) => page.locator('input[placeholder*="Search"]').first(),

  /**
   * User profile button
   */
  userProfileButton: (page) => page.locator('button.profile-trigger'),

  /**
   * Setup link in user menu
   */
  setupLink: (page) => page.locator('a[title="Setup"]'),

  /**
   * Logout link in user menu
   */
  logoutLink: (page) => page.locator('a[title="Log Out"]'),

  /**
   * Lightning spinner (loading indicator)
   */
  lightningSpinner: (page) => page.locator('lightning-spinner'),

  /**
   * Main content area
   */
  mainContent: (page) => page.locator('div.slds-page-header, article.slds-card').first(),

  /**
   * Navigation bar
   */
  navigationBar: (page) => page.locator('nav.slds-context-bar'),

  /**
   * Toast message container
   */
  toastMessage: (page) => page.locator('div.forceVisualMessageQueue div.toastMessage'),
};

module.exports = locators;
