const loc = require('./locators/adaptive-budget-header.locators');

class AdaptiveBudgetHeaderPage {
  constructor(page) {
    this.page = page;
  }

  async selectDepartment(department) {
    await loc.levelSelector(this.page).click();
    await this.page.getByText(department, { exact: true }).click();
  }

  async selectTimePeriod(timePeriod) {
    await loc.timeSelector(this.page).click();
    await this.page.getByText(timePeriod, { exact: true }).click();
  }

  async selectCurrency(currency) {
    await loc.currencySelector(this.page).click();
    await this.page.getByText(currency, { exact: true }).click();
  }

  async selectPlanVersion(version) {
    await loc.versionButton(this.page).click();
    await this.page.getByText(version, { exact: true }).click();
  }

  async getPageTitle() {
    return await loc.pageTitle(this.page).textContent();
  }

  getPageTitleElement() {
    return loc.pageTitle(this.page);
  }

  getVersionButton() {
    return loc.versionButton(this.page);
  }

  getTimeSelector() {
    return loc.timeSelector(this.page);
  }

  getLevelSelector() {
    return loc.levelSelector(this.page);
  }

  getCurrencySelector() {
    return loc.currencySelector(this.page);
  }
}

module.exports = AdaptiveBudgetHeaderPage;