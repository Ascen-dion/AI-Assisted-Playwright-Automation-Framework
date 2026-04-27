const loc = require('./locators/adaptive-budget-entry.locators');
const URL = 'https://login.adaptiveplanning.com/app';

class AdaptiveBudgetEntryPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  // Login Methods
  async login(username, password) {
    await this.page.fill(loc.usernameInput, username);
    await this.page.fill(loc.passwordInput, password);
    await this.page.click(loc.loginButton);
    await this.page.waitForLoadState('networkidle');
  }

  async isLoginPageLoaded() {
    return await this.page.isVisible(loc.loginButton);
  }

  async isHomePageDisplayed() {
    return await this.page.isVisible(loc.homePage) || await this.page.isVisible(loc.dashboard);
  }

  // Navigation Methods
  async navigateToBudgetEntrySales() {
    // Implementation depends on actual navigation pattern
    // This is a placeholder that should be updated based on actual UI
    await this.page.waitForSelector(loc.budgetEntrySalesPage, { timeout: 30000 });
  }

  async isBudgetEntrySalesPageLoaded() {
    return await this.page.isVisible(loc.budgetEntrySalesPage);
  }

  // Tab Interaction Methods
  async clickTab(tabLocator) {
    await this.page.click(tabLocator);
    await this.page.waitForLoadState('networkidle');
  }

  async clickInstructionsTab() {
    await this.clickTab(loc.instructionsTab);
  }

  async clickTargetRevenueTab() {
    await this.clickTab(loc.targetRevenueTab);
  }

  async clickTargetExpenseTab() {
    await this.clickTab(loc.targetExpenseTab);
  }

  async clickWorkforceTab() {
    await this.clickTab(loc.workforceTab);
  }

  async clickProductRevenueTab() {
    await this.clickTab(loc.productRevenueTab);
  }

  async clickSensitivityAnalysisTab() {
    await this.clickTab(loc.sensitivityAnalysisTab);
  }

  async clickPipelineTab() {
    await this.clickTab(loc.pipelineTab);
  }

  async clickTravelTab() {
    await this.clickTab(loc.travelTab);
  }

  async clickCapitalTab() {
    await this.clickTab(loc.capitalTab);
  }

  async clickExpensesTab() {
    await this.clickTab(loc.expensesTab);
  }

  async clickVariancesTab() {
    await this.clickTab(loc.variancesTab);
  }

  async clickReviewTab() {
    await this.clickTab(loc.reviewTab);
  }

  // Tab Visibility Methods
  async isTabVisible(tabLocator) {
    return await this.page.isVisible(tabLocator);
  }

  async getAllVisibleTabs() {
    return await this.page.locator('[role="tab"]').all();
  }

  async getTabCount() {
    const tabs = await this.getAllVisibleTabs();
    return tabs.length;
  }

  async getTabText(tabLocator) {
    return await this.page.textContent(tabLocator);
  }

  // Active Tab Methods
  async getActiveTab() {
    return await this.page.locator(loc.activeTab);
  }

  async isTabActive(tabLocator) {
    const tab = this.page.locator(tabLocator);
    const ariaSelected = await tab.getAttribute('aria-selected');
    return ariaSelected === 'true';
  }

  async getActiveTabText() {
    const activeTab = await this.getActiveTab();
    return await activeTab.textContent();
  }

  async getActiveTabCount() {
    const activeTabs = await this.page.locator(loc.activeTab).all();
    return activeTabs.length;
  }

  // Scroll Arrow Methods
  async clickLeftScrollArrow() {
    await this.page.click(loc.leftScrollArrow);
    await this.page.waitForTimeout(500); // Wait for scroll animation
  }

  async clickRightScrollArrow() {
    await this.page.click(loc.rightScrollArrow);
    await this.page.waitForTimeout(500); // Wait for scroll animation
  }

  async isLeftScrollArrowVisible() {
    return await this.page.isVisible(loc.leftScrollArrow);
  }

  async isRightScrollArrowVisible() {
    return await this.page.isVisible(loc.rightScrollArrow);
  }

  async isLeftScrollArrowDisabled() {
    const arrow = this.page.locator(loc.leftScrollArrow);
    return await arrow.isDisabled();
  }

  async isRightScrollArrowDisabled() {
    const arrow = this.page.locator(loc.rightScrollArrow);
    return await arrow.isDisabled();
  }

  // Content Visibility Methods
  async isInstructionsContentVisible() {
    return await this.page.isVisible(loc.instructionsContent);
  }

  async isTargetRevenueContentVisible() {
    return await this.page.isVisible(loc.targetRevenueContent);
  }

  async isTargetExpenseContentVisible() {
    return await this.page.isVisible(loc.targetExpenseContent);
  }

  async isWorkforceContentVisible() {
    return await this.page.isVisible(loc.workforceContent);
  }

  async isProductRevenueContentVisible() {
    return await this.page.isVisible(loc.productRevenueContent);
  }

  async isSensitivityAnalysisContentVisible() {
    return await this.page.isVisible(loc.sensitivityAnalysisContent);
  }

  async isPipelineContentVisible() {
    return await this.page.isVisible(loc.pipelineContent);
  }

  async isTravelContentVisible() {
    return await this.page.isVisible(loc.travelContent);
  }

  async isCapitalContentVisible() {
    return await this.page.isVisible(loc.capitalContent);
  }

  async isExpensesContentVisible() {
    return await this.page.isVisible(loc.expensesContent);
  }

  async isVariancesContentVisible() {
    return await this.page.isVisible(loc.variancesContent);
  }

  async isReviewContentVisible() {
    return await this.page.isVisible(loc.reviewContent);
  }

  // Budget Input Sheet Methods
  async isBudgetInputSheetVisible() {
    return await this.page.isVisible(loc.budgetInputSheet);
  }

  async getDepartmentContext() {
    return await this.page.textContent(loc.departmentContext);
  }

  async getTimePeriodContext() {
    return await this.page.textContent(loc.timePeriodContext);
  }

  async getCurrencyContext() {
    return await this.page.textContent(loc.currencyContext);
  }

  async getPlanVersionContext() {
    return await this.page.textContent(loc.planVersionContext);
  }

  // Planning View Methods
  async isPlanningViewVisible() {
    return await this.page.isVisible(loc.planningView);
  }

  async isModelingToolsVisible() {
    return await this.page.isVisible(loc.modelingTools);
  }

  async isPipelineDataVisible() {
    return await this.page.isVisible(loc.pipelineData);
  }

  // Cost Planning Sheet Methods
  async isCostPlanningSheetVisible() {
    return await this.page.isVisible(loc.costPlanningSheet);
  }

  async isExpenseFieldsVisible() {
    return await this.page.isVisible(loc.expenseFields);
  }

  // Summary View Methods
  async isSummaryViewVisible() {
    return await this.page.isVisible(loc.summaryView);
  }

  async isVarianceAnalysisVisible() {
    return await this.page.isVisible(loc.varianceAnalysis);
  }

  async isConsolidatedBudgetInfoVisible() {
    return await this.page.isVisible(loc.consolidatedBudgetInfo);
  }

  // Toolbar Methods
  async clickBackButton() {
    await this.page.click(loc.backButton);
    await this.page.waitForLoadState('networkidle');
  }

  // Browser Resize Method
  async resizeBrowser(width, height) {
    await this.page.setViewportSize({ width, height });
  }

  // Get Current URL
  async getCurrentUrl() {
    return this.page.url();
  }

  // Get Page Title
  async getPageTitle() {
    return await this.page.title();
  }
}

module.exports = AdaptiveBudgetEntryPage;