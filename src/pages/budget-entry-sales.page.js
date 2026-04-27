const { expect } = require('@playwright/test');
const TD = require('../data/workday-test-data');

class BudgetEntrySalesPage {
  constructor(page) {
    this.page = page;
    
    // Tab locators
    this.locators = {
      // Tab navigation
      instructionsTab: page.locator('[data-testid="tab-instructions"], button:has-text("Instructions"), a:has-text("Instructions")').first(),
      targetRevenueTab: page.locator('[data-testid="tab-target-revenue"], button:has-text("Target Revenue"), a:has-text("Target Revenue")').first(),
      targetExpenseTab: page.locator('[data-testid="tab-target-expense"], button:has-text("Target Expense"), a:has-text("Target Expense")').first(),
      workforceTab: page.locator('[data-testid="tab-workforce"], button:has-text("Workforce"), a:has-text("Workforce")').first(),
      productRevenueTab: page.locator('[data-testid="tab-product-revenue"], button:has-text("Product Revenue"), a:has-text("Product Revenue")').first(),
      sensitivityAnalysisTab: page.locator('[data-testid="tab-sensitivity-analysis"], button:has-text("Sensitivity Analysis"), a:has-text("Sensitivity Analysis")').first(),
      pipelineTab: page.locator('[data-testid="tab-pipeline"], button:has-text("Pipeline"), a:has-text("Pipeline")').first(),
      travelTab: page.locator('[data-testid="tab-travel"], button:has-text("Travel"), a:has-text("Travel")').first(),
      capitalTab: page.locator('[data-testid="tab-capital"], button:has-text("Capital"), a:has-text("Capital")').first(),
      expensesTab: page.locator('[data-testid="tab-expenses"], button:has-text("Expenses"), a:has-text("Expenses")').first(),
      variancesTab: page.locator('[data-testid="tab-variances"], button:has-text("Variances"), a:has-text("Variances")').first(),
      reviewTab: page.locator('[data-testid="tab-review"], button:has-text("Review"), a:has-text("Review")').first(),
      
      // Tab content areas
      instructionsContent: page.locator('[data-testid="content-instructions"], .instructions-content, #instructions-panel').first(),
      targetRevenueContent: page.locator('[data-testid="content-target-revenue"], .target-revenue-content, #target-revenue-panel').first(),
      targetExpenseContent: page.locator('[data-testid="content-target-expense"], .target-expense-content, #target-expense-panel').first(),
      workforceContent: page.locator('[data-testid="content-workforce"], .workforce-content, #workforce-panel').first(),
      productRevenueContent: page.locator('[data-testid="content-product-revenue"], .product-revenue-content, #product-revenue-panel').first(),
      sensitivityAnalysisContent: page.locator('[data-testid="content-sensitivity-analysis"], .sensitivity-analysis-content, #sensitivity-analysis-panel').first(),
      pipelineContent: page.locator('[data-testid="content-pipeline"], .pipeline-content, #pipeline-panel').first(),
      travelContent: page.locator('[data-testid="content-travel"], .travel-content, #travel-panel').first(),
      capitalContent: page.locator('[data-testid="content-capital"], .capital-content, #capital-panel').first(),
      expensesContent: page.locator('[data-testid="content-expenses"], .expenses-content, #expenses-panel').first(),
      variancesContent: page.locator('[data-testid="content-variances"], .variances-content, #variances-panel').first(),
      reviewContent: page.locator('[data-testid="content-review"], .review-content, #review-panel').first(),
      
      // Scroll arrows
      leftScrollArrow: page.locator('[data-testid="tab-scroll-left"], button[aria-label="Scroll left"], .tab-scroll-left').first(),
      rightScrollArrow: page.locator('[data-testid="tab-scroll-right"], button[aria-label="Scroll right"], .tab-scroll-right').first(),
      
      // Content areas
      budgetInputSheet: page.locator('[data-testid="budget-input-sheet"], .budget-input-sheet, .planning-sheet').first(),
      planningView: page.locator('[data-testid="planning-view"], .planning-view, .scenario-view').first(),
      costPlanningSheet: page.locator('[data-testid="cost-planning-sheet"], .cost-planning-sheet, .expense-sheet').first(),
      summaryView: page.locator('[data-testid="summary-view"], .summary-view, .review-summary').first(),
      varianceData: page.locator('[data-testid="variance-data"], .variance-data, .variance-analysis').first(),
      budgetSummary: page.locator('[data-testid="budget-summary"], .budget-summary, .consolidated-summary').first(),
      
      // Context display
      departmentDisplay: page.locator('[data-testid="department-display"], .department-context, .context-department').first(),
      timePeriodDisplay: page.locator('[data-testid="time-period-display"], .time-period-context, .context-period').first(),
      currencyDisplay: page.locator('[data-testid="currency-display"], .currency-context, .context-currency').first(),
      planVersionDisplay: page.locator('[data-testid="plan-version-display"], .plan-version-context, .context-version').first(),
      
      // Navigation
      backButton: page.locator('[data-testid="back-button"], button[aria-label="Back"], .back-button, button:has-text("Back")').first(),
      
      // Tab container
      tabContainer: page.locator('[data-testid="tab-container"], .tab-bar, .tabs-container, [role="tablist"]').first()
    };
  }

