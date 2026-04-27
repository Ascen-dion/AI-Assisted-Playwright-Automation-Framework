const loc = require('./locators/adaptive-planning-budget-entry.locators');

class AdaptivePlanningBudgetEntryPage {
  constructor(page) {
    this.page = page;
  }

  // Navigation Methods
  async goto(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async login(username, password) {
    await this.page.locator(loc.usernameInput).fill(username);
    await this.page.locator(loc.passwordInput).fill(password);
    await this.page.locator(loc.loginButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToBudgetEntrySales() {
    await this.page.locator(loc.sheetsMenu).click();
    await this.page.locator(loc.budgetEntryLink).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Tab Navigation Methods
  async clickInstructionsTab() {
    await this.page.locator(loc.instructionsTab).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickTargetRevenueTab() {
    await this.page.locator(loc.targetRevenueTab).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickTargetExpenseTab() {
    await this.page.locator(loc.targetExpenseTab).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickWorkforceTab() {
    await this.page.locator(loc.workforceTab).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickProductRevenueTab() {
    await this.page.locator(loc.productRevenueTab).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickSensitivityAnalysisTab() {
    await this.page.locator(loc.sensitivityAnalysisTab).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickPipelineTab() {
    await this.page.locator(loc.pipelineTab).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickTravelTab() {
    await this.page.locator(loc.travelTab).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickCapitalTab() {
    await this.page.locator(loc.capitalTab).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickExpensesTab() {
    await this.page.locator(loc.expensesTab).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickVariancesTab() {
    await this.page.locator(loc.variancesTab).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickReviewTab() {
    await this.page.locator(loc.reviewTab).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Scroll Methods
  async clickLeftScrollArrow() {
    await this.page.locator(loc.leftScrollArrow).click();
  }

  async clickRightScrollArrow() {
    await this.page.locator(loc.rightScrollArrow).click();
  }

  // Verification Methods - Return values for assertions in specs
  async isInstructionsTabActive() {
    const activeTab = await this.page.locator(loc.activeTab).first();
    const text = await activeTab.textContent();
    return text.includes('Instructions');
  }

  async getActiveTabText() {
    const activeTab = await this.page.locator(loc.activeTab).first();
    return await activeTab.textContent();
  }

  async getAllTabsText() {
    const tabs = await this.page.locator('[role="tab"]').allTextContents();
    return tabs;
  }

  async getActiveTabCount() {
    return await this.page.locator(loc.activeTab).count();
  }

  async isLeftScrollArrowDisabled() {
    const arrow = this.page.locator(loc.leftScrollArrow);
    return await arrow.isDisabled();
  }

  async isRightScrollArrowDisabled() {
    const arrow = this.page.locator(loc.rightScrollArrow);
    return await arrow.isDisabled();
  }

  async areScrollArrowsVisible() {
    const leftVisible = await this.page.locator(loc.leftScrollArrow).isVisible();
    const rightVisible = await this.page.locator(loc.rightScrollArrow).isVisible();
    return leftVisible && rightVisible;
  }

  async isInstructionsContentVisible() {
    return await this.page.locator(loc.instructionsContent).isVisible();
  }

  async isBudgetSheetVisible() {
    return await this.page.locator(loc.budgetSheet).isVisible();
  }

  async isPlanningViewVisible() {
    return await this.page.locator(loc.planningView).isVisible();
  }

  async isCostPlanningSheetVisible() {
    return await this.page.locator(loc.costPlanningSheet).isVisible();
  }

  async isSummaryViewVisible() {
    return await this.page.locator(loc.summaryView).isVisible();
  }

  async getDepartmentContext() {
    return await this.page.locator(loc.departmentContext).textContent();
  }

  async getTimePeriodContext() {
    return await this.page.locator(loc.timePeriodContext).textContent();
  }

  async getCurrencyContext() {
    return await this.page.locator(loc.currencyContext).textContent();
  }

  async getPlanVersionContext() {
    return await this.page.locator(loc.planVersionContext).textContent();
  }

  async clickBackButton() {
    await this.page.locator(loc.backButton).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getCurrentPageUrl() {
    return this.page.url();
  }

  async resizeBrowserWindow(width, height) {
    await this.page.setViewportSize({ width, height });
  }
}

module.exports = AdaptivePlanningBudgetEntryPage;