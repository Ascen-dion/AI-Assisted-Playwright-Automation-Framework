# Framework Knowledge — macOS App Automation (WDIO + appium-mac2-driver)

## Technology Stack

| Layer | Tool | Version |
|-------|------|---------|
| Test runner | WebDriverIO (WDIO) | v9 |
| JS framework | Mocha (BDD) | via `@wdio/mocha-framework` |
| Desktop driver bridge | Appium | v3+ with `appium-mac2-driver` |
| XCTest driver | appium-mac2-driver | v1.10+ |
| Reporters | spec + html-nice + json | — |
| Config | `wdio.mac.config.js` | root |
| Platform config | `config/platform/mac.config.js` | root |

---

## Directory Structure

```
src/mac/
  data/
    <appName>-test-data.js        → all test data constants (timeouts, assertion strings, selectors)
  locators/
    <appName>-<screen>.locators.js  → one locator file per screen
  screens/
    mac-base.screen.js            → base class: waitForElement, click, typeText, getText, isVisible
    <appName>-<screen>.screen.js  → one screen object per screen
  tests/
    <appName>-<feature>.spec.js   → one spec file per feature
  reports/
    html/
      report.html                 → generated HTML report (open with: npm run mac:show-report)
```

---

## File Naming Conventions

| File type | Pattern | Example |
|-----------|---------|---------|
| Locators | `<appName>-<screen>.locators.js` | `hp-smart.locators.js` |
| Screen object | `<appName>-<screen>.screen.js` | `hp-smart.screen.js` |
| Spec file | `<appName>-<feature>.spec.js` | `hp-smart-smoke.spec.js` |
| Test data | `<appName>-test-data.js` | `hp-smart-test-data.js` |

---

## Locator Strategy (XCTest via mac2)

```
PRIORITY ORDER:
  1. ~accessibilityId    (WDIO shorthand for label/identifier — most stable)
  2. XPath @label        (//*[@label="..."] — exact label match)
  3. XPath contains()    (//XCUIElementType*[contains(@label,"...")] — resilient)
  4. XCUIElementType     (last resort — very fragile)
```

### WDIO Locator Formats for mac2

```js
// ~ prefix = accessibilityId (accessibilityLabel or accessibilityIdentifier)
'~Sign In'

// XPath with XCUIElementType
'//XCUIElementTypeButton[@label="Sign In"]'

// XPath with contains (resilient to label changes)
'//XCUIElementTypeStaticText[contains(@label,"My Printers")]'

// XCUIElementType constants for mac2:
//   XCUIElementTypeWindow       → top-level window
//   XCUIElementTypeButton       → clickable buttons
//   XCUIElementTypeStaticText   → labels / headings
//   XCUIElementTypeTextField    → text input
//   XCUIElementTypeImage        → image elements
//   XCUIElementTypeToolbar      → toolbar / nav bar container
//   XCUIElementTypeMenuItem     → menu items
```

### ⚠️ Key Differences from Windows

| Aspect | Windows (WinAppDriver) | macOS (mac2) |
|--------|----------------------|--------------|
| Locator prefix | `~AutomationId` | `~accessibilityLabel` |
| XPath element types | `//Button`, `//TextBlock` | `//XCUIElementTypeButton` |
| Attribute for label | `@Name` | `@label` |
| Attribute for ID | `@AutomationId` | `@identifier` |
| Driver cap | `appium:automationName: 'Windows'` | `appium:automationName: 'mac2'` |
| App cap | `appium:app: 'AUMID'` | `appium:bundleId: 'com.example.App'` |
| Appium port | 4723 | 4724 |

---

## Base Screen API (`mac-base.screen.js`)

All macOS screen objects extend `MacBaseScreen`. Available methods:

```js
// Wait for element with timeout
await this.waitForElement(locator, timeout)

// Click an element
await this.click(locator)

// Type text into a focused field
await this.typeText(locator, text)

// Get element text
await this.getText(locator) → String

// Check if element exists (non-throwing, returns bool)
await this.isVisible(locator) → Boolean

// Take and save screenshot
await this.screenshot(filename) → String (saved path)

// Wait until condition function resolves to true
await this.waitUntil(conditionFn, options)

// Get element attribute
await this.getAttribute(locator, attributeName) → String
```

---

## WDIO Config (`wdio.mac.config.js`)

Key capability block:

```js
capabilities: [{
  platformName: 'Mac',
  'appium:automationName': 'mac2',
  'appium:bundleId': process.env.MAC_BUNDLE_ID || 'com.hp.SmartForDesktop',
}]
```

Key settings:
- **Appium port**: 4724 (`config/platform/mac.config.js`)
- **Report output**: `test-results/mac/html/`
- **Steps log**: `test-results/mac/steps-log.json` (side-channel injection)
- **Screenshots**: `test-results/mac/html/screenshots/`
- **Mocha timeout**: 60 000 ms local / 120 000 ms CI (`process.env.CI`)

---

## Locator File Structure

```js
// === FILE: src/mac/locators/<appName>.locators.js ===
/**
 * <AppName> Locators — macOS (XCTest via appium-mac2-driver)
 *
 * Locator strategy priority:
 *   1. ~accessibilityId    → use when the element has a stable accessibility label/identifier
 *   2. XPath @label        → exact label match
 *   3. XPath contains()    → partial match for dynamic/translated labels
 *
 * Verify ALL locators with Xcode Accessibility Inspector:
 *   Xcode → Open Developer Tool → Accessibility Inspector
 *   Select the running app process, then inspect element properties.
 */
module.exports = {
  /** <Description> — accessibilityId: <value> */
  ELEMENT: '~<accessibilityLabel>',

  /** <Description> — XPath fallback */
  BUTTON: '//XCUIElementTypeButton[contains(@label,"<partial label>")]',
};
```

---

## Spec File Pattern

```js
// === FILE: src/mac/tests/<appName>-<feature>.spec.js ===
const screen = require('../screens/<appName>.screen.js');

describe('<AppName> — <Feature> Tests', () => {
  before(async () => {
    await screen.waitForHomeScreen();
  });

  it('[TC-MAC-<APP>-001] should launch and display the home screen', async () => {
    await browser.step('Wait for app main window');
    const win = await browser.$(screen.locators.MAIN_WINDOW);
    await browser.step('Assert main window is displayed');
    expect(await win.isDisplayed()).toBe(true);
  });
});
```

---

## npm Commands

```bash
npm run test:mac:hp           # run HP Smart smoke tests
npm run test:mac              # run all macOS tests
npm run mac:show-report       # open HTML report (macOS 'open' command)
npm run appium:mac:start      # start Appium on port 4724
npm run appium:install:mac    # install mac2 driver (one-time)
```

---

## Accessibility Inspector Workflow

To discover real locator values for any macOS app:

1. Open **Xcode** → Menu bar → **Xcode** → **Open Developer Tool** → **Accessibility Inspector**
2. In the top-left dropdown, select the **process** for HP Smart
3. Click the crosshair icon, then hover over elements in the HP Smart window
4. In the inspector panel, note:
   - **Label** → use as `~<label>` in WDIO
   - **Identifier** → use as `~<identifier>` in WDIO (more stable)
   - **Type** → e.g. `AXButton` maps to `XCUIElementTypeButton` in XPath

If Xcode is not available, use the `mac2` Appium `findElement` with
`xpath = //*` to dump all elements:

```js
const elements = await browser.$$('//*');
for (const el of elements) {
  console.log(await el.getAttribute('label'), await el.getAttribute('identifier'));
}
```
