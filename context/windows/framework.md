# Framework Knowledge — Windows App Automation (WDIO + WinAppDriver)

## Technology Stack

| Layer | Tool | Version |
|-------|------|---------|
| Test runner | WebDriverIO (WDIO) | v9 |
| JS framework | Mocha (BDD) | via `@wdio/mocha-framework` |
| Desktop driver bridge | Appium | v3+ with `appium-windows-driver` |
| UIAutomation driver | WinAppDriver | v1.2.1 |
| Reporters | spec + html-nice + json | — |
| Config | `wdio.windows.config.js` | root |
| Platform config | `config/platform/windows.config.js` | root |

---

## Directory Structure

```
src/windows/
  data/
    <appName>-test-data.js       → all test data constants (timeouts, assertion strings, selectors)
  locators/
    <appName>-<screen>.locators.js  → one locator file per screen
  screens/
    windows-base.screen.js       → base class: waitForElement, click, typeText, getText, isVisible
    <appName>-<screen>.screen.js → one screen object per screen
  tests/
    <appName>-<feature>.spec.js  → one spec file per feature
  reports/
    html/
      report.html                → generated HTML report (open with: npm run windows:show-report)
```

---

## File Naming Conventions

| File type | Pattern | Example |
|-----------|---------|---------|
| Locators | `<appName>-<screen>.locators.js` | `hp-app-home.locators.js` |
| Screen object | `<appName>-<screen>.screen.js` | `hp-app-home.screen.js` |
| Spec file | `<appName>-<feature>.spec.js` | `hp-app-smoke.spec.js` |
| Test data | `<appName>-test-data.js` | `hp-app-test-data.js` |

---

## Locator File Structure

```js
// === FILE: src/windows/locators/<appName>-<screen>.locators.js ===
/**
 * <ScreenName> Locators — <AppName> Windows App
 *
 * Locator strategy for Windows UIAutomation (WinAppDriver via Appium):
 *
 *   PREFERRED: XPath with contains(@Name, ...)
 *     ✔ Immune to minor label changes and WebView2 rendering quirks
 *     ✔ Partial matches work even when accessible names include dynamic values
 *
 *   EXACT accessibility id (~Name) — use ONLY when Name is guaranteed stable
 *     ✘ Breaks if any character changes (e.g. "Charging 99%" → "Charging 87%")
 *
 * UIAutomation attribute reference:
 *   @Name          → accessible name (aria-label equivalent)
 *   @AutomationId  → developer-assigned stable ID (best when available)
 *   @ClassName     → control type: Button, TextBlock, TextBox, ListItem, etc.
 *
 * Verify every locator with the MCP tool: windows_list_elements
 * or via Accessibility Insights for Windows before committing.
 */

module.exports = {
  // --- <Section name> -------------------------------------------------------

  /** <Element description> */
  ELEMENT_NAME: '//Button[contains(@Name,"<visible label>")]',
};
```

---

## Locator Strategy Priority

1. **`//*[@AutomationId="stableId"]`** — most reliable; developer-assigned stable ID
2. **`//ControlType[contains(@Name,"<partial label>")]`** — partial name XPath; immune to minor wording changes
3. **`//ControlType[@Name="exact label"]`** — exact Name XPath; use when Name is 100% stable
4. **`~accessibilityId`** — WDIO shorthand for exact `Name` match; avoid for dynamic values
5. **`//ControlType[@ClassName="..."]`** — last resort; ClassName is stable but requires index if multiple exist

**Never use**: screen coordinates, positional/index-based selectors as primary locators

---

## Screen Object Structure

