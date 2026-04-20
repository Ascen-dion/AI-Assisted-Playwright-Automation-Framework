// === FILE: src/tests/application/workday-e2e-journey.spec.js ===
/**
 * End-to-End Journey Test — Capital One AAVA Demo (Use Case 4)
 *
 * DEMO NARRATIVE:
 * ──────────────────────────────────────────────────────────────────────────
 * "Capital One's Finance team has an emerging need to validate data journeys
 *  that span Workday and downstream systems. This test proves that a Journal
 *  Entry created in Workday flows correctly to:
 *
 *   1. Workday GL Balance Report  (Workday — UI)
 *   2. GL Reconciliation System   (downstream — API)
 *   3. Regulatory Reporting       (downstream — UI or API)
 *   4. Audit Trail                (audit system — API)
 *
 *  If any step fails, the test pinpoints exactly WHICH system broke the chain."
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Configuration:
 *   WORKDAY_BASE_URL     — Workday impl tenant (set in .env)
 *   RECON_API_BASE_URL   — Downstream GL Reconciliation REST API base
 *   REG_REPORT_URL       — Regulatory reporting platform URL
 *   AUDIT_API_BASE_URL   — Audit log API base URL
 *
 * Run:
 *   npx playwright test src/tests/application/workday-e2e-journey.spec.js \
 *     --config=config/playwright.config.js --headed
 */

const { test, expect, request } = require('@playwright/test');
const WorkdayFinancePage = require('../../pages/workday-finance.page');
const TD = require('../../data/workday-test-data');

