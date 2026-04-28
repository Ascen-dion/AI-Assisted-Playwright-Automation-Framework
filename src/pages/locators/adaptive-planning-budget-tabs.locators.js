const locators = {
  tabStrip: (page) => page.locator('.tab-strip-wrap').first(),
  tabContainer: (page) => page.locator('.tab-container').first(),
  tabList: (page) => page.locator('[role="tablist"]').first(),
  allTabs: (page) => page.locator('[role="tab"]'),
  getTabByName: (page, name) => page.getByRole('tab', { name: name, exact: true }),
  activeTab: (page) => page.locator('[role="tab"][aria-selected="true"]').first(),
  scrollLeftButton: (page) => page.locator('button[aria-label="Scroll left"]').first(),
  scrollRightButton: (page) => page.locator('button[aria-label="Scroll right"]').first(),
  tabContent: (page) => page.locator('.tab-content').first(),
  instructionsTab: (page) => page.getByRole('tab', { name: 'Instructions', exact: true }),
  targetRevenueTab: (page) => page.getByRole('tab', { name: 'Target Revenue', exact: true }),
  targetExpenseTab: (page) => page.getByRole('tab', { name: 'Target Expense', exact: true }),
  workforceTab: (page) => page.getByRole('tab', { name: 'Workforce', exact: true }),
  productRevenueTab: (page) => page.getByRole('tab', { name: 'Product Revenue', exact: true }),
  sensitivityAnalysisTab: (page) => page.getByRole('tab', { name: 'Sensitivity Analysis', exact: true }),
  pipelineTab: (page) => page.getByRole('tab', { name: 'Pipeline', exact: true }),
  travelTab: (page) => page.getByRole('tab', { name: 'Travel', exact: true }),
  capitalTab: (page) => page.getByRole('tab', { name: 'Capital', exact: true }),
  expensesTab: (page) => page.getByRole('tab', { name: 'Expenses', exact: true }),
  variancesTab: (page) => page.getByRole('tab', { name: 'Variances', exact: true }),
  reviewTab: (page) => page.getByRole('tab', { name: 'Review', exact: true })
};

module.exports = locators;