  /**
   * Navigate to Budget Entry - Sales page
   * @param {Object} context - Optional context parameters (department, timePeriod, currency, planVersion)
   */
  async gotoBudgetEntrySales(context = null) {
    let url = TD.urls.budgetEntrySales;
    
    if (context) {
      const params = new URLSearchParams();
      if (context.department) params.append('department', context.department);
      if (context.timePeriod) params.append('period', context.timePeriod);
      if (context.currency) params.append('currency', context.currency);
      if (context.planVersion) params.append('version', context.planVersion);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
    await expect(this.locators.instructionsTab).toBeVisible();
  }

  /**
   * Click on a specific tab by name
   * @param {string} tabName - Name of the tab to click
   */
  async clickTab(tabName) {
    const tabMap = {
      'Instructions': this.locators.instructionsTab,
      'Target Revenue': this.locators.targetRevenueTab,
      'Target Expense': this.locators.targetExpenseTab,
      'Workforce': this.locators.workforceTab,
      'Product Revenue': this.locators.productRevenueTab,
      'Sensitivity Analysis': this.locators.sensitivityAnalysisTab,
      'Pipeline': this.locators.pipelineTab,
      'Travel': this.locators.travelTab,
      'Capital': this.locators.capitalTab,
      'Expenses': this.locators.expensesTab,
      'Variances': this.locators.variancesTab,
      'Review': this.locators.reviewTab
    };
    
    const tab = tabMap[tabName];
    if (!tab) {
      throw new Error(`Tab "${tabName}" not found`);
    }
    
    await tab.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get all tabs as an array of locators
   * @returns {Array} Array of tab locators
   */
  async getAllTabs() {
    const tabs = await this.locators.tabContainer.locator('button, a').all();
    return tabs;
  }

  /**
   * Verify only one tab is active/highlighted
   * @param {string} expectedActiveTab - Name of the tab that should be active
   */
  async verifyOnlyOneTabIsActive(expectedActiveTab) {
    const allTabs = [
      { name: 'Instructions', locator: this.locators.instructionsTab },
      { name: 'Target Revenue', locator: this.locators.targetRevenueTab },
      { name: 'Target Expense', locator: this.locators.targetExpenseTab },
      { name: 'Workforce', locator: this.locators.workforceTab },
      { name: 'Product Revenue', locator: this.locators.productRevenueTab },
      { name: 'Sensitivity Analysis', locator: this.locators.sensitivityAnalysisTab },
      { name: 'Pipeline', locator: this.locators.pipelineTab },
      { name: 'Travel', locator: this.locators.travelTab },
      { name: 'Capital', locator: this.locators.capitalTab },
      { name: 'Expenses', locator: this.locators.expensesTab },
      { name: 'Variances', locator: this.locators.variancesTab },
      { name: 'Review', locator: this.locators.reviewTab }
    ];
    
    for (const tab of allTabs) {
      if (tab.name === expectedActiveTab) {
        await expect(tab.locator).toHaveClass(/active|selected|highlighted/);
      } else {
        await expect(tab.locator).not.toHaveClass(/active|selected|highlighted/);
      }
    }
  }

  /**
   * Verify department context is displayed correctly
   * @param {string} department - Expected department name
   * @param {string} timePeriod - Expected time period
   * @param {string} currency - Expected currency
   * @param {string} planVersion - Expected plan version
   */
  async verifyDepartmentContext(department, timePeriod, currency, planVersion) {
    await expect(this.locators.departmentDisplay).toContainText(department);
    await expect(this.locators.timePeriodDisplay).toContainText(timePeriod);
    await expect(this.locators.currencyDisplay).toContainText(currency);
    await expect(this.locators.planVersionDisplay).toContainText(planVersion);
  }

  /**
   * Click the Back button
   */
  async clickBackButton() {
    await this.locators.backButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = BudgetEntrySalesPage;