const tabLoc = require('./locators/adaptive-planning-budget-tabs.locators');
const headerLoc = require('./locators/adaptive-planning-budget-header.locators');
const navLoc = require('./locators/adaptive-planning-navigation.locators');
const URL = 'https://login.adaptiveplanning.com/app';

class AdaptivePlanningBudgetEntryPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async navigateToBudgetEntrySales() {
    await navLoc.sidebar(this.page).waitFor({ state: 'visible', timeout: 30000 });
    const sheetsLink = navLoc.getMenuItemByName(this.page, 'Sheets');
    if (await sheetsLink.isVisible()) {
      await sheetsLink.click();
    }
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async isInstructionsTabActive() {
    await tabLoc.activeTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    const activeTabText = await tabLoc.activeTab(this.page).textContent();
    return activeTabText.trim() === 'Instructions';
  }

  async isInstructionsTabVisible() {
    return await tabLoc.instructionsTab(this.page).isVisible();
  }

  async getInstructionsTabContent() {
    await tabLoc.tabContent(this.page).waitFor({ state: 'visible', timeout: 30000 });
    return await tabLoc.tabContent(this.page).textContent();
  }

  async getAllTabsCount() {
    await tabLoc.allTabs(this.page).first().waitFor({ state: 'visible', timeout: 30000 });
    return await tabLoc.allTabs(this.page).count();
  }

  async getAllTabNames() {
    await tabLoc.allTabs(this.page).first().waitFor({ state: 'visible', timeout: 30000 });
    const tabs = await tabLoc.allTabs(this.page).all();
    const tabNames = [];
    for (const tab of tabs) {
      const name = await tab.textContent();
      tabNames.push(name.trim());
    }
    return tabNames;
  }

  async clickTab(tabName) {
    const tab = tabLoc.getTabByName(this.page, tabName);
    await tab.waitFor({ state: 'visible', timeout: 30000 });
    await tab.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async clickInstructionsTab() {
    await tabLoc.instructionsTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.instructionsTab(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async clickTargetRevenueTab() {
    await tabLoc.targetRevenueTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.targetRevenueTab(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async clickTargetExpenseTab() {
    await tabLoc.targetExpenseTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.targetExpenseTab(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async clickWorkforceTab() {
    await tabLoc.workforceTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.workforceTab(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async clickProductRevenueTab() {
    await tabLoc.productRevenueTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.productRevenueTab(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async clickSensitivityAnalysisTab() {
    await tabLoc.sensitivityAnalysisTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.sensitivityAnalysisTab(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async clickPipelineTab() {
    await tabLoc.pipelineTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.pipelineTab(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async clickTravelTab() {
    await tabLoc.travelTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.travelTab(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async clickCapitalTab() {
    await tabLoc.capitalTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.capitalTab(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async clickExpensesTab() {
    await tabLoc.expensesTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.expensesTab(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async clickVariancesTab() {
    await tabLoc.variancesTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.variancesTab(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async clickReviewTab() {
    await tabLoc.reviewTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.reviewTab(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async getActiveTabName() {
    await tabLoc.activeTab(this.page).waitFor({ state: 'visible', timeout: 30000 });
    const text = await tabLoc.activeTab(this.page).textContent();
    return text.trim();
  }

  async isTabActive(tabName) {
    const activeTab = await this.getActiveTabName();
    return activeTab === tabName;
  }

  async isScrollLeftButtonVisible() {
    return await tabLoc.scrollLeftButton(this.page).isVisible();
  }

  async isScrollRightButtonVisible() {
    return await tabLoc.scrollRightButton(this.page).isVisible();
  }

  async clickScrollLeftButton() {
    await tabLoc.scrollLeftButton(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.scrollLeftButton(this.page).click();
    await this.page.waitForTimeout(500);
  }

  async clickScrollRightButton() {
    await tabLoc.scrollRightButton(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await tabLoc.scrollRightButton(this.page).click();
    await this.page.waitForTimeout(500);
  }

  async isScrollLeftButtonDisabled() {
    return await tabLoc.scrollLeftButton(this.page).isDisabled();
  }

  async isScrollRightButtonDisabled() {
    return await tabLoc.scrollRightButton(this.page).isDisabled();
  }

  async resizeBrowserWindow(width, height) {
    await this.page.setViewportSize({ width, height });
  }

  async selectDepartment(department) {
    await headerLoc.levelSelector(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await headerLoc.levelSelector(this.page).click();
    await this.page.getByText(department, { exact: true }).click();
  }

  async selectTimePeriod(timePeriod) {
    await headerLoc.timeSelector(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await headerLoc.timeSelector(this.page).click();
    await this.page.getByText(timePeriod, { exact: true }).click();
  }

  async selectCurrency(currency) {
    await headerLoc.currencySelector(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await headerLoc.currencySelector(this.page).click();
    await this.page.getByText(currency, { exact: true }).click();
  }

  async selectPlanVersion(version) {
    await headerLoc.versionButton(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await headerLoc.versionButton(this.page).click();
    await this.page.getByText(version, { exact: true }).click();
  }

  async getSelectedDepartment() {
    return await headerLoc.levelSelector(this.page).textContent();
  }

  async getSelectedTimePeriod() {
    return await headerLoc.timeSelector(this.page).textContent();
  }

  async getSelectedCurrency() {
    return await headerLoc.currencySelector(this.page).textContent();
  }

  async getSelectedPlanVersion() {
    return await headerLoc.versionButton(this.page).textContent();
  }

  async clickBackButton() {
    await navLoc.backButton(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await navLoc.backButton(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async isBackButtonVisible() {
    return await navLoc.backButton(this.page).isVisible();
  }

  async isBudgetInputSheetVisible() {
    return await tabLoc.tabContent(this.page).isVisible();
  }

  async isPlanningViewVisible() {
    return await tabLoc.tabContent(this.page).isVisible();
  }

  async isCostPlanningSheetVisible() {
    return await tabLoc.tabContent(this.page).isVisible();
  }

  async isSummaryViewVisible() {
    return await tabLoc.tabContent(this.page).isVisible();
  }
}

module.exports = AdaptivePlanningBudgetEntryPage;