# Framework Knowledge - AI-Assisted Playwright Automation Framework (Sun Life Philippines)

## Test Structure Rules
- All tests MUST follow Page Object Model (POM) pattern
- Locators live in: src/web/locators/<name>.locators.js
- Page objects live in: src/web/pages/<name>.page.js
- Test specs live in subdirectories of src/web/tests/:
  - Navigation/smoke specs → src/web/tests/nav/<name>.spec.js
  - Application/journey specs → src/web/tests/purchase/<name>.spec.js
- Never put raw selectors directly inside spec files — always use the page object
- Never duplicate a selector string across files

## File Naming Convention
- Locator file: sunlife-<feature-name>.locators.js (e.g. sunlife-insurance-nav.locators.js)
- Page file: sunlife-<feature-name>.page.js (e.g. sunlife-insurance-nav.page.js)
- Spec file: sunlife-<feature-name>.spec.js (e.g. sunlife-insurance-nav.spec.js)
- Spec subdirectory: 
av/ for navigation/smoke specs; purchase/ for product journey specs

## Require Paths (from spec subdirectory)
When writing specs in src/web/tests/nav/ or src/web/tests/purchase/:
`js
const Page = require('../../pages/sunlife-xxx.page');           // web page object
const TD   = require('../../../shared/data/test-data');          // test data module
const { test, expect } = require('../../../shared/fixtures');    // extended fixture (preferred)
`

## Test Data Module — src/shared/data/test-data.js
All hardcoded assertion values and URLs must come from the test data module. Never hardcode them in specs.
`js
const TD = require('../../../shared/data/test-data');
// TD.urls.*            — canonical page URLs (e.g. TD.urls.homepage, TD.urls.insurance)
// TD.urlPatterns.*     — URL regex patterns for expect().toHaveURL()
// TD.pageTitles.*      — page title strings / regex patterns
// TD.nav.*             — navigation link texts and labels
// TD.products.*        — product names and feature bullets
// TD.insurance.*       — insurance product details
// TD.investments.*     — investment product details
`
Add new entries to src/shared/data/test-data.js for any new assertion strings or URLs.

## Locator File Structure
`js
// === FILE: src/web/locators/sunlife-<name>.locators.js ===
const locators = {
  openMenuButton: (page) => page.getByRole('button', { name: 'open menu' }),
  sunLifeLogo:    (page) => page.getByRole('link', { name: 'Sun Life' }).first(),
  insuranceNavBtn:(page) => page.getByRole('button', { name: 'Insurance' }),
  // Use getByRole, getByText, getByLabel in that order of preference
  // Use stable CSS only as last resort
};
module.exports = locators;
`

## Page Object Structure
`js
// === FILE: src/web/pages/sunlife-<name>.page.js ===
const loc = require('../locators/sunlife-<name>.locators');

const URL = 'https://www.sunlife.com.ph/en/';  // from application.md

class SunLife<Name>Page {
  constructor(page) { this.page = page; }

  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async openMenu() {
    await loc.openMenuButton(this.page).click();
    // Wait for menu dialog to be visible
    await this.page.getByRole('dialog', { name: 'Sun Life menu' }).waitFor({ state: 'visible', timeout: 10000 });
  }

  // Action methods do ONE thing — navigate, get value, or return boolean
  // NEVER assert inside page objects — assertions belong in specs
  async isElementVisible(locatorFn) {
    await locatorFn(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await locatorFn(this.page).isVisible();
  }
}
module.exports = SunLife<Name>Page;
`

## Spec File Structure
`js
// === FILE: src/web/tests/nav/sunlife-<name>.spec.js ===
const { test, expect } = require('../../../shared/fixtures');
const SunLife<Name>Page = require('../../pages/sunlife-<name>.page');
const TD = require('../../../shared/data/test-data');

// Tags:
//   @smoke      — nav/visibility checks; fast; run on every push
//   @regression — full journey tests; run on PR and nightly
test.describe('[UI] <Story Title>', { tag: ['@smoke', '@regression'] }, () => {
  let page;

  test.beforeEach(async ({ page: p }) => {
    page = new SunLife<Name>Page(p);
    await page.goto();
    // Cookie consent is dismissed by globalSetup — try/catch safety net only
    try {
      await p.getByRole('button', { name: 'Close' }).first().click({ timeout: 3000 });
    } catch {}
  });

  test('[Cxxx] Test Case N: <action verb> <what is verified>', async ({ page: p }) => {
    // Act
    await page.openMenu();
    await page.clickInsurance();

    // Assert — always use TD constants, never hardcode strings
    await expect(p).toHaveURL(TD.urlPatterns.insurance, { timeout: 15000 });
    await expect(p).toHaveTitle(TD.pageTitles.insurance, { timeout: 15000 });
  });
});
`

## Key Selector Strategy (Priority Order)
1. getByRole('button', { name: '...' }) — for buttons and interactive elements
2. getByRole('link', { name: '...' }) — for anchor links
3. getByRole('dialog', { name: '...' }) — for the hamburger menu
4. getByRole('combobox', { name: '...' }) — for dropdown selects
5. getByLabel('...') — for form inputs
6. getByText('...') — for text content assertions
7. Stable CSS class — ONLY as a last resort; never positional or index-based
8. Never use XPath

## Navigation Pattern
The Sun Life PH site uses a **hamburger menu** (not a desktop nav bar).
To navigate via menu:
1. wait page.goto(URL) — land on homepage or target page
2. wait openMenuButton.click() — opens the menu dialog
3. wait insuranceButton.click() — expands the Insurance sub-menu
4. wait specificLink.click() — navigates to target page
5. wait page.waitForLoadState('domcontentloaded') — wait for navigation

## globalSetup & Cookie Consent
config/globalSetup.js dismisses the OneTrust cookie consent banner (aria-label="Close") once and saves
storage state to playwright/.auth/storageState.json. New specs do NOT call
dismissCookieConsent() in eforeEach — globalSetup handles it.
Legacy try/catch in eforeEach is a safety net only.

## Extended Fixture (Self-Healing)
src/shared/fixtures/index.js exports an extended 	est with self-healing queue.
For new specs, always import from:
`js
const { test, expect } = require('../../../shared/fixtures');
`

## Config
Test runner config: config/playwright.config.js
- 	estDir: src/web/tests
- Reports: HTML, TestRail (via 	estrail-reporter.js), Logging (via logging-reporter.js)
- Always run with: --config=config/playwright.config.js

## Timeout Standards
| Operation | Timeout |
|---|---|
| page.goto() | 60000ms |
| waitFor visible | 15000ms |
| toHaveURL assertion | 15000ms |
| toHaveTitle assertion | 15000ms |
| Cookie dismiss try/catch | 3000ms |
| Menu dialog visible | 10000ms |

## Banned Patterns
- waitForTimeout() — NEVER use; always use proper waitFor conditions
- Raw CSS selectors in spec files
- Hardcoded URL strings or page titles in specs (use TD.*)
- XPath selectors
- Index-based selectors (.nth(0) unless explicitly needed for carousel)
- Asserting inside page object methods
- Shared mutable state between tests