```js
// === FILE: src/windows/screens/<appName>-<screen>.screen.js ===
const WindowsBaseScreen = require('./windows-base.screen.js');
const locators = require('../locators/<appName>-<screen>.locators.js');
const TD = require('../data/<appName>-test-data.js');

class <AppName><Screen>Screen extends WindowsBaseScreen {

  /** Wait for this screen to be fully loaded (sentinel check). */
  async waitForScreen(timeout = TD.timeouts.appLaunch) {
    try {
      await this.waitForElement(locators.SENTINEL_ELEMENT, timeout);
    } catch {
      // Fallback for WebView2-wrapped apps: verify via window title
      const title = await browser.getTitle();
      if (!title.toLowerCase().includes(TD.app.windowTitleContains)) {
        throw new Error(`Screen not loaded. Window title: "${title}"`);
      }
    }
  }

  /** Check if <element> is visible. @returns {Promise<boolean>} */
  async is<Element>Visible() {
    return this.isVisible(locators.<ELEMENT>);
  }
}

module.exports = new <AppName><Screen>Screen();
```

> **Note**: Screen objects are exported as **singletons** (`module.exports = new ClassName()`).
> The `browser` global is provided by WDIO — do not import it.

---

## Spec File Structure

```js
// === FILE: src/windows/tests/<appName>-<feature>.spec.js ===
/**
 * <AppName> — <Feature> Tests (Windows App)
 *
 * Run:  npm run test:windows:<appName>
 * Pre:  WinAppDriver installed, Appium running (npm run appium:start)
 */

const TD = require('../data/<appName>-test-data.js');
const <screen> = require('../screens/<appName>-<screen>.screen.js');

describe('<AppName> — <Feature> Tests', () => {

  it('[TC-WIN-<APP>-001] should <verify something>', async () => {
    await <screen>.waitForScreen();
    const title = await browser.getTitle();
    expect(title.toLowerCase()).toContain(TD.app.windowTitleContains);
  });

});
```

---

## Test Data File Structure

```js
// === FILE: src/windows/data/<appName>-test-data.js ===
module.exports = {
  app: {
    name: '<App Display Name>',
    aumid: '<AUMID or exe path>',
    windowTitleContains: '<lowercase title fragment>',
  },
  timeouts: {
    appLaunch:      20000,
    elementVisible: 10000,
    navigation:     15000,
  },
  assertions: {
    // All assertion strings live here — never hardcode in specs
    someLabel: 'exact visible text',
  },
  selectors: {
    // Optional: re-export key selectors for direct use in test data
  },
};
```

---

## Base Screen API

Inherited by all screen objects from `windows-base.screen.js`:

| Method | Description |
|--------|-------------|
| `waitForElement(locator, timeout?)` | Wait for element to be displayed; returns element |
| `click(locator)` | Wait + click |
| `typeText(locator, text)` | Wait + clear + setValue |
| `getText(locator)` | Wait + getAttribute('Name') |
| `isVisible(locator)` | Returns boolean; never throws |
| `screenshot(filePath)` | Save screenshot to given path |

---

## Running Tests

```bash
# All Windows tests
npm run test:windows

# HP app smoke suite
npm run test:windows:hp

# Notepad (quick smoke / sanity check)
npm run test:windows:notepad

# Open HTML report
npm run windows:show-report

# Start Appium (required before running tests)
npm run appium:start
```

---

## Discover Locators with MCP

Use the **windows-app-mcp** server (registered in `.vscode/mcp.json`) to inspect the live accessibility tree:

```
1. windows_launch_app  { app: "AD2F1837.myHP_v10z8vjag6ke6!App" }
2. windows_take_screenshot {}
3. windows_list_elements  {}   ← dumps every UIAutomation element + Name + AutomationId
4. windows_find_element  { strategy: "xpath", value: "//Button" }
5. windows_close_session {}
```

Also use **Accessibility Insights for Windows** (free Microsoft tool) for visual tree inspection.

---

## Reports

| Output | Location | How to open |
|--------|----------|-------------|
| HTML report | `test-results/windows/html/report.html` | `npm run windows:show-report` |
| JSON results | `test-results/windows/results-windows.json` | any JSON viewer |
| Failure screenshots | `test-results/windows/screenshots/` | file explorer |
