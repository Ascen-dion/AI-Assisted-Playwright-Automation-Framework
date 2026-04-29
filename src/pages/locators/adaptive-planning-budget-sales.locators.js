/**
 * Locators for Adaptive Planning Budget Entry - Sales Page
 * Following framework pattern: locators return page.locator() functions
 */

const locators = {
  // Login Page Locators
  usernameInput: (page) => page.locator('input[name="username"], input[type="email"], #username').first(),
  passwordInput: (page) => page.locator('input[name="password"], input[type="password"], #password').first(),
  loginButton: (page) => page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first(),

  // Dashboard/Home Page Locators
  dashboardContainer: (page) => page.locator('[data-testid="dashboard"], .dashboard, #dashboard').first(),
  homePageTitle: (page) => page.locator('h1, .page-title').first(),

  // Navigation Locators
  sidebar: (page) => page.locator('[data-testid="sidebar"], .sidebar, nav.sidebar').first(),
  sheetsMenu: (page) => page.locator('a:has-text("Sheets"), button:has-text("Sheets"), [data-testid="sheets-menu"]').first(),
  budgetEntrySalesLink: (page) => page.locator('a:has-text("Budget Entry - Sales"), [data-testid="budget-entry-sales"]').first(),

  // Tab Navigation Locators
  tabContainer: (page) => page.locator('[role="tablist"], .tabs-container, .tab-navigation').first(),
  instructionsTab: (page) => page.locator('[role="tab"]:has-text("Instructions"), button:has-text("Instructions"), a:has-text("Instructions")').first(),
  targetRevenueTab: (page) => page.locator('[role="tab"]:has-text("Target Revenue"), button:has-text("Target Revenue"), a:has-text("Target Revenue")').first(),
  targetExpenseTab: (page) => page.locator('[role="tab"]:has-text("Target Expense"), button:has-text("Target Expense"), a:has-text("Target Expense")').first(),
  workforceTab: (page) => page.locator('[role="tab"]:has-text("Workforce"), button:has-text("Workforce"), a:has-text("Workforce")').first(),
  productRevenueTab: (page) => page.locator('[role="tab"]:has-text("Product Revenue"), button:has-text("Product Revenue"), a:has-text("Product Revenue")').first(),
  sensitivityAnalysisTab: (page) => page.locator('[role="tab"]:has-text("Sensitivity Analysis"), button:has-text("Sensitivity Analysis"), a:has-text("Sensitivity Analysis")').first(),
  pipelineTab: (page) => page.locator('[role="tab"]:has-text("Pipeline"), button:has-text("Pipeline"), a:has-text("Pipeline")').first(),
  travelTab: (page) => page.locator('[role="tab"]:has-text("Travel"), button:has-text("Travel"), a:has-text("Travel")').first(),
  capitalTab: (page) => page.locator('[role="tab"]:has-text("Capital"), button:has-text("Capital"), a:has-text("Capital")').first(),
  expensesTab: (page) => page.locator('[role="tab"]:has-text("Expenses"), button:has-text("Expenses"), a:has-text("Expenses")').first(),
  variancesTab: (page) => page.locator('[role="tab"]:has-text("Variances"), button:has-text("Variances"), a:has-text("Variances")').first(),
  reviewTab: (page) => page.locator('[role="tab"]:has-text("Review"), button:has-text("Review"), a:has-text("Review")').first(),

  // Active Tab Indicator
  activeTab: (page) => page.locator('[role="tab"][aria-selected="true"], .tab.active, .tab-active').first(),
  
  // Tab Content Areas
  instructionsContent: (page) => page.locator('[role="tabpanel"]:has-text("Instructions"), .instructions-content, #instructions-panel').first(),
  targetRevenueContent: (page) => page.locator('[role="tabpanel"], .target-revenue-content, #target-revenue-panel').first(),
  workforceContent: (page) => page.locator('[role="tabpanel"], .workforce-content, #workforce-panel').first(),
  pipelineContent: (page) => page.locator('[role="tabpanel"], .pipeline-content, #pipeline-panel').first(),
  reviewContent: (page) => page.locator('[role="tabpanel"], .review-content, #review-panel').first(),

  // Tab Scroll Arrows
  leftScrollArrow: (page) => page.locator('button[aria-label*="scroll left"], button.tab-scroll-left, .scroll-arrow-left').first(),
  rightScrollArrow: (page) => page.locator('button[aria-label*="scroll right"], button.tab-scroll-right, .scroll-arrow-right').first(),

  // Context/Filter Locators
  departmentContext: (page) => page.locator('[data-testid="department-context"], .department-selector, select[name="department"]').first(),
  timePeriodContext: (page) => page.locator('[data-testid="time-period-context"], .time-period-selector, select[name="timePeriod"]').first(),
  currencyContext: (page) => page.locator('[data-testid="currency-context"], .currency-selector, select[name="currency"]').first(),
  planVersionContext: (page) => page.locator('[data-testid="plan-version-context"], .plan-version-selector, select[name="planVersion"]').first(),

  // Budget Input Sheet Locators
  budgetInputSheet: (page) => page.locator('[data-testid="budget-sheet"], .planning-grid, .budget-input-sheet').first(),
  sheetGrid: (page) => page.locator('.grid-container, [role="grid"], table.planning-sheet').first(),

  // Page Title
  pageTitle: (page) => page.locator('h1.page-title, .page-header h1, [data-testid="page-title"]').first(),

  // Generic Tab Locator by Text
  tabByText: (page, tabText) => page.locator(`[role="tab"]:has-text("${tabText}"), button:has-text("${tabText}"), a:has-text("${tabText}")`).first()
};

module.exports = locators;