const locators = {
  pageTitle: (page) => page.locator('.perspective-title').first(),
  versionButton: (page) => page.locator('button:has-text("Working Budget")').first(),
  timeSelector: (page) => page.locator('text=Time').locator('..').locator('button, select, input').first(),
  levelSelector: (page) => page.locator('text=Level').locator('..').locator('button, select, input').first(),
  currencySelector: (page) => page.locator('text=Currency').locator('..').locator('button, select, input').first(),
  departmentContext: (page) => page.locator('text=Department').locator('..').locator('button, select, input, span').first(),
  timePeriodContext: (page) => page.locator('text=Time Period').locator('..').locator('button, select, input, span').first(),
  currencyContext: (page) => page.locator('text=Currency').locator('..').locator('button, select, input, span').first(),
  planVersionContext: (page) => page.locator('text=Plan Version').locator('..').locator('button, select, input, span').first()
};

module.exports = locators;