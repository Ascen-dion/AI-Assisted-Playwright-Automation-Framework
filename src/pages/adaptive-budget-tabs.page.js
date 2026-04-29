const loc = require('./locators/adaptive-budget-tabs.locators');
const TD = require('../data/adaptive-test-data');

class AdaptiveBudgetTabsPage {
  constructor(page) {
    this.page = page;
  }

  async waitForTabsLoad() {
    await loc.tabList(this.page).waitFor({ state: 'visible', timeout: 30000 });
  }

  async getActiveTabName() {
    const activeTab = loc.activeTab(this.page);
    await activeTab.waitFor({ state: 'visible', timeout: 15000 });
    return await activeTab.getAttribute('name') || await activeTab.textContent();
  }

  async isTabActive(tabName) {
    const activeTab = loc.activeTab(this.page);
    const name = await activeTab.getAttribute('name') || await activeTab.textContent();
    return name.trim() === tabName.trim();
  }

  async clickTab(tabName) {
    const tabLocator = this.getTabLocatorByName(tabName);
    await tabLocator.click();
    await this.page.waitForTimeout(1000); // Allow tab transition
  }

  getTabLocatorByName(tabName) {
    const tabMap = {
      'Instructions': loc.instructionsTab,
      'Target Revenue': loc.targetRevenueTab,
      'Target Expense': loc.targetExpenseTab,
      'Workforce': loc.workforceTab,
      'Product Revenue': loc.productRevenueTab,
      'Sensitivity Analysis': loc.sensitivityAnalysisTab,
      'Pipeline': loc.pipelineTab,
      'Travel': loc.travelTab,
      'Capital': loc.capitalTab,
      'Expenses': loc.expensesTab,
      'Variances': loc.variancesTab,
      'Review': loc.reviewTab
    };
    return tabMap[tabName](this.page);
  }

  async getAllTabNames() {
    const tabs = loc.allTabs(this.page);
    const count = await tabs.count();
    const tabNames = [];
    for (let i = 0; i < count; i++) {
      const name = await tabs.nth(i).getAttribute('name') || await tabs.nth(i).textContent();
      tabNames.push(name.trim());
    }
    return tabNames;
  }

  async getTabCount() {
    return await loc.allTabs(this.page).count();
  }

  async isTabVisible(tabName) {
    const tabLocator = this.getTabLocatorByName(tabName);
    return await tabLocator.isVisible();
  }

  async isScrollLeftVisible() {
    return await loc.scrollLeft(this.page).isVisible();
  }

  async isScrollRightVisible() {
    return await loc.scrollRight(this.page).isVisible();
  }

  async isScrollLeftEnabled() {
    const scrollLeft = loc.scrollLeft(this.page);
    const isDisabled = await scrollLeft.getAttribute('disabled');
    const ariaDisabled = await scrollLeft.getAttribute('aria-disabled');
    return isDisabled === null && ariaDisabled !== 'true';
  }

  async isScrollRightEnabled() {
    const scrollRight = loc.scrollRight(this.page);
    const isDisabled = await scrollRight.getAttribute('disabled');
    const ariaDisabled = await scrollRight.getAttribute('aria-disabled');
    return isDisabled === null && ariaDisabled !== 'true';
  }

  async clickScrollLeft() {
    await loc.scrollLeft(this.page).click();
    await this.page.waitForTimeout(500); // Allow scroll animation
  }

  async clickScrollRight() {
    await loc.scrollRight(this.page).click();
    await this.page.waitForTimeout(500); // Allow scroll animation
  }

  async isTabContentVisible() {
    return await loc.tabContent(this.page).isVisible();
  }

  async getTabContentText() {
    return await loc.tabContent(this.page).textContent();
  }

  async getActiveTabsCount() {
    const activeTabs = this.page.locator('[role="tab"][aria-selected="true"]');
    return await activeTabs.count();
  }
}

module.exports = AdaptiveBudgetTabsPage;