/**
 * Locators for Adaptive Planning Budget Tabs
 * Following framework convention: locators return Playwright locator functions
 */

const locators = {
  tabStrip: (page) => page.locator('.tab-strip-wrap'),
  tabContainer: (page) => page.locator('.tab-container'),
  tabList: (page) => page.locator('[role="tablist"]'),
  allTabs: (page) => page.locator('[role="tab"]'),
  tab: (page, name) => page.getByRole('tab', { name: name, exact: true }),
  activeTab: (page) => page.locator('[role="tab"][aria-selected="true"]'),
  scrollLeft: (page) => page.locator('button[aria-label="Scroll left"]'),
  scrollRight: (page) => page.locator('button[aria-label="Scroll right"]'),
  tabContent: (page) => page.locator('.tab-content')
};

module.exports = locators;