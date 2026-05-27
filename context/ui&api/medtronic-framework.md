# Medtronic India — Framework Context

## POM Structure

### File Layout
```
src/web/locators/medtronic-*.locators.js   → locator files
src/web/pages/medtronic-*.page.js          → page objects
src/web/tests/nav/medtronic-*.spec.js      → navigation/smoke specs
src/web/tests/application/medtronic-*.spec.js → journey/regression specs
```

### File Naming Convention
- Locators: `medtronic-<feature>.locators.js`
- Pages: `medtronic-<feature>.page.js`
- Specs: `medtronic-<feature>.spec.js`

### Require Paths (from spec in `src/web/tests/nav/`)
```js
const Page = require('../../pages/medtronic-<feature>.page');
const TD = require('../../../shared/data/medtronic-test-data');
const { test, expect } = require('../../../shared/fixtures');
```

## Locator Strategy (priority order)
1. `data-testid` — most stable, use if present
2. ARIA role + accessible name — `getByRole('link', { name: 'Patients' })`
3. Visible text — `getByText(...)`, `getByLabel(...)`
4. Stable CSS class/selector
5. **Never use**: positional selectors, XPath, or index-based selectors as primary

## Locator File Pattern
```js
const locators = {
  elementName: (page) => page.locator('selector').first(),
};
module.exports = locators;
```

## Page Object Pattern
```js
const BasePage = require('./base.page');
const loc = require('../locators/medtronic-<feature>.locators');

class MedtronicFeaturePage extends BasePage {
  async goto() { await super.goto(URL); }
  // Methods return values or locators — NEVER assert inside page objects
}
module.exports = MedtronicFeaturePage;
```

## Spec File Pattern
```js
const { test, expect } = require('../../../shared/fixtures');
const Page = require('../../pages/medtronic-<feature>.page');
const TD = require('../../../shared/data/medtronic-test-data');

test.describe('[UI] Feature', { tag: ['@smoke'] }, () => {
  let pageObj;
  test.beforeEach(async ({ page }) => {
    pageObj = new Page(page);
    await pageObj.goto();
  });
  test('[Cxxx] Test Case N: description', async ({ page }) => {
    // Act + Assert
  });
});
```

## Tags
- `@smoke` — navigation/visibility tests, fast, run on every push
- `@regression` — full journey tests, run on PR and nightly

## Assertions
- Use `.toBeVisible()` for element presence
- Use `.toHaveURL(/pattern/)` for URL verification
- Use `.toHaveTitle(/pattern/)` for page title verification
- Use `.toHaveText('exact text')` for content assertions
- Always source expected values from test-data module

## Configuration
- Config: `config/playwright.config.js`
- Global setup: `config/globalSetup.js` — dismisses cookie consent once
- Storage state: `playwright/.auth/storageState.json`
- Timeout: 60s local / 120s CI
- Action timeout: 15s local / 30s CI
- Viewport: 1280x720
- Retries: 1 local / 2 CI

## Run Commands
```bash
npx playwright test --config=config/playwright.config.js                    # all
npx playwright test --grep "@smoke" --config=config/playwright.config.js    # smoke
npx playwright test src/web/tests/nav/medtronic-*.spec.js --config=config/playwright.config.js  # medtronic only
npx playwright show-report                                                  # HTML report
```
