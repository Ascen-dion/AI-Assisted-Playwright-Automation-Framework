# Framework Knowledge — AI-Assisted Playwright Automation Framework

## Test Structure Rules
- All tests MUST follow Page Object Model (POM) pattern
- Locators live in: `src/pages/locators/<name>.locators.js`
- Page objects live in: `src/pages/<name>.page.js`
- Test specs live in subdirectories of `src/tests/`:
  - Navigation/smoke specs → `src/tests/nav/<name>-automated.spec.js`
  - Application/journey specs → `src/tests/application/<name>-automated.spec.js`
- Never put raw selectors directly inside spec files — always use the page object
- Never duplicate a selector string across files

## File Naming Convention
- Locator file: `workday-<area>.locators.js` (e.g. `workday-finance.locators.js`)
- Page file: `workday-<area>.page.js` (e.g. `workday-finance.page.js`)
- Spec file: `workday-<area>-automated.spec.js` or `workday-<area>-e2e.spec.js`
- Spec subdirectory: `application/` for all Workday specs

## Require Paths (from spec subdirectory)
When writing specs in `src/tests/application/`, require paths are two levels up:
```js
const Page = require('../../pages/workday-finance.page');      // page object
const TD   = require('../../data/workday-test-data');           // test data module
const { test, expect } = require('../../fixtures');            // extended fixture (preferred for new specs)
```

## Test Data Module — `src/data/workday-test-data.js`
All hardcoded assertion values and URLs must come from the test data module. Never hardcode them in specs.
```js
const TD = require('../../data/workday-test-data');
// TD.urls.*            — canonical Workday task URLs
// TD.urlPatterns.*     — URL regex patterns for expect().toHaveURL()
// TD.glAccounts.*      — GL account codes
// TD.costCentres.*     — cost centre codes
// TD.journalEntry.*    — journal entry test values and field data
// TD.statuses.*        — expected status strings (Draft, Posted, Reversed, etc.)
// TD.errors.*          — exact Workday validation error messages
// TD.pageTitles.*      — page title regex patterns
// TD.downstream.*      — downstream API base URLs
```
Add new entries to `src/data/workday-test-data.js` for any new assertion strings, URLs, or values.

## Locator File Structure
```js
const locators = {
  elementName: (page) => page.locator('selector').first(),
};
module.exports = locators;
```

## Page Object Structure
```js
const loc = require('./locators/<name>.locators');
const URL = '<target-url>';

class <Name>Page {
  constructor(page) { this.page = page; }
  async goto() { await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 }); }
  // Action methods return values or booleans
  // Never assert inside page objects — assertions belong in specs
}
module.exports = <Name>Page;
```

## Spec File Structure
```js
const { test, expect } = require('../../fixtures');  // preferred — enables self-healing queue
// OR: const { test, expect } = require('@playwright/test'); // for E2E/API tests
const WorkdayPage = require('../../pages/workday-finance.page');
const TD = require('../../data/workday-test-data');

// Tags:
//   @smoke       — page load / status field visible checks; fast
//   @regression  — full workflow tests (post, validate, report); run nightly and on Workday releases
//   @e2e         — cross-system journey tests (Workday → downstream API/UI)
//   @capital-one — scopes all Capital One Workday tests
test.describe('[UI] CAPxxx: <Story Title>', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let finance;

  // APPLICATION spec: gotoXxx() called per-test (each test has its own navigation)
  test('[Cxxx] Test Case N: <description>', async ({ page }) => {
    finance = new WorkdayPage(page);
    await finance.gotoCreateJournalEntry();
    // arrange, act, assert — use TD.* for all assertion values
  });
});
```

## Assertion Rules
- Use `expect(locator).toBeVisible()` not `isVisible()` inside specs
- Use `expect(page).toHaveURL(/pattern/)` for URL assertions
- Use `expect(page).toHaveTitle(/pattern/)` for title assertions
- Use `expect(locator).toHaveText('exact text')` for content assertions
- Always catch async errors with try/catch and re-throw for clear failure messages

## Reuse Before Creating
- Check existing page objects in `src/pages/` and their locators before creating new helpers
- If a method already exists in a page object, call it — do not reimplement
- Extend existing page objects rather than duplicating them

## Self-Healing
- The Healer Agent retries with regenerated selectors on failure
- Write selectors in order of resilience: data-testid > role > text > CSS
- Avoid positional selectors like `nth(0)` unless absolutely necessary

## Playwright Config
- Config file: `config/playwright.config.js`
- `globalSetup`: `config/globalSetup.js` — logs into Workday once, saves `playwright/.auth/workday-storageState.json`
- Default browser: Chromium (production) + `chromium-staging` (staging)
- Run all tests: `npx playwright test --config=config/playwright.config.js`
- Run smoke only: `npx playwright test --config=config/playwright.config.js --grep "@smoke"`
- Run regression only: `npx playwright test --config=config/playwright.config.js --grep "@regression"`
- Run against staging: `npx playwright test --project=chromium-staging --config=config/playwright.config.js`
- Run single spec: `npx playwright test src/tests/application/workday-finance-regression.spec.js --config=config/playwright.config.js`
- HTML report: written to `playwright-report/` (Playwright default); open with `npx playwright show-report`
- Blob report: written to `test-results/blob-report/`; merge shards with `npx playwright merge-reports --reporter=html test-results/blob-report`
- Videos and traces are recorded by default for CI debugging

## Flaky Test Detection
The logging reporter (`src/integrations/logging-reporter.js`) automatically detects flaky tests
(tests that pass after ≥1 retry) and emits `[FLAKY]` log lines. Search after a run:
```powershell
Select-String "\[FLAKY\]" logs/combined.log
```

## Extended Fixture — Self-Healing
`src/fixtures/index.js` wraps the Playwright `page` fixture. On test failure it appends
error context to `test-results/healing-queue.json` for offline AI batch repair:
```bash
node src/helpers/self-healing.js --queue test-results/healing-queue.json
```
New specs should import from `../../fixtures` instead of `@playwright/test`.
