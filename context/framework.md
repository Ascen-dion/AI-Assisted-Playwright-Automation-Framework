# Framework Knowledge — AI-Assisted Playwright Automation Framework

## Test Structure Rules
- All tests MUST follow Page Object Model (POM) pattern
- Locators live in: `src/pages/locators/<name>.locators.js`
- Page objects live in: `src/pages/<name>.page.js`
- Test specs live in subdirectories of `src/tests/`:
  - Navigation/smoke specs → `src/tests/nav/<name>-automated.spec.js`
  - Purchase/journey specs → `src/tests/purchase/<name>-automated.spec.js`
- Never put raw selectors directly inside spec files — always use the page object
- Never duplicate a selector string across files

## File Naming Convention
- Locator file: `<feature-name>.locators.js` (e.g. `starhub-mobile-purchase.locators.js`)
- Page file: `<feature-name>.page.js` (e.g. `starhub-mobile-purchase.page.js`)
- Spec file: `<feature-name>-automated.spec.js` (e.g. `starhub-mobile-purchase-automated.spec.js`)
- Spec subdirectory: `nav/` for navigation specs; `purchase/` for purchase journey specs

## Require Paths (from spec subdirectory)
When writing specs in `src/tests/nav/` or `src/tests/purchase/`, require paths are two levels up:
```js
const Page = require('../../pages/my-page.page');     // page object
const TD   = require('../../data/test-data');          // test data module
const { test, expect } = require('../../fixtures');   // extended fixture (preferred for new specs)
```

## Test Data Module — `src/data/test-data.js`
All hardcoded assertion values and URLs must come from the test data module. Never hardcode them in specs.
```js
const TD = require('../../data/test-data');
// TD.urls.*            — canonical page URLs
// TD.urlPatterns.*     — URL regex patterns for expect().toHaveURL()
// TD.galaxyA57.*       — defaultColour, defaultStorage, defaultPaymentPeriod, colourLabelPrefix, storageLabelPrefix
// TD.authPopup.message — login-required popup text
// TD.deviceListing.itemCountRegex — /\d+ items/ regex
// TD.pageTitles.*      — page title regex patterns
```
Add new entries to `src/data/test-data.js` for any new assertion strings or URLs.

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
// OR: const { test, expect } = require('@playwright/test'); // for existing specs
const <Name>Page = require('../../pages/<name>.page');
const TD = require('../../data/test-data');

// Tags:
//   @smoke      — nav/visibility checks; fast; run on every push
//   @regression — full journey tests; run on PR and nightly
test.describe('[UI] <Story Title>', { tag: ['@smoke', '@regression'] }, () => {
  let pagObj;
  test.beforeEach(async ({ page }) => {
    pagObj = new <Name>Page(page);
    await pagObj.goto();
    // Cookie consent handled by globalSetup — try/catch here as safety net only
    try { await page.getByRole('button', { name: /got it/i }).first().click({ timeout: 3000 }); } catch {}
  });

  test('[Cxxx] Test Case N: <description>', async ({ page }) => {
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
- Check `src/pages/starhub-mobile-purchase.page.js` and its locators before creating new helpers
- If a method already exists in a page object, call it — do not reimplement
- Extend existing page objects rather than duplicating them

## Self-Healing
- The Healer Agent retries with regenerated selectors on failure
- Write selectors in order of resilience: data-testid > role > text > CSS
- Avoid positional selectors like `nth(0)` unless absolutely necessary

## Playwright Config
- Config file: `config/playwright.config.js`
- `globalSetup`: `config/globalSetup.js` — dismisses cookie consent once, saves `playwright/.auth/storageState.json`
- Default browser: Chromium (production) + `chromium-staging` (staging)
- Run all tests: `npx playwright test --config=config/playwright.config.js`
- Run smoke only: `npx playwright test --config=config/playwright.config.js --grep "@smoke"`
- Run regression only: `npx playwright test --config=config/playwright.config.js --grep "@regression"`
- Run against staging: `npx playwright test --project=chromium-staging --config=config/playwright.config.js`
- Run single spec: `npx playwright test src/tests/nav/starhub-broadband-nav-automated.spec.js --config=config/playwright.config.js`
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
