const loc = require('./locators/adaptive-budget-header.locators');
const TD = require('../data/adaptive-test-data');

class AdaptiveBudgetHeaderPage {
  constructor(page) {
    this.page = page;
  }

  async getPageTitle() {
    return await loc.pageTitle(this.page).textContent();
  }

  async getDepartmentContext() {
    const element = loc.departmentContext(this.page);
    return await element.textContent() || await element.inputValue();
  }

  async getTimePeriodContext() {
    const element = loc.timePeriodContext(this.page);
    return await element.textContent() || await element.inputValue();
  }

  async getCurrencyContext() {
    const element = loc.currencyContext(this.page);
    return await element.textContent() || await element.inputValue();
  }

  async getPlanVersionContext() {
    const element = loc.planVersionContext(this.page);
    return await element.textContent() || await element.inputValue();
  }

  async verifyContext(department, timePeriod, currency, planVersion) {
    const contexts = {
      department: await this.getDepartmentContext(),
      timePeriod: await this.getTimePeriodContext(),
      currency: await this.getCurrencyContext(),
      planVersion: await this.getPlanVersionContext()
    };
    return contexts;
  }
}

module.exports = AdaptiveBudgetHeaderPage;