# Application Context — Workday Finance (Capital One Demo)

## Base Configuration

**Target Tenant URL**: `https://capitalone.wd12.myworkdayjobs.com/Capital_One`

**Login URL**: `https://capitalone.wd12.myworkdayjobs.com/Capital_One`
**Home URL**: `https://capitalone.wd12.myworkdayjobs.com/Capital_One`
**Application Type**: Enterprise ERP — Workday Finance & HCM
**Environment**: Sandbox / impl tenant (staging)

> **Credentials**: Set in `.env` as `WORKDAY_USERNAME` and `WORKDAY_PASSWORD`.
> Never hardcode credentials in test files.

---

## Authentication

Workday uses standard username/password login at `/login.htmld`. After successful authentication,
the session cookie persists for the browser context. `globalSetup.js` handles login once and
saves storage state to `playwright/.auth/workday-storageState.json`.

**Login selectors** (confirmed via DOM inspection):
| Element | Selector |
|---|---|
| Username field | `[data-automation-id="userName"]` |
| Password field | `[data-automation-id="password"]` |
| Sign In button | `[data-automation-id="submitButton"]` |
| Error message | `[data-automation-id="errorMessage"]` |

---

## Workday Finance Module — URL Patterns

Workday's routing uses a task-based URL pattern:

```
/d/task/<taskId>.htmld    → specific workflow/form
/d/report/<reportId>      → report viewer
/d/home.htmld             → home / dashboard
```

**Key Finance Entry Points** (navigate via search or direct URL):

| Area | Search Term | Task ID Pattern |
|---|---|---|
| Journal Entry | "Create Journal Entry" | `TBB$CreateJournalEntry` |
| Journal Entry Listing | "Journal Entries" | `TBB$ManageJournalEntries` |
| Supplier Invoice | "Create Supplier Invoice" | `TBB$CreateSupplierInvoice` |
| Budget Check | "Budget vs Actual" | `TBB$BudgetvsActualReport` |
| Payroll Results | "View Payroll Results" | `TBB$ViewPayrollResults` |
| GL Balance Report | "GL Balance Report" | `TBB$GeneralLedgerBalanceReport` |
| Worker Profile | "Worker" / "Find Workers" | `TBB$FindWorkers` |

---

## Workday Search Bar

The global search bar is the primary navigation mechanism for most testers and business users.

| Element | Selector |
|---|---|
| Search input | `[data-automation-id="globalSearchInput"]` |
| Search result item | `[data-automation-id="promptOption"]` |
| First result | `[data-automation-id="promptOption"]:first-child` |

---

## Journal Entry Form

The Journal Entry form is the primary Capital One Finance validation use case.

| Element | Selector | Notes |
|---|---|---|
| Journal Entry Status | `[data-automation-id="journalEntryStatus"]` | Values: Draft, In Progress, Posted, Reversed |
| Accounting Date field | `[data-automation-id="accountingDate"]` | MM/DD/YYYY format |
| Currency field | `[data-automation-id="currencyCode"]` | Default: USD |
| Journal Source | `[data-automation-id="journalSource"]` | Dropdown |
| Add Row button (debit) | `[data-automation-id="addButton"]` | Adds new journal line |
| Ledger Account field | `[data-automation-id="ledgerAccount"]` | Typeahead search |
| Debit Amount | `[data-automation-id="debitAmount"]` | Numeric input |
| Credit Amount | `[data-automation-id="creditAmount"]` | Numeric input |
| Post button | `[data-automation-id="postJournalEntry"]` | Primary action |
| Save for Later | `[data-automation-id="saveForLater"]` | Saves as Draft |
| Validation error | `[data-automation-id="validationError"]` | Appears when entry does not balance |
| Balance check indicator | `[data-automation-id="outOfBalance"]` | Shows debit/credit difference |
| Memo/Description | `[data-automation-id="memoField"]` | Free text |

---

## Supplier Invoice Form

| Element | Selector |
|---|---|
| Invoice Number field | `[data-automation-id="invoiceNumber"]` |
| Supplier field | `[data-automation-id="supplier"]` |
| Invoice Date | `[data-automation-id="invoiceDate"]` |
| Due Date | `[data-automation-id="dueDate"]` |
| Line Amount | `[data-automation-id="lineAmount"]` |
| Submit button | `[data-automation-id="submitInvoice"]` |
| Invoice Status | `[data-automation-id="invoiceStatus"]` |

---

## Budget vs Actual Report

| Element | Selector |
|---|---|
| Company/Org filter | `[data-automation-id="company"]` |
| Fiscal Year filter | `[data-automation-id="fiscalYear"]` |
| Cost Centre filter | `[data-automation-id="costCenter"]` |
| Run Report button | `[data-automation-id="runReport"]` |
| Budget row | `[data-automation-id="budgetRow"]` |
| Actual row | `[data-automation-id="actualRow"]` |
| Variance column | `[data-automation-id="varianceColumn"]` |

---

## Page Load Strategy

Workday pages use heavy JavaScript rendering. Always use:
```js
await this.page.waitForLoadState('networkidle', { timeout: 60000 });
```

Many Workday forms load asynchronously — wait for specific elements rather than page load state where possible.

---

## Environment Variables Required

```
WORKDAY_BASE_URL=https://capitalone.wd12.myworkdayjobs.com/Capital_One
WORKDAY_USERNAME=<service-account-user>
WORKDAY_PASSWORD=<service-account-password>
WORKDAY_TENANT=Capital_One
```
