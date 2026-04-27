// Locators for Adaptive Planning Budget Entry - Sales Page
module.exports = {
  // Login Page Locators
  usernameInput: 'input[name="username"], input[type="email"], #username',
  passwordInput: 'input[name="password"], input[type="password"], #password',
  loginButton: 'button[type="submit"], button:has-text("Login"), button:has-text("Sign In")',
  
  // Navigation Locators
  sidebar: '[role="navigation"], .sidebar, nav',
  sheetsMenu: 'a:has-text("Sheets"), button:has-text("Sheets")',
  budgetEntryLink: 'a:has-text("Budget Entry"), a:has-text("Budget Entry - Sales")',
  
  // Tab Bar Locators
  tabBar: '[role="tablist"], .tab-bar, .tabs-container',
  instructionsTab: '[role="tab"]:has-text("Instructions"), button:has-text("Instructions")',
  targetRevenueTab: '[role="tab"]:has-text("Target Revenue"), button:has-text("Target Revenue")',
  targetExpenseTab: '[role="tab"]:has-text("Target Expense"), button:has-text("Target Expense")',
  workforceTab: '[role="tab"]:has-text("Workforce"), button:has-text("Workforce")',
  productRevenueTab: '[role="tab"]:has-text("Product Revenue"), button:has-text("Product Revenue")',
  sensitivityAnalysisTab: '[role="tab"]:has-text("Sensitivity Analysis"), button:has-text("Sensitivity Analysis")',
  pipelineTab: '[role="tab"]:has-text("Pipeline"), button:has-text("Pipeline")',
  travelTab: '[role="tab"]:has-text("Travel"), button:has-text("Travel")',
  capitalTab: '[role="tab"]:has-text("Capital"), button:has-text("Capital")',
  expensesTab: '[role="tab"]:has-text("Expenses"), button:has-text("Expenses")',
  variancesTab: '[role="tab"]:has-text("Variances"), button:has-text("Variances")',
  reviewTab: '[role="tab"]:has-text("Review"), button:has-text("Review")',
  
  // Active Tab Indicator
  activeTab: '[role="tab"][aria-selected="true"], .tab.active, .tab-active',
  
  // Scroll Arrows
  leftScrollArrow: 'button[aria-label*="scroll left"], button.scroll-left, button:has-text("‹")',
  rightScrollArrow: 'button[aria-label*="scroll right"], button.scroll-right, button:has-text("›")',
  disabledScrollArrow: 'button[disabled], button[aria-disabled="true"], .disabled',
  
  // Content Areas
  instructionsContent: '.instructions-content, [data-tab-content="instructions"]',
  budgetSheet: '.budget-sheet, .planning-sheet, [role="grid"]',
  planningView: '.planning-view, .analysis-view',
  costPlanningSheet: '.cost-planning-sheet, .expense-sheet',
  summaryView: '.summary-view, .review-content',
  
  // Context Display
  departmentContext: '.department-context, [data-context="department"]',
  timePeriodContext: '.time-period-context, [data-context="time-period"]',
  currencyContext: '.currency-context, [data-context="currency"]',
  planVersionContext: '.plan-version-context, [data-context="plan-version"]',
  
  // Toolbar
  backButton: 'button[aria-label="Back"], button:has-text("Back"), .back-button',
  
  // Page Title
  pageTitle: 'h1, .page-title, [role="heading"]'
};