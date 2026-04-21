// === FILE: src/pages/workday-finance.page.js ===
/**
 * WorkdayFinancePage — Page object for Workday Finance module (Capital One demo).
 *
 * Covers: Journal Entry, Supplier Invoice, Budget vs Actual, GL Balance Report.
 * Extends BasePage for standard goto/navigation behaviour.
 *
 * No assertions inside this class — all assertions belong in spec files.
 */

const BasePage = require('./base.page');
const loc = require('./locators/workday-finance.locators');
const TD = require('../data/workday-test-data');

class WorkdayFinancePage extends BasePage {

  // ── Navigation ─────────────────────────────────────────────────────────────

  async gotoLogin() {
    await super.goto(TD.urls.login);
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  async gotoHome() {
    await super.goto(TD.urls.home);
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  async gotoCreateJournalEntry() {
    await super.goto(TD.urls.createJournalEntry);
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  async gotoManageJournalEntries() {
    await super.goto(TD.urls.manageJournalEntries);
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  async gotoCreateSupplierInvoice() {
    await super.goto(TD.urls.createSupplierInvoice);
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  async gotoBudgetVsActual() {
    await super.goto(TD.urls.budgetVsActual);
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  async gotoGLBalanceReport() {
    await super.goto(TD.urls.glBalanceReport);
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  async gotoPayrollResults() {
    await super.goto(TD.urls.viewPayrollResults);
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  async gotoJobSearch() {
    await super.goto(TD.urls.careersHome);
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  // ── Job Search ─────────────────────────────────────────────────────────────

  async searchJobsAndGetCount(keyword) {
    await loc.jobSearch.searchInput(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.jobSearch.searchInput(this.page).fill(keyword);
    await loc.jobSearch.searchButton(this.page).click();
    await loc.jobSearch.jobFoundText(this.page).waitFor({ state: 'visible', timeout: 15000 });
    // Wait until the element text is no longer the transient "Loading" state
    await this.page.waitForFunction(
      () => {
        const el = document.querySelector('[data-automation-id="jobFoundText"]');
        return el && el.textContent && !el.textContent.includes('Loading');
      },
      { timeout: 30000 }
    );
    return (await loc.jobSearch.jobFoundText(this.page).textContent()).trim();
  }

  // ── Login ──────────────────────────────────────────────────────────────────

  async login(username, password) {
    await loc.login.usernameInput(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.login.usernameInput(this.page).fill(username);
    await loc.login.passwordInput(this.page).fill(password);
    await loc.login.signInButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  async isLoginErrorVisible() {
    await loc.login.errorMessage(this.page).waitFor({ state: 'visible', timeout: 5000 });
    return await loc.login.errorMessage(this.page).isVisible();
  }

  // ── Global Search Navigation ───────────────────────────────────────────────

  async searchAndNavigate(searchTerm) {
    await loc.nav.searchInput(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.nav.searchInput(this.page).fill(searchTerm);
    await loc.nav.searchOption(this.page).waitFor({ state: 'visible', timeout: 10000 });
    await loc.nav.searchOption(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  // ── Journal Entry Actions ──────────────────────────────────────────────────

  async setAccountingDate(dateString) {
    await loc.journalEntry.accountingDate(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.journalEntry.accountingDate(this.page).fill(dateString);
  }

  async setMemo(memoText) {
    await loc.journalEntry.memoField(this.page).fill(memoText);
  }

  async setJournalSource(source) {
    await loc.journalEntry.journalSource(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.journalEntry.journalSource(this.page).fill(source);
    await loc.shared.typeaheadOption(this.page, source).click();
  }

  async addJournalLine(ledgerCode, debitAmount, creditAmount, costCentre, lineIndex = 0) {
    if (lineIndex > 0) {
      await loc.journalEntry.addRowButton(this.page).click();
      await this.page.waitForTimeout(500); // allow row to render
    }
    await loc.journalEntry.ledgerAccountNth(this.page, lineIndex).fill(ledgerCode);
    await loc.shared.typeaheadOption(this.page, ledgerCode).click();
    if (debitAmount) {
      await loc.journalEntry.debitAmountNth(this.page, lineIndex).fill(debitAmount);
    }
    if (creditAmount) {
      await loc.journalEntry.creditAmountNth(this.page, lineIndex).fill(creditAmount);
    }
    if (costCentre) {
      await loc.journalEntry.costCentreField(this.page).fill(costCentre);
      await loc.shared.typeaheadOption(this.page, costCentre).click();
    }
  }

  async clickPost() {
    await loc.journalEntry.postButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.journalEntry.postButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async clickSaveForLater() {
    await loc.journalEntry.saveButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async clickSubmit() {
    await loc.journalEntry.submitButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async getJournalEntryStatus() {
    await loc.journalEntry.journalStatus(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.journalEntry.journalStatus(this.page).textContent();
  }

  async isOutOfBalanceMessageVisible() {
    return await loc.journalEntry.outOfBalanceMsg(this.page).isVisible();
  }

  async getValidationError() {
    await loc.journalEntry.validationError(this.page).waitFor({ state: 'visible', timeout: 10000 });
    return await loc.journalEntry.validationError(this.page).textContent();
  }

  async getInlineError() {
    await loc.journalEntry.inlineError(this.page).waitFor({ state: 'visible', timeout: 10000 });
    return await loc.journalEntry.inlineError(this.page).textContent();
  }

  async clickReverse() {
    await loc.journalEntry.reverseButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.journalEntry.reverseButton(this.page).click();
    await loc.shared.confirmButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  // ── Supplier Invoice Actions ───────────────────────────────────────────────

  async fillSupplierInvoice({ invoiceNumber, supplier, invoiceDate, amount }) {
    await loc.supplierInvoice.invoiceNumber(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.supplierInvoice.invoiceNumber(this.page).fill(invoiceNumber);
    await loc.supplierInvoice.supplierField(this.page).fill(supplier);
    await loc.shared.typeaheadOption(this.page, supplier).click();
    await loc.supplierInvoice.invoiceDate(this.page).fill(invoiceDate);
    await loc.supplierInvoice.lineAmount(this.page).fill(amount);
  }

  async submitInvoice() {
    await loc.supplierInvoice.submitButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async getInvoiceStatus() {
    await loc.supplierInvoice.invoiceStatus(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.supplierInvoice.invoiceStatus(this.page).textContent();
  }

  async isDuplicateInvoiceWarningVisible() {
    return await loc.supplierInvoice.duplicateWarning(this.page).isVisible();
  }

  // ── Budget Report Actions ─────────────────────────────────────────────────

  async runBudgetVsActualReport({ company, fiscalYear, costCentre }) {
    await loc.budgetReport.companyFilter(this.page).waitFor({ state: 'visible', timeout: 15000 });
    if (company) {
      await loc.budgetReport.companyFilter(this.page).fill(company);
      await loc.shared.typeaheadOption(this.page, company).click();
    }
    if (fiscalYear) {
      await loc.budgetReport.fiscalYearFilter(this.page).fill(fiscalYear);
      await loc.shared.typeaheadOption(this.page, fiscalYear).click();
    }
    if (costCentre) {
      await loc.budgetReport.costCentreFilter(this.page).fill(costCentre);
      await loc.shared.typeaheadOption(this.page, costCentre).click();
    }
    await loc.budgetReport.runReportButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  async isBudgetReportGridVisible() {
    await loc.budgetReport.reportGrid(this.page).waitFor({ state: 'visible', timeout: 20000 });
    return await loc.budgetReport.reportGrid(this.page).isVisible();
  }

  async getBudgetVarianceText() {
    await loc.budgetReport.varianceColumn(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.budgetReport.varianceColumn(this.page).textContent();
  }

  // ── GL Report Actions ─────────────────────────────────────────────────────

  async runGLReport({ glAccount, period }) {
    await loc.glReport.glAccountFilter(this.page).waitFor({ state: 'visible', timeout: 15000 });
    if (glAccount) {
      await loc.glReport.glAccountFilter(this.page).fill(glAccount);
      await loc.shared.typeaheadOption(this.page, glAccount).click();
    }
    if (period) {
      await loc.glReport.periodFilter(this.page).fill(period);
      await loc.shared.typeaheadOption(this.page, period).click();
    }
    await loc.glReport.runReportButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  async isTransactionInGLReport(memo) {
    const row = loc.glReport.transactionRow(this.page, memo);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    return await row.isVisible();
  }

  // ── Payroll Actions ───────────────────────────────────────────────────────

  async runPayrollResultsReport(payPeriod) {
    await loc.payroll.periodFilter(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.payroll.periodFilter(this.page).fill(payPeriod);
    await loc.shared.typeaheadOption(this.page, payPeriod).click();
    await loc.payroll.runButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  async isPayrollGridVisible() {
    await loc.payroll.resultsGrid(this.page).waitFor({ state: 'visible', timeout: 20000 });
    return await loc.payroll.resultsGrid(this.page).isVisible();
  }

  // ── Shared Helpers ────────────────────────────────────────────────────────

  async waitForSpinnerToDisappear() {
    try {
      await loc.shared.spinner(this.page).waitFor({ state: 'hidden', timeout: 30000 });
    } catch {
      // spinner may not appear for fast operations
    }
  }

  async isSuccessNotificationVisible() {
    return await loc.shared.successNotification(this.page).isVisible();
  }

  async getPageHeaderTitle() {
    await loc.shared.pageHeader(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.shared.pageHeader(this.page).textContent();
  }
}

module.exports = WorkdayFinancePage;
