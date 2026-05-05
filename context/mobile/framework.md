# Framework Knowledge — Mobile Automation (Mobilewright)

## Test Framework
- **Runner**: Mobilewright (`@mobilewright/test`)
- **Config file**: `mobilewright.config.js` at the project root
- **Test directory**: `mobile/tests/`
- **Reports**: `mobile/reports/html/` (HTML) — open with `npx mobilewright show-report mobile/reports/html`

---

## Page Object Model (POM) Conventions

### Directory Structure
```
mobile/
  data/
    <appName>-test-data.js      → all test data constants
  pages/
    <appName>-base.page.js      → base class for all page objects
    <screenName>.page.js        → one file per screen
    locators/
      <screenName>.locators.js  → one locator file per screen
  tests/
    <appName>-<feature>.spec.js → spec files
```

### File Naming Convention
- Locator file: `<screenName>.locators.js`  (e.g. `home.locators.js`)
- Page object: `<appName>-<screenName>.page.js`  (e.g. `myapp-home.page.js`)
- Spec file: `<appName>-<feature>.spec.js`  (e.g. `myapp-search.spec.js`)
- Test data: `<appName>-test-data.js`  (e.g. `myapp-test-data.js`)

---

## Locator File Structure

```js
// === FILE: mobile/pages/locators/<screenName>.locators.js ===
/**
 * <ScreenName> Screen Locators
 * All labels verified against live <device> accessibility tree.
 */
const locators = {
  // content-desc — most stable; use as first choice
  elementName: (screen) => screen.getByLabel('exact-content-desc'),

  // visible text
  buttonName:  (screen) => screen.getByText('Exact Button Text'),

  // ARIA role + name
  submitBtn:   (screen) => screen.getByRole('button', { name: 'Submit' }),

  // widget class — last resort; append .first() when multiple matches exist
  inputField:  (screen) => screen.getByType('android.widget.EditText').first(),
};
module.exports = locators;
```

**Selector priority order (always apply in this order):**
1. `screen.getByLabel('content-desc')` — most stable across app versions
2. `screen.getByText('visible text')`
3. `screen.getByRole('role', { name: 'name' })`
4. `screen.getByType('android.widget.ClassName')`
5. `resource-id` — last resort only; add a comment explaining why it was needed

Never use positional selectors, XPath, or hardcoded screen coordinates as primary locators.

---

## Base Page Structure

```js
// === FILE: mobile/pages/<appName>-base.page.js ===
const TD = require('../data/<appName>-test-data');

class <AppName>BasePage {
  constructor(device, screen) {
    this.device = device;
    this.screen = screen;
  }

  /** Cold-start the app, killing any existing session first. */
  async launch() {
    try { await this.device.terminateApp(TD.app.bundleId); } catch (_) {}
    await this.device.launchApp(TD.app.bundleId);
  }

  /** Terminate the app. */
  async close() {
    try { await this.device.terminateApp(TD.app.bundleId); } catch (_) {}
  }

  /**
   * Dismiss any sign-in / consent overlay that appears on launch.
   * Silently swallows the error when the overlay is already gone.
   */
  async dismissSignInPrompt() {
    try {
      await this.screen
        .getByRole('button', { name: /skip|not now|dismiss|continue/i })
        .waitFor({ state: 'visible', timeout: 4000 });
      await this.screen
        .getByRole('button', { name: /skip|not now|dismiss|continue/i })
        .tap();
    } catch (_) {}
  }
}
module.exports = <AppName>BasePage;
```

---

## Screen Page Object Structure

```js
// === FILE: mobile/pages/<appName>-<screenName>.page.js ===
const <AppName>BasePage = require('./<appName>-base.page');
const loc = require('./locators/<screenName>.locators');
const TD = require('../data/<appName>-test-data');

class <ScreenName>Page extends <AppName>BasePage {
  constructor(device, screen) {
    super(device, screen);
  }

  async goto() {
    await this.launch();
    await this.dismissSignInPrompt();
    await this.waitForScreen();
  }

  async waitForScreen() {
    await loc.screenSentinel(this.screen).waitFor({
      state: 'visible',
      timeout: TD.timeouts.screenTransition,
    });
  }

  // Action methods — each does ONE thing: navigate, get value, or return boolean
  // NEVER assert inside page objects — assertions belong exclusively in specs
}
module.exports = <ScreenName>Page;
```

