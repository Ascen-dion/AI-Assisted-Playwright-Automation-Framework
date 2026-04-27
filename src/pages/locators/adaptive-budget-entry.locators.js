module.exports = {
  // Login Page Locators
  usernameInput: 'input[name="username"]',
  passwordInput: 'input[name="password"]',
  loginButton: 'button[type="submit"]',
  
  // Budget Entry - Sales Page Locators
  budgetEntrySalesPage: '[data-testid="budget-entry-sales"]',
  
  // Tab Bar Locators
  tabBar: '[role="tablist"]',
  instructionsTab: '[role="tab"][aria-label="Instructions"]',
  targetRevenueTab: '[role="tab"][aria-label="Target Revenue"]',
  targetExpenseTab: '[role="tab"][aria-label="Target Expense"]',
  workforceTab: '[role="tab"][aria-label="Workforce"]',
  productRevenueTab: '[role="tab"][aria-label="Product Revenue"]',
  sensitivityAnalysisTab: '[role="tab"][aria-label="Sensitivity Analysis"]',
  pipelineTab: '[role="tab"][aria-label="Pipeline"]',
  travelTab: '[role="tab"][aria-label="Travel"]',
  capitalTab: '[role="tab"][aria-label="Capital"]',
  expensesTab: '[role="tab"][aria-label="Expenses"]',
  variancesTab: '[role="tab"][aria-label="Variances"]',
  reviewTab: '[role="tab"][aria-label="Review"]',
  
  // Active Tab Indicator
  activeTab: '[role="tab"][aria-selected="true"]',
  
  // Scroll Arrows
  leftScrollArrow: '[data-testid="scroll-left"]',
  rightScrollArrow: '[data-testid="scroll-right"]',
  disabledScrollArrow: '[data-testid*="scroll"][disabled]',
  
  // Tab Content Areas
  instructionsContent: '[data-testid="instructions-content"]',
  targetRevenueContent: '[data-testid="target-revenue-content"]',
  targetExpenseContent: '[data-testid="target-expense-content"]',
  workforceContent: '[data-testid="workforce-content"]',
  productRevenueContent: '[data-testid="product-revenue-content"]',
  sensitivityAnalysisContent: '[data-testid="sensitivity-analysis-content"]',
  pipelineContent: '[data-testid="pipeline-content"]',
  travelContent: '[data-testid="travel-content"]',
  capitalContent: '[data-testid="capital-content"]',
  expensesContent: '[data-testid="expenses-content"]',
  variancesContent: '[data-testid="variances-content"]',
  reviewContent: '[data-testid="review-content"]',
  
  // Budget Input Sheet Elements
  budgetInputSheet: '[data-testid="budget-input-sheet"]',
  departmentContext: '[data-testid="department-context"]',
  timePeriodContext: '[data-testid="time-period-context"]',
  currencyContext: '[data-testid="currency-context"]',
  planVersionContext: '[data-testid="plan-version-context"]',
  
  // Planning View Elements
  planningView: '[data-testid="planning-view"]',
  modelingTools: '[data-testid="modeling-tools"]',
  pipelineData: '[data-testid="pipeline-data"]',
  
  // Cost Planning Sheet Elements
  costPlanningSheet: '[data-testid="cost-planning-sheet"]',
  expenseFields: '[data-testid="expense-fields"]',
  
  // Summary View Elements
  summaryView: '[data-testid="summary-view"]',
  varianceAnalysis: '[data-testid="variance-analysis"]',
  consolidatedBudgetInfo: '[data-testid="consolidated-budget-info"]',
  
  // Toolbar Elements
  backButton: '[data-testid="back-button"]',
  
  // Home/Dashboard
  homePage: '[data-testid="home-page"]',
  dashboard: '[data-testid="dashboard"]'
};