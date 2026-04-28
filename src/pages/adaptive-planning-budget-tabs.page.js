/**
 * Page Object for Adaptive Planning Budget Entry - Sales Page Tabs
 * Framework Rule: Page objects contain action methods, no assertions
 */

const loc = require('./locators/adaptive-planning-budget-tabs.locators');

class AdaptivePlanningBudgetTabsPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for tab strip to be visible
   */
  async waitForTabStrip() {
    await loc.tabStrip(this.page).waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Get active tab text
   * @returns {Promise<string>}
   */
  async getActiveTabText() {
    await loc.activeTab(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.activeTab(this.page).textContent();
  }

  /**
   * Click on a specific tab
   * @param {string} tabName - Name of the tab to click
   */
  async clickTab(tabName) {
    await loc.tab(this.page, tabName).waitFor({ state: 'visible', timeout: 15000 });
    await loc.tab(this.page, tabName).click();
    // Wait for tab content to load
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get all tab names
   * @returns {Promise<string[]>}
   */
  async getAllTabNames() {
    await loc.allTabs(this.page).first().waitFor({ state: 'visible', timeout: 15000 });
    const tabs = await loc.allTabs(this.page).all();
    const tabNames = [];
    for (const tab of tabs) {
      const text = await tab.textContent();
      tabNames.push(text.trim());
    }
    return tabNames;
  }

  /**
   * Get count of all tabs
   * @returns {Promise<number>}
   */
  async getTabCount() {
    await loc.allTabs(this.page).first().waitFor({ state: 'visible', timeout: 15000 });
    return await loc.allTabs(this.page).count();
  }

  /**
   * Check if a specific tab is active/highlighted
   * @param {string} tabName - Name of the tab to check
   * @returns {Promise<boolean>}
   */
  async isTabActive(tabName) {
    const activeTabText = await this.getActiveTabText();
    return activeTabText.trim() === tabName;
  }

  /**
   * Check if tab content is visible
   * @returns {Promise<boolean>}
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
   * Click scroll left arrow
   */
  async clickScrollLeft() {
    await loc.scrollLeft(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.scrollLeft(this.page).click();
    await this.page.waitForTimeout(500); // Wait for scroll animation
  }

  /**
   * Click scroll right arrow
   */
  async clickScrollRight() {
    await loc.scrollRight(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.scrollRight(this.page).click();
    await this.page.waitForTimeout(500); // Wait for scroll animation
  }

  /**
   * Check if scroll left arrow is disabled
   * @returns {Promise<boolean>}
   */
  async isScrollLeftDisabled() {
    try {
      await loc.scrollLeft(this.page).waitFor({ state: 'visible', timeout: 5000 });
      const isDisabled = await loc.scrollLeft(this.page).isDisabled();
      return isDisabled;
    } catch {
      return false;
    }
  }

  /**
   * Check if scroll right arrow is disabled
   * @returns {Promise<boolean>}
   */
  async isScrollRightDisabled() {
    try {
      await loc.scrollRight(this.page).waitFor({ state: 'visible', timeout: 5000 });
      const isDisabled = await loc.scrollRight(this.page).isDisabled();
      return isDisabled;
    } catch {
      return false;
    }
  }

  /**
   * Check if scroll arrows are visible
   * @returns {Promise<boolean>}
   */
  async areScrollArrowsVisible() {
    try {
      await loc.scrollLeft(this.page).waitFor({ state: 'visible', timeout: 5000 });
      await loc.scrollRight(this.page).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Resize browser window
   * @param {number} width - Window width
   * @param {number} height - Window height
   */
  async resizeWindow(width, height) {
    await this.page.setViewportSize({ width, height });
    await this.page.waitForTimeout(500); // Wait for resize to take effect
  }
}

module.exports = AdaptivePlanningBudgetTabsPage;