/**
 * Locators for Workday Adaptive Planning Budget Tabs
 * @module workday-budget-tabs.locators
 */

const budgetTabsLocators = {
  tabStrip: (page) => page.locator('.tab-strip-wrap').first(),
  tabContainer: (page) => page.locator('.tab-container').first(),
  tabList: (page) => page.locator('[role="tablist"]').first(),
  allTabs: (page) => page.locator('[role="tab"]'),
  tab: (page, name) => page.getByRole('tab', { name: name, exact: true }),
  activeTab: (page) => page.locator('[role="tab"][aria-selected="true"]').first(),
  scrollLeft: (page) => page.locator('button[aria-label="Scroll left"]').first(),
  scrollRight: (page) => page.locator('button[aria-label="Scroll right"]').first(),
  tabContent: (page) => page.locator('.tab-content').first()
};

module.exports = budgetTabsLocators;