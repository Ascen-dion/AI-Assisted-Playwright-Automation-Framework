# Experian — Framework Context

## File Structure
```
src/web/locators/experian-*.locators.js   → locator files
src/web/pages/experian-*.page.js          → page objects
src/web/tests/nav/experian-*.spec.js      → navigation/smoke specs
src/web/tests/application/experian-*.spec.js → journey/regression specs
src/shared/data/experian-test-data.js     → centralised test data
```

## Naming Convention
- Locators: `experian-<feature>.locators.js`
- Pages: `experian-<feature>.page.js`
- Specs: `experian-<feature>.spec.js`

## Spec Template
```js
const { test, expect } = require('../../../shared/fixtures');
const Page = require('../../pages/experian-<feature>.page');
const TD = require('../../../shared/data/experian-test-data');

test.describe('[UI] Experian <Feature>', { tag: ['@smoke', '@experian'] }, () => {
  ...
});
```

## Locator Template
```js
const locators = {
  element: (page) => page.getByRole('...', { name: /Text/i }).first(),
};
module.exports = locators;
```

## Page Object Template
```js
const BasePage = require('./base.page');
const loc = require('../locators/experian-<feature>.locators');

class ExperianFeaturePage extends BasePage {
  async goto() { await super.goto('https://www.experian.com/<path>'); }
  // ... methods
}
module.exports = ExperianFeaturePage;
```

## Spec File Template
```js
const { test, expect } = require('../../../shared/fixtures');
const Page = require('../../pages/experian-<feature>.page');
const TD = require('../../../shared/data/experian-test-data');

test.describe('[UI] Experian <Feature>', { tag: ['@smoke', '@experian'] }, () => {
  let featurePage;
  test.beforeEach(async ({ page }) => {
    featurePage = new Page(page);
    await featurePage.goto();
  });
  test('[Cxx] Test Case N: description', async ({ page }) => { ... });
});
```

## Selector Strategy (priority)
1. `getByRole()` — buttons, links, headings with accessible name
2. `getByText()` — visible text content
3. CSS selector — stable data attributes or structural selectors

## Assertion Rules
- All hardcoded strings come from `src/shared/data/experian-test-data.js`
- URL assertions use regex patterns from `TD.urlPatterns.*`
- Title assertions use regex patterns from `TD.pageTitles.*`
- Use `toBeVisible()` for element presence checks
- Navigation tests verify URL after click

## Tags
- `@smoke` — fast, critical-path verification
- `@regression` — broader coverage
- `@experian` — Experian-specific tests

## Run Commands
```bash
# All Experian tests
npx playwright test --grep "@experian" --config=config/playwright.config.js

# Smoke only
npx playwright test --grep "@experian" --grep "@smoke" --config=config/playwright.config.js

# Single spec
npx playwright test src/web/tests/nav/experian-homepage.spec.js --config=config/playwright.config.js

# Experian only (file pattern)
npx playwright test src/web/tests/nav/experian-*.spec.js --config=config/playwright.config.js  # experian only
```

## TestRail Integration
- Section ID: 46 (set via TESTRAIL_SECTION_ID in .env)
- Push script: `node src/shared/traceability/push-experian-to-testrail.js`
- Case IDs embedded in spec titles: `[Cxxx]`

## JIRA Integration
- Project: EX (Experian)
- Board: Experian - Kanban Board
