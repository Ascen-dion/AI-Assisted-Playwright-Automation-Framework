const locators = {
  tabStrip: (page) => page.locator('.tab-strip-wrap').first(),
  tabContainer: (page) => page.locator('.tab-container').first(),
  tabList: (page) => page.locator('[role="tablist"]').first(),
  allTabs: (page) => page.locator('[role="tab"]'),
  tab: (page, tabName) => page.locator(`[role="tab"][name="${tabName}"]`).first(),
  activeTab: (page) => page.locator('[role="tab"][aria-selected="true"]').first(),
  scrollLeft: (page) => page.locator('button[aria-label="Scroll left"]').first(),
  scrollRight: (page) => page.locator('button[aria-label="Scroll right"]').first(),
  tabContent: (page) => page.locator('.tab-content').first(),
  instructionsTab: (page) => page.getByRole('tab', { name: 'Instructions', exact: true }).first(),
  targetRevenueTab: (page) => page.getByRole('tab', { name: 'Target Revenue', exact: true }).first(),
  targetExpenseTab: (page) => page.getByRole('tab', { name: 'Target Expense', exact: true }).first(),
  workforceTab: (page) => page.getByRole('tab', { name: 'Workforce', exact: true }).first(),
  productRevenueTab: (page) => page.getByRole('tab', { name: 'Product Revenue', exact: true }).first(),
  sensitivityAnalysisTab: (page) => page.getByRole('tab', { name: 'Sensitivity Analysis', exact: true }).first(),
  pipelineTab: (page) => page.getByRole('tab', { name: 'Pipeline', exact: true }).first(),
  travelTab: (page) => page.getByRole('tab', { name: 'Travel', exact: true }).first(),
  capitalTab: (page) => page.getByRole('tab', { name: 'Capital', exact: true }).first(),
  expensesTab: (page) => page.getByRole('tab', { name: 'Expenses', exact: true }).first(),
  variancesTab: (page) => page.getByRole('tab', { name: 'Variances', exact: true }).first(),
  reviewTab: (page) => page.getByRole('tab', { name: 'Review', exact: true }).first()
};

module.exports = locators;