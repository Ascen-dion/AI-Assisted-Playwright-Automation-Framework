const loc = require('./locators/adaptive-budget-tabs.locators');

class AdaptiveBudgetTabsPage {
  constructor(page) {
    this.page = page;
  }

  async clickTab(tabName) {
    await loc.tab(this.page, tabName).click();
  }

  async getActiveTabName() {
    return await loc.activeTab(this.page).textContent();
  }

  async isTabActive(tabName) {
    const activeTab = await this.getActiveTabName();
    return activeTab.trim() === tabName;
  }

  async getAllTabNames() {
    const tabs = await loc.allTabs(this.page).allTextContents();
    return tabs.map(tab => tab.trim());
  }

  async clickScrollLeft() {
    await loc.scrollLeft(this.page).click();
  }

  async clickScrollRight() {
    await loc.scrollRight(this.page).click();
  }

  async isScrollLeftDisabled() {
    return await loc.scrollLeft(this.page).isDisabled();
  }

  async isScrollRightDisabled() {
    return await loc.scrollRight(this.page).isDisabled();
  }

  async isScrollLeftVisible() {
    return await loc.scrollLeft(this.page).isVisible();
  }

  async isScrollRightVisible() {
    return await loc.scrollRight(this.page).isVisible();
  }

  getTab(tabName) {
    return loc.tab(this.page, tabName);
  }

  getActiveTab() {
    return loc.activeTab(this.page);
  }

  getAllTabs() {
    return loc.allTabs(this.page);
  }

  getScrollLeftButton() {
    return loc.scrollLeft(this.page);
  }

  getScrollRightButton() {
    return loc.scrollRight(this.page);
  }

  getTabContent() {
    return loc.tabContent(this.page);
  }
}

module.exports = AdaptiveBudgetTabsPage;