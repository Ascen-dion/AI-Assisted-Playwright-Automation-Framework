// === FILE: src/data/workday-test-data.js ===
/**
 * Centralised test data for Workday Finance automation suite — Capital One demo.
 *
 * Single source of truth for all assertion strings, URLs, GL codes, and expected values.
 * When Workday changes a label or value, update here — not in each spec.
 *
 * Set WORKDAY_BASE_URL in .env — e.g. https://capitalone.wd12.myworkdayjobs.com/Capital_One
 */

const BASE = process.env.WORKDAY_BASE_URL || 'https://capitalone.wd12.myworkdayjobs.com/Capital_One';

module.exports = {

  // ── URLs ─────────────────────────────────────────────────────────────────
  urls: {
    login:              `${BASE}/login.htmld`,
    home:               `${BASE}/d/home.htmld`,
    createJournalEntry: `${BASE}/d/task/TBB$CreateJournalEntry.htmld`,
    manageJournalEntries: `${BASE}/d/task/TBB$ManageJournalEntries.htmld`,
    createSupplierInvoice: `${BASE}/d/task/TBB$CreateSupplierInvoice.htmld`,
    budgetVsActual:     `${BASE}/d/task/TBB$BudgetvsActualReport.htmld`,
    glBalanceReport:    `${BASE}/d/task/TBB$GeneralLedgerBalanceReport.htmld`,
    viewPayrollResults: `${BASE}/d/task/TBB$ViewPayrollResults.htmld`,
    findWorkers:        `${BASE}/d/task/TBB$FindWorkers.htmld`,
    careersHome:        `${BASE}`,
  },

  // ── Job Search ───────────────────────────────────────────────────────────
  jobSearch: {
    keyword:            'qa',
    expectedJobCount:   '9 JOBS FOUND',
  },

  // ── URL patterns (regex for toHaveURL assertions) ─────────────────────────
  urlPatterns: {
    workdayBase:        /impl\.workday\.com/,
    journalEntry:       /CreateJournalEntry|ManageJournalEntries/,
    supplierInvoice:    /CreateSupplierInvoice|SupplierInvoice/,
    budgetReport:       /BudgetvsActual/,
    glReport:           /GeneralLedgerBalance/,
    payrollResults:     /ViewPayrollResults/,
    findWorkers:        /FindWorkers/,
  },

  // ── Credentials (read from env — never hardcode) ──────────────────────────
  credentials: {
    username: process.env.WORKDAY_USERNAME || '',
    password: process.env.WORKDAY_PASSWORD || '',
  },

  // ── General Ledger Accounts ───────────────────────────────────────────────
  glAccounts: {
    salaries:             '5001',
    employeeBenefits:     '5002',
    travelEntertainment:  '6001',
    professionalServices: '6002',
    cash:                 '1000',
    accountsPayable:      '2000',
    retainedEarnings:     '3000',
  },

  // ── Cost Centres ─────────────────────────────────────────────────────────
  costCentres: {
    corporateFinance:  'CC-FIN-001',
    financeOps:        'CC-FIN-002',
    humanResources:    'CC-HR-001',
    technology:        'CC-TECH-001',
  },

  // ── Journal Entry test values ─────────────────────────────────────────────
  journalEntry: {
    memoPrefix:      '[AAVA-TEST]',
    journalSource:   'Manual',
    currency:        'USD',
    testAmount:      '1000.00',
    invalidGlCode:   '9999-INVALID',
    closedPeriodDate: '01/01/2020',

    // Balanced entry: debit 5001 / credit 1000, same amount
    balancedDebit: {
      ledgerAccount: '5001',
      costCentre:    'CC-FIN-001',
      amount:        '1000.00',
    },
    balancedCredit: {
      ledgerAccount: '1000',
      costCentre:    'CC-FIN-001',
      amount:        '1000.00',
    },
  },

  // ── Supplier Invoice test values ──────────────────────────────────────────
  supplierInvoice: {
    testSupplier:       'Ascendion Test Vendor',
    testInvoiceNumber:  'INV-AAVA-TEST-001',
    testAmount:         '5000.00',
    paymentTerms:       'Net 30',
  },

  // ── Expected status values ────────────────────────────────────────────────
  statuses: {
    journalDraft:       'Draft',
    journalInProgress:  'In Progress',
    journalApproved:    'Approved',
    journalPosted:      'Posted',
    journalReversed:    'Reversed',
    invoiceDraft:       'Draft',
    invoiceMatched:     'Matched',
    invoiceApproved:    'Approved',
    invoicePaid:        'Paid',
  },

  // ── Validation error messages (exact Workday strings) ─────────────────────
  errors: {
    outOfBalance:       'Journal Entry does not balance',
    invalidGlAccount:   'The value entered is not a valid account',
    closedPeriod:       'The selected period is closed for journal entry',
    requiredField:      'This field is required',
    duplicateInvoice:   'Duplicate Supplier Invoice Number',
  },

  // ── Page titles (regex patterns) ─────────────────────────────────────────
  pageTitles: {
    workdayHome:        /Workday/i,
    journalEntry:       /Journal Entry|Create Journal Entry/i,
    supplierInvoice:    /Supplier Invoice/i,
    budgetReport:       /Budget vs\. Actual|Budget vs Actual/i,
    glReport:           /General Ledger Balance/i,
    payrollResults:     /Payroll Results/i,
  },

  // ── Budget report expected values ─────────────────────────────────────────
  budget: {
    fiscalYear:     '2026',
    company:        'Capital One Financial',
    reportHasData:  true,
    varianceHeader: 'Variance',
  },

  // ── Downstream system (for UC4 E2E) ──────────────────────────────────────
  downstream: {
    reconciliationApiBase: process.env.RECON_API_BASE_URL || 'https://recon.capitalone-demo.internal',
    regulatoryReportUrl:   process.env.REG_REPORT_URL || 'https://reporting.capitalone-demo.internal',
    auditApiBase:          process.env.AUDIT_API_BASE_URL || 'https://audit.capitalone-demo.internal',
  },

};