// ─────────────────────────────────────────────────────────────────────────────
//  E2E Journey: Finance Period Close — Journal Entry to Regulatory Report
// ─────────────────────────────────────────────────────────────────────────────
test.describe('[E2E] CAP-201: Finance Period Close — Workday to Regulatory Reporting', {
  tag: ['@e2e', '@regression', '@capital-one', '@cross-system'],
}, () => {
  let finance;
  let apiContext;
  let journalMemo;
  let journalEntryId;

  test.beforeAll(async ({ request: req }) => {
    // Initialise API context for downstream system calls
    apiContext = await request.newContext({
      baseURL: TD.downstream.reconciliationApiBase,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  // ── Step 1: Create and Post Journal Entry in Workday ──────────────────────
  test('[C219] Step 1: Create and post a balanced Journal Entry in Workday', async ({ page }) => {
    journalMemo = `${TD.journalEntry.memoPrefix} CAP-201 E2E ${Date.now()}`;
    finance = new WorkdayFinancePage(page);
    await finance.gotoCreateJournalEntry();

    // Create balanced entry
    await finance.setAccountingDate('04/20/2026');
    await finance.setMemo(journalMemo);
    await finance.addJournalLine(
      TD.journalEntry.balancedDebit.ledgerAccount,
      TD.journalEntry.balancedDebit.amount,
      null,
      TD.journalEntry.balancedDebit.costCentre,
      0
    );
    await finance.addJournalLine(
      TD.journalEntry.balancedCredit.ledgerAccount,
      null,
      TD.journalEntry.balancedCredit.amount,
      TD.journalEntry.balancedCredit.costCentre,
      1
    );

    // Post
    await finance.clickPost();

    // Assert — Workday confirms status = Posted
    const status = await finance.getJournalEntryStatus();
    expect(status.trim()).toBe(TD.statuses.journalPosted);

    // Capture the journal entry ID from the page URL for downstream validation
    const url = page.url();
    const idMatch = url.match(/JournalEntry_([A-Za-z0-9\$]+)/);
    journalEntryId = idMatch ? idMatch[1] : null;
  });

  // ── Step 2: Validate in Workday GL Balance Report ─────────────────────────
  test('[C220] Step 2: Verify posted journal appears in Workday GL Balance Report', async ({ page }) => {
    test.skip(!journalMemo, 'Skipped — Step 1 did not produce a posted journal entry');

    finance = new WorkdayFinancePage(page);
    await finance.gotoGLBalanceReport();
    await finance.runGLReport({
      glAccount: TD.journalEntry.balancedDebit.ledgerAccount,
      period: '2026-Q2',
    });

    const inReport = await finance.isTransactionInGLReport(journalMemo);
    expect(inReport).toBe(true);
  });

  // ── Step 3: Validate in Downstream GL Reconciliation System (API) ─────────
  test('[C221] Step 3: Downstream GL Reconciliation API confirms transaction received', async () => {
    test.skip(!journalEntryId, 'Skipped — journal entry ID not captured from Step 1');
    test.skip(
      !process.env.RECON_API_BASE_URL,
      'Skipped — RECON_API_BASE_URL not configured (set in .env for production E2E run)'
    );

    /**
     * Contract: GET /api/v1/transactions?glCode={code}&period={period}
     * Response: [{ workdayRef, amount, status, glCode, period }]
     */
    const response = await apiContext.get('/api/v1/transactions', {
      params: {
        glCode: TD.glAccounts.salaries,
        period: '2026-Q2',
        workdayRef: journalEntryId,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    const matchingTx = body.find((tx) => tx.workdayRef === journalEntryId);
    expect(matchingTx).toBeDefined();
    expect(matchingTx.status).toBe('RECONCILED');
    expect(parseFloat(matchingTx.amount)).toBe(parseFloat(TD.journalEntry.testAmount));
  });

  // ── Step 4: Validate in Regulatory Reporting UI ───────────────────────────
  test('[C222] Step 4: Regulatory reporting platform displays the transaction', async ({ page }) => {
    test.skip(!journalEntryId, 'Skipped — journal entry ID not captured from Step 1');
    test.skip(
      !process.env.REG_REPORT_URL,
      'Skipped — REG_REPORT_URL not configured (set in .env for production E2E run)'
    );

    /**
     * Navigate to the regulatory reporting platform and verify the transaction
     * from Workday appears in the current period report.
     */
    await page.goto(process.env.REG_REPORT_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // Wait for report grid to load
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // Search for the journal entry by Workday reference
    const searchInput = page.locator('[data-testid="transaction-search"], input[placeholder*="search" i]').first();
    await searchInput.fill(journalEntryId);
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Assert transaction row is visible
    const transactionRow = page.locator(`[data-testid="transaction-row"]:has-text("${journalEntryId}")`);
    await expect(transactionRow).toBeVisible({ timeout: 15000 });

    const amountCell = transactionRow.locator('[data-testid="amount-cell"]');
    const amountText = await amountCell.textContent();
    expect(amountText).toContain('1,000.00');
  });

  // ── Step 5: Validate Audit Trail API ─────────────────────────────────────
  test('[C223] Step 5: Audit trail records all state transitions with timestamps', async () => {
    test.skip(!journalEntryId, 'Skipped — journal entry ID not captured from Step 1');
    test.skip(
      !process.env.AUDIT_API_BASE_URL,
      'Skipped — AUDIT_API_BASE_URL not configured (set in .env for production E2E run)'
    );

    /**
     * Contract: GET /api/v1/audit?entityId={journalId}
     * Response: [{ entityId, action, timestamp, user, fromState, toState }]
     */
    const auditContext = await request.newContext({
      baseURL: TD.downstream.auditApiBase,
    });

    const response = await auditContext.get('/api/v1/audit', {
      params: { entityId: journalEntryId },
    });

    expect(response.status()).toBe(200);

    const auditTrail = await response.json();
    expect(Array.isArray(auditTrail)).toBe(true);

    // Verify the Posted state transition exists
    const postedEvent = auditTrail.find(
      (e) => e.toState === 'Posted' || e.action === 'POST_JOURNAL_ENTRY'
    );
    expect(postedEvent).toBeDefined();
    expect(postedEvent.entityId).toBe(journalEntryId);
    expect(postedEvent.timestamp).toBeTruthy();
    expect(new Date(postedEvent.timestamp).getTime()).toBeLessThanOrEqual(Date.now());

    await auditContext.dispose();
  });

  // ── Step 6: Cleanup — Reverse the test journal entry ─────────────────────
  test('[C224] Step 6: Reverse test journal entry to keep sandbox clean', async ({ page }) => {
    test.skip(!journalMemo, 'Skipped — Step 1 did not produce a posted journal entry');

    finance = new WorkdayFinancePage(page);
    await finance.gotoManageJournalEntries();

    // Search for the journal entry by memo
    await finance.searchAndNavigate(journalMemo);

    // Reverse
    await finance.clickReverse();

    const finalStatus = await finance.getJournalEntryStatus();
    expect(finalStatus.trim()).toBe(TD.statuses.journalReversed);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  E2E Journey: Supplier Invoice to Payment — Workday AP Workflow
// ─────────────────────────────────────────────────────────────────────────────
test.describe('[E2E] CAP-202: AP Invoice to Payment — Workday Cross-Module Journey', {
  tag: ['@e2e', '@regression', '@capital-one', '@cross-system'],
}, () => {
  let finance;
  const invoiceNumber = `INV-E2E-${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    finance = new WorkdayFinancePage(page);
  });

  test('[C225] Step 1: Submit supplier invoice in Workday AP', async ({ page }) => {
    await finance.gotoCreateSupplierInvoice();

    await finance.fillSupplierInvoice({
      invoiceNumber,
      supplier: TD.supplierInvoice.testSupplier,
      invoiceDate: '04/20/2026',
      amount: TD.supplierInvoice.testAmount,
    });

    await finance.submitInvoice();

    const status = await finance.getInvoiceStatus();
    // After submit, invoice should be in Draft or Matched depending on PO matching config
    expect([TD.statuses.invoiceDraft, TD.statuses.invoiceMatched]).toContain(status.trim());
  });

  test('[C226] Step 2: Invoice appears in Workday AP pending approval queue', async ({ page }) => {
    test.skip(true, 'Requires AP Manager role access — configure WORKDAY_AP_MANAGER_USER in .env');
    // This step would navigate to the Supplier Invoice listing and confirm the invoice
    // is in the approval queue. Marked fixme pending AP approver credentials.
  });
});
