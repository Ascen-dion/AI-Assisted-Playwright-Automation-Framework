/**
 * Page Object for Adaptive Planning Budget Tabs
 * Following framework POM pattern with logger integration
 */

const locators = require('./locators/adaptive-budget-tabs.locators');
const logger = require('../helpers/logger');

class AdaptiveBudgetTabsPage {
  constructor(page) {
    this.page = page;
    this.locators = locators;
  }

  /**
   * Get tab by name
   */
  getTab(tabName) {
    return this.locators.tab(this.page, tabName);
  }

  /**
   * Click on a specific tab
   */
  async clickTab(tabName) {
    logger.info(`Clicking tab: ${tabName}`);
    const tab = this.getTab(tabName);
    await tab.waitFor({ state: 'visible' });
    await tab.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.info(`Tab clicked: ${tabName}`);
  }

  /**
   * Verify tab is active/highlighted
   */
  async verifyTabIsActive(tabName) {
    logger.info(`Verifying tab is active: ${tabName}`);
    const tab = this.getTab(tabName);
    await tab.waitFor({ state: 'visible' });
    const isSelected = await tab.getAttribute('aria-selected');
    if (isSelected !== 'true') {
      throw new Error(`Tab ${tabName} is not active. aria-selected=${isSelected}`);
    }
    logger.info(`Tab verified as active: ${tabName}`);
  }

  /**
   * Verify tab is not active
   */
  async verifyTabIsNotActive(tabName) {
    logger.info(`Verifying tab is not active: ${tabName}`);
    const tab = this.getTab(tabName);
    await tab.waitFor({ state: 'visible' });
    const isSelected = await tab.getAttribute('aria-selected');
    if (isSelected === 'true') {
      throw new Error(`Tab ${tabName} should not be active but it is`);
    }
    logger.info(`Tab verified as not active: ${tabName}`);
  }

  /**
   * Get all tabs
   */
  async getAllTabs() {
    logger.info('Getting all tabs');
    const tabs = this.locators.allTabs(this.page);
    await tabs.first().waitFor({ state: 'visible' });
    return tabs;
  }

  /**
   * Get count of tabs
   */
  async getTabCount() {
    const tabs = await this.getAllTabs();
    const count = await tabs.count();
    logger.info(`Total tabs count: ${count}`);
    return count;
  }

  /**
   * Verify all expected tabs are present in order
   */
  async verifyTabsInOrder(expectedTabs) {
    logger.info('Verifying tabs are present in expected order');
    const tabs = await this.getAllTabs();
    const count = await tabs.count();
    
    if (count !== expectedTabs.length) {
      throw new Error(`Expected ${expectedTabs.length} tabs but found ${count}`);
    }

    for (let i = 0; i < expectedTabs.length; i++) {
      const tabText = await tabs.nth(i).textContent();
      const trimmedText = tabText.trim();
      if (trimmedText !== expectedTabs[i]) {
        throw new Error(`Tab at position ${i + 1}: expected "${expectedTabs[i]}" but found "${trimmedText}"`);
      }
      logger.info(`Tab ${i + 1} verified: ${expectedTabs[i]}`);
    }
    logger.info('All tabs verified in correct order');
  }

  /**
   * Get active tab
   */
  async getActiveTab() {
    logger.info('Getting active tab');
    const activeTab = this.locators.activeTab(this.page);
    await activeTab.waitFor({ state: 'visible' });
    return activeTab;
  }

  /**
   * Get active tab text
   */
  async getActiveTabText() {
    const activeTab = await this.getActiveTab();
    const text = await activeTab.textContent();
    logger.info(`Active tab text: ${text.trim()}`);
    return text.trim();
  }

  /**
   * Verify only one tab is highlighted
   */
  async verifyOnlyOneTabIsActive() {
    logger.info('Verifying only one tab is active');
    const activeTabs = this.locators.activeTab(this.page);
    const count = await activeTabs.count();
    if (count !== 1) {
      throw new Error(`Expected exactly 1 active tab but found ${count}`);
    }
    logger.info('Verified: Only one tab is active');
  }

  /**
   * Click scroll right arrow
   */
  async clickScrollRight() {
    logger.info('Clicking scroll right arrow');
    await this.locators.scrollRight(this.page).waitFor({ state: 'visible' });
    await this.locators.scrollRight(this.page).click();
    await this.page.waitForTimeout(500); // Brief wait for scroll animation
    logger.info('Scroll right clicked');
  }

  /**
   * Click scroll left arrow
   */
  async clickScrollLeft() {
    logger.info('Clicking scroll left arrow');
    await this.locators.scrollLeft(this.page).waitFor({ state: 'visible' });
    await this.locators.scrollLeft(this.page).click();
    await this.page.waitForTimeout(500); // Brief wait for scroll animation
    logger.info('Scroll left clicked');
  }

  /**
   * Verify scroll arrows are visible
   */
  async verifyScrollArrowsVisible() {
    logger.info('Verifying scroll arrows are visible');
    await this.locators.scrollLeft(this.page).waitFor({ state: 'visible' });
    await this.locators.scrollRight(this.page).waitFor({ state: 'visible' });
    logger.info('Scroll arrows verified as visible');
  }

  /**
   * Verify left arrow is disabled
   */
  async verifyLeftArrowDisabled() {
    logger.info('Verifying left arrow is disabled');
    const leftArrow = this.locators.scrollLeft(this.page);
    const isDisabled = await leftArrow.isDisabled();
    if (!isDisabled) {
      throw new Error('Left arrow should be disabled but it is not');
    }
    logger.info('Left arrow verified as disabled');
  }

  /**
   * Verify left arrow is enabled
   */
  async verifyLeftArrowEnabled() {
    logger.info('Verifying left arrow is enabled');
    const leftArrow = this.locators.scrollLeft(this.page);
    const isDisabled = await leftArrow.isDisabled();
    if (isDisabled) {
      throw new Error('Left arrow should be enabled but it is disabled');
    }
    logger.info('Left arrow verified as enabled');
  }

  /**
   * Verify tab content is displayed
   */
  async verifyTabContentDisplayed() {
    logger.info('Verifying tab content is displayed');
    await this.locators.tabContent(this.page).waitFor({ state: 'visible' });
    logger.info('Tab content verified as displayed');
  }
}

module.exports = AdaptiveBudgetTabsPage;