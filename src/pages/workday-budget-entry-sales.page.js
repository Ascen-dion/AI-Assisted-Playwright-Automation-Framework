const loc = require('./locators/workday-budget-entry-sales.locators');

class BudgetEntrySalesPage {
  constructor(page) {
    this.page = page;
  }

  // Navigation methods
  async goto(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async login(username, password) {
    await loc.usernameInput(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await loc.usernameInput(this.page).fill(username);
    await loc.passwordInput(this.page).fill(password);
    await loc.loginButton(this.page).click();
  }

  async waitForDashboardLoad() {
    await loc.dashboardContainer(this.page).waitFor({ state: 'visible', timeout: 30000 });
  }

  async navigateToBudgetEntrySales() {
    await loc.sheetsMenu(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await loc.sheetsMenu(this.page).click();
    await loc.budgetEntrySalesLink(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await loc.budgetEntrySalesLink(this.page).click();
  }

  // Tab interaction methods
  async clickTab(tabName) {
    const tabLocatorMap = {
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
    
    const tabLocator = tabLocatorMap[tabName];
    if (tabLocator) {
      await tabLocator(this.page).waitFor({ state: 'visible', timeout: 30000 });
      await tabLocator(this.page).click();
    }
  }

  async getActiveTabText() {
    await loc.activeTab(this.page).waitFor({ state: 'visible', timeout: 10000 });
    return await loc.activeTab(this.page).textContent();
  }

  async isTabActive(tabName) {
    const activeText = await this.getActiveTabText();
    return activeText.trim() === tabName;
  }

  async getAllTabsText() {
    await loc.allTabs(this.page).first().waitFor({ state: 'visible', timeout: 10000 });
    const tabs = await loc.allTabs(this.page).all();
    const tabTexts = [];
    for (const tab of tabs) {
      const text = await tab.textContent();
      tabTexts.push(text.trim());
    }
    return tabTexts;
  }

  async getTabCount() {
    await loc.allTabs(this.page).first().waitFor({ state: 'visible', timeout: 10000 });
    return await loc.allTabs(this.page).count();
  }

  // Scroll arrow methods
  async isLeftArrowDisabled() {
    await loc.leftScrollArrow(this.page).waitFor({ state: 'visible', timeout: 10000 });
    const isDisabled = await loc.leftScrollArrow(this.page).isDisabled();
    const ariaDisabled = await loc.leftScrollArrow(this.page).getAttribute('aria-disabled');
    const hasDisabledClass = await loc.leftScrollArrow(this.page).evaluate(el => 
      el.classList.contains('disabled') || el.classList.contains('greyed-out')
    );
    return isDisabled || ariaDisabled === 'true' || hasDisabledClass;
  }

  async isRightArrowDisabled() {
    await loc.rightScrollArrow(this.page).waitFor({ state: 'visible', timeout: 10000 });
    const isDisabled = await loc.rightScrollArrow(this.page).isDisabled();
    const ariaDisabled = await loc.rightScrollArrow(this.page).getAttribute('aria-disabled');
    const hasDisabledClass = await loc.rightScrollArrow(this.page).evaluate(el => 
      el.classList.contains('disabled') || el.classList.contains('greyed-out')
    );
    return isDisabled || ariaDisabled === 'true' || hasDisabledClass;
  }

  async clickLeftScrollArrow() {
    await loc.leftScrollArrow(this.page).waitFor({ state: 'visible', timeout: 10000 });
    await loc.leftScrollArrow(this.page).click();
  }

  async clickRightScrollArrow() {
    await loc.rightScrollArrow(this.page).waitFor({ state: 'visible', timeout: 10000 });
    await loc.rightScrollArrow(this.page).click();
  }

  async areScrollArrowsVisible() {
    const leftVisible = await loc.leftScrollArrow(this.page).isVisible().catch(() => false);
    const rightVisible = await loc.rightScrollArrow(this.page).isVisible().catch(() => false);
    return leftVisible && rightVisible;
  }

  // Content verification methods
  async isInstructionsContentVisible() {
    return await loc.instructionsContent(this.page).isVisible().catch(() => false);
  }

  async isTargetRevenueSheetVisible() {
    return await loc.targetRevenueSheet(this.page).isVisible().catch(() => false);
  }

  // Context methods
  async getDepartmentContext() {
    await loc.departmentContext(this.page).waitFor({ state: 'visible', timeout: 10000 });
    return await loc.departmentContext(this.page).textContent();
  }

  async getTimePeriodContext() {
    await loc.timePeriodContext(this.page).waitFor({ state: 'visible', timeout: 10000 });
    return await loc.timePeriodContext(this.page).textContent();
  }

  async getCurrencyContext() {
    await loc.currencyContext(this.page).waitFor({ state: 'visible', timeout: 10000 });
    return await loc.currencyContext(this.page).textContent();
  }

  async getPlanVersionContext() {
    await loc.planVersionContext(this.page).waitFor({ state: 'visible', timeout: 10000 });
    return await loc.planVersionContext(this.page).textContent();
  }

  // Utility methods
  async resizeBrowserWindow(width, height) {
    await this.page.setViewportSize({ width, height });
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }
}

module.exports = BudgetEntrySalesPage;