const loc = require('./locators/workday-budget-sales.locators');
const URL = 'https://login.adaptiveplanning.com/app';

class BudgetSalesPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async login(username, password) {
    await loc.usernameInput(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.usernameInput(this.page).fill(username);
    await loc.passwordInput(this.page).fill(password);
    await loc.loginButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  async navigateToBudgetEntrySales() {
    await loc.budgetEntrySalesMenu(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.budgetEntrySalesMenu(this.page).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  }

  async getActiveTabName() {
    await loc.activeTab(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.activeTab(this.page).textContent();
  }

  async isInstructionsContentVisible() {
    try {
      await loc.instructionsContent(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAllTabNames() {
    const tabs = [
      loc.instructionsTab,
      loc.targetRevenueTab,
      loc.targetExpenseTab,
      loc.workforceTab,
      loc.productRevenueTab,
      loc.sensitivityAnalysisTab,
      loc.pipelineTab,
      loc.travelTab,
      loc.capitalTab,
      loc.expensesTab,
      loc.variancesTab,
      loc.reviewTab
    ];
    
    const tabNames = [];
    for (const tabLocator of tabs) {
      await tabLocator(this.page).waitFor({ state: 'visible', timeout: 15000 });
      const name = await tabLocator(this.page).textContent();
      tabNames.push(name.trim());
    }
    return tabNames;
  }

  async isTabHighlighted(tabLocator) {
    await tabLocator(this.page).waitFor({ state: 'visible', timeout: 15000 });
    const ariaSelected = await tabLocator(this.page).getAttribute('aria-selected');
    return ariaSelected === 'true';
  }

  async clickTab(tabLocator) {
    await tabLocator(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await tabLocator(this.page).click();
    await this.page.waitForTimeout(1000);
  }

  async resizeBrowserWindow(width, height) {
    await this.page.setViewportSize({ width, height });
  }

  async isLeftScrollArrowDisabled() {
    await loc.leftScrollArrow(this.page).waitFor({ state: 'visible', timeout: 15000 });
    const disabled = await loc.leftScrollArrow(this.page).getAttribute('aria-disabled');
    return disabled === 'true' || await loc.leftScrollArrow(this.page).isDisabled();
  }

  async isRightScrollArrowVisible() {
    try {
      await loc.rightScrollArrow(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async clickRightScrollArrow() {
    await loc.rightScrollArrow(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.rightScrollArrow(this.page).click();
    await this.page.waitForTimeout(500);
  }

  async clickLeftScrollArrow() {
    await loc.leftScrollArrow(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.leftScrollArrow(this.page).click();
    await this.page.waitForTimeout(500);
  }

  async getDepartmentContext() {
    await loc.departmentContext(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.departmentContext(this.page).textContent();
  }

  async getTimePeriodContext() {
    await loc.timePeriodContext(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.timePeriodContext(this.page).textContent();
  }

  async getCurrencyContext() {
    await loc.currencyContext(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.currencyContext(this.page).textContent();
  }

  async getPlanVersionContext() {
    await loc.planVersionContext(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.planVersionContext(this.page).textContent();
  }

  async isBudgetInputSheetVisible() {
    try {
      await loc.budgetInputSheet(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = BudgetSalesPage;