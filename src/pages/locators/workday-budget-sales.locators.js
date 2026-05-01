const locators = {
  usernameInput: (page) => page.locator('#username').first(),
  passwordInput: (page) => page.locator('#password').first(),
  loginButton: (page) => page.locator('button[type="submit"]').first(),
  budgetEntrySalesMenu: (page) => page.locator('text=Budget Entry - Sales').first(),
  instructionsTab: (page) => page.locator('[role="tab"][aria-label="Instructions"]').first(),
  targetRevenueTab: (page) => page.locator('[role="tab"][aria-label="Target Revenue"]').first(),
  targetExpenseTab: (page) => page.locator('[role="tab"][aria-label="Target Expense"]').first(),
  workforceTab: (page) => page.locator('[role="tab"][aria-label="Workforce"]').first(),
  productRevenueTab: (page) => page.locator('[role="tab"][aria-label="Product Revenue"]').first(),
  sensitivityAnalysisTab: (page) => page.locator('[role="tab"][aria-label="Sensitivity Analysis"]').first(),
  pipelineTab: (page) => page.locator('[role="tab"][aria-label="Pipeline"]').first(),
  travelTab: (page) => page.locator('[role="tab"][aria-label="Travel"]').first(),
  capitalTab: (page) => page.locator('[role="tab"][aria-label="Capital"]').first(),
  expensesTab: (page) => page.locator('[role="tab"][aria-label="Expenses"]').first(),
  variancesTab: (page) => page.locator('[role="tab"][aria-label="Variances"]').first(),
  reviewTab: (page) => page.locator('[role="tab"][aria-label="Review"]').first(),
  activeTab: (page) => page.locator('[role="tab"][aria-selected="true"]').first(),
  instructionsContent: (page) => page.locator('[role="tabpanel"] >> text=budget guidelines').first(),
  leftScrollArrow: (page) => page.locator('[aria-label="Scroll tabs left"]').first(),
  rightScrollArrow: (page) => page.locator('[aria-label="Scroll tabs right"]').first(),
  departmentContext: (page) => page.locator('[data-context="department"]').first(),
  timePeriodContext: (page) => page.locator('[data-context="timeperiod"]').first(),
  currencyContext: (page) => page.locator('[data-context="currency"]').first(),
  planVersionContext: (page) => page.locator('[data-context="planversion"]').first(),
  budgetInputSheet: (page) => page.locator('[role="grid"][aria-label*="budget"]').first()
};

module.exports = locators;