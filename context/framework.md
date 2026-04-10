# Framework Knowledge — AI-Assisted Playwright Automation Framework

## Test Structure Rules
- All tests MUST follow Page Object Model (POM) pattern
- Locators live in: `src/pages/locators/<name>.locators.js`
- Page objects live in: `src/pages/<name>.page.js`
- Test specs live in: `src/tests/<name>.spec.js`
- Never put raw selectors directly inside spec files — always use the page object
- Never duplicate a selector string across files

## File Naming Convention
- Locator file: `<jira-id-lowercase>.locators.js` (e.g. `ed-68.locators.js`)
- Page file: `<jira-id-lowercase>.page.js` (e.g. `ed-68.page.js`)
- Spec file: `<jira-id-lowercase>-automated.spec.js` (e.g. `ed-68-automated.spec.js`)

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
const { test, expect } = require('@playwright/test');
const <Name>Page = require('../pages/<name>.page');

test.describe('[UI] <Story Title>', () => {
  let pagObj;
  test.beforeEach(async ({ page }) => {
    pagObj = new <Name>Page(page);
    await pagObj.goto();
    // Dismiss cookie/consent dialogs safely
    try { await page.getByRole('button', { name: /accept|agree|consent/i }).first().click({ timeout: 3000 }); } catch {}
  });

  test('Test Case N: <description>', async ({ page }) => {
    // arrange, act, assert
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
- Check `src/pages/ecomm-brownfield.page.js` and its locators before creating new helpers
- If a method already exists in a page object, call it — do not reimplement
- Extend existing page objects rather than duplicating them

## Self-Healing
- The Healer Agent retries with regenerated selectors on failure
- Write selectors in order of resilience: data-testid > role > text > CSS
- Avoid positional selectors like `nth(0)` unless absolutely necessary

## Playwright Config
- Config file: `config/playwright.config.js`
- Default browser: Chromium
- Run command: `npx playwright test <spec> --config=config/playwright.config.js --project=chromium`
- Videos and traces are recorded by default for CI debugging
