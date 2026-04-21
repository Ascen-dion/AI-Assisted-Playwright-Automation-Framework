// === FILE: src/pages/locators/workday-finance.locators.js ===
/**
 * Workday Finance locators — Capital One demo.
 *
 * Workday uses data-automation-id attributes extensively.
 * All selectors confirmed against Workday's standard DOM structure.
 *
 * ⚠️  If Workday's bi-annual release changes any attribute, the self-healing
 *     runtime will detect the failure and regenerate the selector automatically.
 *     Update this file with the healed selector after each release cycle.
 */

const loc = {

  // ── Login ────────────────────────────────────────────────────────────────
  login: {
    usernameInput:  (page) => page.locator('[data-automation-id="userName"]'),
    passwordInput:  (page) => page.locator('[data-automation-id="password"]'),
    signInButton:   (page) => page.locator('[data-automation-id="submitButton"]'),
    errorMessage:   (page) => page.locator('[data-automation-id="errorMessage"]'),
  },

  // ── Global Navigation ─────────────────────────────────────────────────────
  nav: {
    searchInput:      (page) => page.locator('[data-automation-id="globalSearchInput"]'),
    searchOption:     (page) => page.locator('[data-automation-id="promptOption"]').first(),
    allSearchOptions: (page) => page.locator('[data-automation-id="promptOption"]'),
    homeLink:         (page) => page.locator('[data-automation-id="home"]'),
    userMenu:         (page) => page.locator('[data-automation-id="userMenu"]'),
    signOutButton:    (page) => page.locator('[data-automation-id="signOut"]'),
  },

  // ── Journal Entry Form ────────────────────────────────────────────────────
  journalEntry: {
    // Header fields
    accountingDate:    (page) => page.locator('[data-automation-id="accountingDate"]'),
    currency:          (page) => page.locator('[data-automation-id="currencyCode"]'),
    journalSource:     (page) => page.locator('[data-automation-id="journalSource"]'),
    memoField:         (page) => page.locator('[data-automation-id="memoField"]'),
    journalStatus:     (page) => page.locator('[data-automation-id="journalEntryStatus"]'),

    // Line entry
    addRowButton:      (page) => page.locator('[data-automation-id="addButton"]').first(),
    ledgerAccount:     (page) => page.locator('[data-automation-id="ledgerAccount"]').first(),
    ledgerAccountNth:  (page, n) => page.locator('[data-automation-id="ledgerAccount"]').nth(n),
    debitAmount:       (page) => page.locator('[data-automation-id="debitAmount"]').first(),
    debitAmountNth:    (page, n) => page.locator('[data-automation-id="debitAmount"]').nth(n),
    creditAmount:      (page) => page.locator('[data-automation-id="creditAmount"]').first(),
    creditAmountNth:   (page, n) => page.locator('[data-automation-id="creditAmount"]').nth(n),
    costCentreField:   (page) => page.locator('[data-automation-id="costCenter"]').first(),

    // Balance indicator
    outOfBalanceMsg:   (page) => page.locator('[data-automation-id="outOfBalance"]'),
    balanceAmount:     (page) => page.locator('[data-automation-id="balanceAmount"]'),

    // Actions
    postButton:        (page) => page.locator('[data-automation-id="postJournalEntry"]'),
    saveButton:        (page) => page.locator('[data-automation-id="saveForLater"]'),
    reverseButton:     (page) => page.locator('[data-automation-id="reverseJournalEntry"]'),
    submitButton:      (page) => page.locator('[data-automation-id="submitJournalEntry"]'),

    // Validation
    validationError:   (page) => page.locator('[data-automation-id="validationError"]'),
    inlineError:       (page) => page.locator('[data-automation-id="inlineValidationMessage"]').first(),
  },

  // ── Supplier Invoice Form ─────────────────────────────────────────────────
  supplierInvoice: {
    invoiceNumber:     (page) => page.locator('[data-automation-id="invoiceNumber"]'),
    supplierField:     (page) => page.locator('[data-automation-id="supplier"]'),
    invoiceDate:       (page) => page.locator('[data-automation-id="invoiceDate"]'),
    dueDate:           (page) => page.locator('[data-automation-id="dueDate"]'),
    lineAmount:        (page) => page.locator('[data-automation-id="lineAmount"]').first(),
    submitButton:      (page) => page.locator('[data-automation-id="submitInvoice"]'),
    invoiceStatus:     (page) => page.locator('[data-automation-id="invoiceStatus"]'),
    duplicateWarning:  (page) => page.locator('[data-automation-id="duplicateInvoiceWarning"]'),
  },

  // ── Budget vs Actual Report ───────────────────────────────────────────────
  budgetReport: {
    companyFilter:     (page) => page.locator('[data-automation-id="company"]'),
    fiscalYearFilter:  (page) => page.locator('[data-automation-id="fiscalYear"]'),
    costCentreFilter:  (page) => page.locator('[data-automation-id="costCenter"]'),
    runReportButton:   (page) => page.locator('[data-automation-id="runReport"]'),
    reportGrid:        (page) => page.locator('[data-automation-id="reportGrid"]'),
    budgetRow:         (page) => page.locator('[data-automation-id="budgetRow"]').first(),
    actualRow:         (page) => page.locator('[data-automation-id="actualRow"]').first(),
    varianceColumn:    (page) => page.locator('[data-automation-id="varianceColumn"]').first(),
    noDataMessage:     (page) => page.locator('[data-automation-id="noDataMessage"]'),
  },

  // ── GL Balance Report ─────────────────────────────────────────────────────
  glReport: {
    glAccountFilter:   (page) => page.locator('[data-automation-id="glAccount"]'),
    periodFilter:      (page) => page.locator('[data-automation-id="accountingPeriod"]'),
    runReportButton:   (page) => page.locator('[data-automation-id="runReport"]'),
    reportTable:       (page) => page.locator('[data-automation-id="reportTable"]'),
    transactionRow:    (page, memo) => page.locator(`[data-automation-id="reportRow"]:has-text("${memo}")`),
    totalBalance:      (page) => page.locator('[data-automation-id="totalBalance"]'),
  },

  // ── Payroll Results ───────────────────────────────────────────────────────
  payroll: {
    periodFilter:      (page) => page.locator('[data-automation-id="payPeriod"]'),
    runButton:         (page) => page.locator('[data-automation-id="viewResults"]'),
    resultsGrid:       (page) => page.locator('[data-automation-id="payrollResultsGrid"]'),
    totalGrossRow:     (page) => page.locator('[data-automation-id="totalGross"]'),
    netPayRow:         (page) => page.locator('[data-automation-id="netPay"]'),
  },

  // ── Job Search (Careers page) ─────────────────────────────────────────────
  jobSearch: {
    searchInput:   (page) => page.locator('[data-automation-id="keywordSearchInput"]'),
    searchButton:  (page) => page.locator('[data-automation-id="keywordSearchButton"]'),
    jobFoundText:  (page) => page.locator('[data-automation-id="jobFoundText"]'),
  },

  // ── Generic / Shared ──────────────────────────────────────────────────────
  shared: {
    pageHeader:       (page) => page.locator('[data-automation-id="pageHeaderTitle"]'),
    spinner:          (page) => page.locator('[data-automation-id="loadingSpinner"]'),
    successNotification: (page) => page.locator('[data-automation-id="successNotification"]'),
    errorNotification:   (page) => page.locator('[data-automation-id="errorNotification"]'),
    okButton:         (page) => page.locator('[data-automation-id="okButton"]'),
    cancelButton:     (page) => page.locator('[data-automation-id="cancelButton"]'),
    confirmButton:    (page) => page.locator('[data-automation-id="confirmButton"]'),
    typeaheadOption:  (page, text) => page.locator(`[data-automation-id="promptOption"]:has-text("${text}")`),
  },

};

module.exports = loc;
