const locators = {
  // Login page locators
  usernameInput: (page) => page.locator('input[name="username"], input[type="email"], #username').first(),
  passwordInput: (page) => page.locator('input[name="password"], input[type="password"], #password').first(),
  loginButton: (page) => page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first(),
  
  // Dashboard/Home page locators
  dashboardContainer: (page) => page.locator('[data-testid="dashboard"], .dashboard, #dashboard').first(),
  
  // Navigation to Budget Entry - Sales
  sheetsMenu: (page) => page.locator('a:has-text("Sheets"), button:has-text("Sheets"), [aria-label="Sheets"]').first(),
  budgetEntrySalesLink: (page) => page.locator('a:has-text("Budget Entry - Sales"), [data-testid="budget-entry-sales"]').first(),
  
  // Tab navigation locators
  instructionsTab: (page) => page.locator('[role="tab"]:has-text("Instructions"), a:has-text("Instructions"), button:has-text("Instructions")').first(),
  targetRevenueTab: (page) => page.locator('[role="tab"]:has-text("Target Revenue"), a:has-text("Target Revenue"), button:has-text("Target Revenue")').first(),
  targetExpenseTab: (page) => page.locator('[role="tab"]:has-text("Target Expense"), a:has-text("Target Expense"), button:has-text("Target Expense")').first(),
  workforceTab: (page) => page.locator('[role="tab"]:has-text("Workforce"), a:has-text("Workforce"), button:has-text("Workforce")').first(),
  productRevenueTab: (page) => page.locator('[role="tab"]:has-text("Product Revenue"), a:has-text("Product Revenue"), button:has-text("Product Revenue")').first(),
  sensitivityAnalysisTab: (page) => page.locator('[role="tab"]:has-text("Sensitivity Analysis"), a:has-text("Sensitivity Analysis"), button:has-text("Sensitivity Analysis")').first(),
  pipelineTab: (page) => page.locator('[role="tab"]:has-text("Pipeline"), a:has-text("Pipeline"), button:has-text("Pipeline")').first(),
  travelTab: (page) => page.locator('[role="tab"]:has-text("Travel"), a:has-text("Travel"), button:has-text("Travel")').first(),
  capitalTab: (page) => page.locator('[role="tab"]:has-text("Capital"), a:has-text("Capital"), button:has-text("Capital")').first(),
  expensesTab: (page) => page.locator('[role="tab"]:has-text("Expenses"), a:has-text("Expenses"), button:has-text("Expenses")').first(),
  variancesTab: (page) => page.locator('[role="tab"]:has-text("Variances"), a:has-text("Variances"), button:has-text("Variances")').first(),
  reviewTab: (page) => page.locator('[role="tab"]:has-text("Review"), a:has-text("Review"), button:has-text("Review")').first(),
  
  // Active tab indicator
  activeTab: (page) => page.locator('[role="tab"][aria-selected="true"], .active-tab, [class*="active"][role="tab"]').first(),
  allTabs: (page) => page.locator('[role="tab"], .tab, [class*="tab-item"]'),
  
  // Tab scroll arrows
  leftScrollArrow: (page) => page.locator('[aria-label="Scroll left"], button[class*="scroll-left"], button:has-text("‹")').first(),
  rightScrollArrow: (page) => page.locator('[aria-label="Scroll right"], button[class*="scroll-right"], button:has-text("›")').first(),
  
  // Content areas
  instructionsContent: (page) => page.locator('[data-testid="instructions-content"], .instructions-section, #instructions').first(),
  targetRevenueSheet: (page) => page.locator('[data-testid="target-revenue-sheet"], .budget-sheet, .planning-sheet').first(),
  
  // Context selectors
  departmentContext: (page) => page.locator('[data-testid="department-context"], .context-department, [aria-label*="Department"]').first(),
  timePeriodContext: (page) => page.locator('[data-testid="time-period-context"], .context-period, [aria-label*="Time Period"]').first(),
  currencyContext: (page) => page.locator('[data-testid="currency-context"], .context-currency, [aria-label*="Currency"]').first(),
  planVersionContext: (page) => page.locator('[data-testid="plan-version-context"], .context-version, [aria-label*="Version"]').first(),
  
  // Page title
  pageTitle: (page) => page.locator('h1, .page-title, [data-testid="page-title"]').first()
};

module.exports = locators;