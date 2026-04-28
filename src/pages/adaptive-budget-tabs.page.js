/**
 * Page Object for Adaptive Planning Budget Entry Tabs
 */

const loc = require('./locators/adaptive-budget-tabs.locators');

class AdaptiveBudgetTabsPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for tabs to be loaded
   */
  async waitForTabsToLoad() {
    await loc.tabList(this.page).waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get all tab names
   * @returns {Promise<string[]>} - Array of tab names
   */
  async getAllTabNames() {
    await this.waitForTabsToLoad();
    const tabs = await loc.allTabs(this.page).all();
    const tabNames = [];
    for (const tab of tabs) {
      const name = await tab.textContent();
      tabNames.push(name.trim());
    }
    return tabNames;
  }

  /**
   * Get count of all tabs
   * @returns {Promise<number>} - Number of tabs
   */
  async getTabCount() {
    await this.waitForTabsToLoad();
    return await loc.allTabs(this.page).count();
  }

  /**
   * Click on a specific tab by name
   * @param {string} tabName - Name of the tab to click
   */
  async clickTab(tabName) {
    await loc.tab(this.page, tabName).waitFor({ state: 'visible', timeout: 10000 });
    await loc.tab(this.page, tabName).click();
    // Wait for tab content to load
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  }

  /**
   * Get active tab name
   * @returns {Promise<string>} - Name of the active tab
   */
  async getActiveTabName() {
    await loc.activeTab(this.page).waitFor({ state: 'visible', timeout: 10000 });
    const text = await loc.activeTab(this.page).textContent();
    return text.trim();
  }

  /**
   * Check if a specific tab is active
   * @param {string} tabName - Name of the tab to check
   * @returns {Promise<boolean>} - True if tab is active
   */
  async isTabActive(tabName) {
    const activeTabName = await this.getActiveTabName();
    return activeTabName === tabName;
  }

  /**
   * Check if only one tab is highlighted
   * @returns {Promise<boolean>} - True if only one tab is highlighted
   */
  async isOnlyOneTabHighlighted() {
    const highlightedTabs = await loc.activeTab(this.page).count();
    return highlightedTabs === 1;
  }

  /**
   * Check if left scroll arrow is visible
   * @returns {Promise<boolean>} - True if left scroll arrow is visible
   */
  async isLeftScrollVisible() {
    try {
      await loc.scrollLeft(this.page).waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if right scroll arrow is visible
   * @returns {Promise<boolean>} - True if right scroll arrow is visible
   */
  async isRightScrollVisible() {
    try {
      await loc.scrollRight(this.page).waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if left scroll arrow is disabled
   * @returns {Promise<boolean>} - True if left scroll arrow is disabled
   */
  async isLeftScrollDisabled() {
    const isDisabled = await loc.scrollLeft(this.page).isDisabled();
    return isDisabled;
  }

  /**
   * Check if right scroll arrow is disabled
   * @returns {Promise<boolean>} - True if right scroll arrow is disabled
   */
  async isRightScrollDisabled() {
    const isDisabled = await loc.scrollRight(this.page).isDisabled();
    return isDisabled;
  }

  /**
   * Click left scroll arrow
   */
  async clickLeftScroll() {
    await loc.scrollLeft(this.page).waitFor({ state: 'visible', timeout: 5000 });
    await loc.scrollLeft(this.page).click();
    await this.page.waitForTimeout(500); // Wait for scroll animation
  }

  /**
   * Click right scroll arrow
   */
  async clickRightScroll() {
    await loc.scrollRight(this.page).waitFor({ state: 'visible', timeout: 5000 });
    await loc.scrollRight(this.page).click();
    await this.page.waitForTimeout(500); // Wait for scroll animation
  }

  /**
   * Check if tab content is visible
   * @returns {Promise<boolean>} - True if tab content is visible
   */
  async isTabContentVisible() {
    try {
      await loc.tabContent(this.page).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify tab is visible by name
   * @param {string} tabName - Name of the tab
   * @returns {Promise<boolean>} - True if tab is visible
   */
  async isTabVisible(tabName) {
    try {
      await loc.tab(this.page, tabName).waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = AdaptiveBudgetTabsPage;