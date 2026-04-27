/**
 * Budget Tabs Page Locators
 * Locators for Budget Entry - Sales page tab navigation
 */

const budgetTabsLocators = {
  tabStrip: (page) => page.locator('.tab-strip-wrap'),
  tabContainer: (page) => page.locator('.tab-container'),
  tabList: (page) => page.locator('[role="tablist"]'),
  allTabs: (page) => page.locator('[role="tab"]'),
  tab: (page, name) => page.locator(`role=tab[name='${name}'][exact=true]`),
  activeTab: (page) => page.locator('[role="tab"][aria-selected="true"]'),
  scrollLeft: (page) => page.locator('button[aria-label="Scroll left"]'),
  scrollRight: (page) => page.locator('button[aria-label="Scroll right"]'),
  tabContent: (page) => page.locator('.tab-content')
};

module.exports = budgetTabsLocators;