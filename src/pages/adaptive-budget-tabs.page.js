/**
 * Page Object for Adaptive Planning Budget Tabs
 * @class AdaptiveBudgetTabsPage
 */

const budgetTabsLocators = require('./locators/adaptive-budget-tabs.locators');
const logger = require('../helpers/logger');

class AdaptiveBudgetTabsPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Get all tab names in order
   * @returns {Promise<Array<string>>} Array of tab names
   */
  async getAllTabNames() {
    logger.info('Getting all tab names');
    const allTabs = budgetTabsLocators.allTabs(this.page);
    await allTabs.first().waitFor({ state: 'visible', timeout: 15000 });
    const count = await allTabs.count();
    const tabNames = [];
    for (let i = 0; i < count; i++) {
      const tabName = await allTabs.nth(i).textContent();
      tabNames.push(tabName.trim());
    }
    logger.info(`Found ${tabNames.length} tabs: ${tabNames.join(', ')}`);
    return tabNames;
  }

  /**
   * Get active tab name
   * @returns {Promise<string>} Active tab name
   */
  async getActiveTabName() {
    logger.info('Getting active tab name');
    const activeTab = budgetTabsLocators.activeTab(this.page);
    await activeTab.waitFor({ state: 'visible' });
    const tabName = await activeTab.textContent();
    logger.info(`Active tab: ${tabName.trim()}`);
    return tabName.trim();
  }

  /**
   * Click on a tab by name
   * @param {string} tabName - Name of the tab to click
   */
  async clickTab(tabName) {
    logger.info(`Clicking tab: ${tabName}`);
    const tab = budgetTabsLocators.tab(this.page, tabName);
    await tab.waitFor({ state: 'visible' });
    await tab.click();
    await this.page.waitForTimeout(500); // Allow tab transition
    logger.info(`Tab clicked: ${tabName}`);
  }

  /**
   * Verify tab is highlighted/active
   * @param {string} tabName - Name of the tab to verify
   */
  async verifyTabIsActive(tabName) {
    logger.info(`Verifying tab is active: ${tabName}`);
    const activeTabName = await this.getActiveTabName();
    if (activeTabName !== tabName) {
      throw new Error(`Expected tab "${tabName}" to be active, but "${activeTabName}" is active`);
    }
    logger.info(`Tab "${tabName}" is active as expected`);
  }

  /**
   * Verify only one tab is highlighted
   */
  async verifyOnlyOneTabIsActive() {
    logger.info('Verifying only one tab is active');
    const activeTabs = budgetTabsLocators.activeTab(this.page);
    const count = await activeTabs.count();
    if (count !== 1) {
      throw new Error(`Expected exactly 1 active tab, but found ${count}`);
    }
    logger.info('Only one tab is active');
  }

  /**
   * Verify tab content is displayed
   */
  async verifyTabContentDisplayed() {
    logger.info('Verifying tab content is displayed');
    const tabContent = budgetTabsLocators.tabContent(this.page);
    await tabContent.waitFor({ state: 'visible' });
    logger.info('Tab content is displayed');
  }

  /**
   * Click scroll left button
   */
  async clickScrollLeft() {
    logger.info('Clicking scroll left button');
    const scrollLeft = budgetTabsLocators.scrollLeftButton(this.page);
    await scrollLeft.waitFor({ state: 'visible' });
    await scrollLeft.click();
    await this.page.waitForTimeout(300);
    logger.info('Scroll left button clicked');
  }

  /**
   * Click scroll right button
   */
  async clickScrollRight() {
    logger.info('Clicking scroll right button');
    const scrollRight = budgetTabsLocators.scrollRightButton(this.page);
    await scrollRight.waitFor({ state: 'visible' });
    await scrollRight.click();
    await this.page.waitForTimeout(300);
    logger.info('Scroll right button clicked');
  }

  /**
   * Verify scroll left button is disabled
   */
  async verifyScrollLeftDisabled() {
    logger.info('Verifying scroll left button is disabled');
    const scrollLeft = budgetTabsLocators.scrollLeftButton(this.page);
    const isDisabled = await scrollLeft.isDisabled();
    if (!isDisabled) {
      throw new Error('Scroll left button should be disabled but is enabled');
    }
    logger.info('Scroll left button is disabled');
  }

  /**
   * Verify scroll left button is enabled
   */
  async verifyScrollLeftEnabled() {
    logger.info('Verifying scroll left button is enabled');
    const scrollLeft = budgetTabsLocators.scrollLeftButton(this.page);
    const isDisabled = await scrollLeft.isDisabled();
    if (isDisabled) {
      throw new Error('Scroll left button should be enabled but is disabled');
    }
    logger.info('Scroll left button is enabled');
  }

  /**
   * Verify scroll buttons are visible
   */
  async verifyScrollButtonsVisible() {
    logger.info('Verifying scroll buttons are visible');
    const scrollLeft = budgetTabsLocators.scrollLeftButton(this.page);
    const scrollRight = budgetTabsLocators.scrollRightButton(this.page);
    await scrollLeft.waitFor({ state: 'visible' });
    await scrollRight.waitFor({ state: 'visible' });
    logger.info('Scroll buttons are visible');
  }

  /**
   * Verify Instructions tab content is displayed
   */
  async verifyInstructionsContent() {
    logger.info('Verifying Instructions tab content');
    const tabContent = budgetTabsLocators.tabContent(this.page);
    await tabContent.waitFor({ state: 'visible' });
    const content = await tabContent.textContent();
    if (!content || content.trim().length === 0) {
      throw new Error('Instructions content is empty');
    }
    logger.info('Instructions content is displayed');
  }
}

module.exports = AdaptiveBudgetTabsPage;