---

## Spec File Structure

```js
// === FILE: mobile/tests/<appName>-<feature>.spec.js ===
const { test, expect } = require('@mobilewright/test');
const <ScreenName>Page = require('../pages/<appName>-<screenName>.page');
const TD = require('../data/<appName>-test-data');

// test.use MUST be at the top level — never inside describe or beforeEach
test.use({ platform: TD.app.platform, bundleId: TD.app.bundleId });

test.describe('[Mobile][<Tag>] <AppName> — <Feature>', () => {
  // Set timeout high enough to cover app cold-start
  test.setTimeout(TD.timeouts.appLaunch + 10000);

  test('[C<id>] Test Case N: <action verb> <what is verified>', async ({ device, screen }) => {
    const page = new <ScreenName>Page(device, screen);
    await page.goto();

    // Act
    await page.tap<Element>();

    // Assert — always use TD constants, never hardcode strings
    await expect(screen.getByLabel(TD.<screen>.<label>))
      .toBeVisible({ timeout: TD.timeouts.screenTransition });
  });
});
```

---

## Test Data File Structure

```js
// === FILE: mobile/data/<appName>-test-data.js ===
const TD = {
  app: {
    bundleId: '<com.example.app>',
    name:     '<AppName>',
    platform: 'android', // or 'ios'
  },
  <screenName>: {
    // Exact content-desc / text values from live accessibility tree
    // Always document which device/OS version these were verified against
    someLabel: 'Exact Label Text',
  },
  timeouts: {
    appLaunch:        40000,  // cold start inc. splash screen
    screenTransition: 15000,  // screen-to-screen navigation
    contentLoad:      20000,  // dynamic content / API-driven lists
  },
};
module.exports = TD;
```

---

## Test Tagging Convention

| Tag | When to use |
|---|---|
| `@smoke` | Fast launch and visibility checks; run on every push |
| `@regression` | Full interaction journeys; run on PR and nightly |

---

## Mobilewright Selector API

| Method | Accessibility tree attribute | Use when |
|---|---|---|
| `screen.getByLabel('text')` | `content-desc` | Element has a meaningful `content-desc` |
| `screen.getByText('text')` | `text` (visible label) | Element has visible text with no `content-desc` |
| `screen.getByRole('role', { name })` | ARIA role + name | Interactive elements with an accessible name |
| `screen.getByType('className')` | `class` (widget type) | Generic widget types, disambiguated by `.first()` |

---

## Known Framework Constraints

- Import: `const { test, expect } = require('@mobilewright/test')`
- `test.use({ platform, bundleId })` must be at the **top level** of the spec file, not inside `describe`
- `screen.pressButton('ENTER')` for IME keyboard submit — not `device.pressButton()`
- Page objects receive `device` and `screen` from the test fixture — not `page`
- `test.setTimeout()` must be set at `describe` level; minimum value: `TD.timeouts.appLaunch + 10000`
- Each test that needs a clean state must call `page.goto()` per-test (which calls `launch()` internally)
- HTML reports: `mobile/reports/html/` — open with `npx mobilewright show-report mobile/reports/html`


## File Naming Convention
- Locator file: `<feature-name>.locators.js` (e.g. `ud-products-nav.locators.js`)
- Page file: `<feature-name>.page.js` (e.g. `ud-products-nav.page.js`)
- Spec file: `<feature-name>.spec.js` (e.g. `ud-products-nav.spec.js`)
- Spec subdirectory: `nav/` for navigation specs; `application/` for application journey specs

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
// TD.accounts.*        — savings/current account product details
// TD.cards.*           — credit card product names and details
// TD.loans.*           — loan product details
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
- Check existing page objects in `src/pages/` and their locators before creating new helpers
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
- Run single spec: `npx playwright test src/tests/nav/ud-homepage-nav.spec.js --config=config/playwright.config.js`
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
