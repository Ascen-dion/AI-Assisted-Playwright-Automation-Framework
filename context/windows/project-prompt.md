# Project Prompt — Always-On Instructions (Windows App)

These instructions are injected into every Windows app agent session.
They act as guardrails to keep all generated output aligned with this project's
Windows automation standards and consistent with the Playwright / MobileWright
coding style used everywhere else in this framework.

---

## Always Do

### Context First
- Always read `context/windows/application.md` first — get the AUMID, screen inventory, and verified locators
- Always read `context/windows/framework.md` — file naming, POM structure, locator priority rules
- Always read `context/windows/domain.md` — business rules and assertion values

### Locator Discovery
- Always use the **windows-app-mcp** server (`windows_list_elements`) to inspect the live
  UIAutomation accessibility tree before writing any locator
- Launch the app first with `windows_launch_app`, then call `windows_list_elements` to see
  every element's `Name`, `AutomationId`, and `ClassName`
- Always verify every locator against the live tree before committing it to a locators file
- Use **Accessibility Insights for Windows** as a secondary inspection tool when MCP is unavailable

### Locator Rules
- Always prefer XPath `contains(@Name, ...)` over exact `~accessibilityId` for HP app elements
- Always check for `AutomationId` first — it is the most stable locator when set
- Always use partial `Name` matches for dynamic values (battery %, model names, counters)
- Always add a comment above each locator explaining what it targets and why that strategy was chosen

### File Generation
- Always generate three separate code blocks: locators file, screen object file, spec file
- Each block must start with `// === FILE: <relative-path> ===` as the first line
- Use CommonJS (`require` / `module.exports`) — this project does not use ES modules
- Use 2-space indentation throughout
- Export screen objects as **singletons**: `module.exports = new ClassName();`
- Never import `browser` — it is a WDIO global available everywhere

### Test Data
- All assertion strings, timeouts, and app identifiers must come from
  `const TD = require('../data/<appName>-test-data')` — never hardcode inline
- All timeout values must reference `TD.timeouts.<key>`, not raw numbers
- Never hardcode AUMID or exe paths in spec files — they come from `TD.app.aumid`

### Test ID and Tags
- Always embed a `[TC-WIN-<APP>-NNN]` case ID in every test title
- Add `@smoke` tag comment to launch and visibility tests
- Add `@regression` tag comment to full interaction flows

### Home Screen Verification
- Always use `waitForScreen()` from the screen object at the start of each test
- The fallback strategy (`browser.getTitle()`) is the WebView2-safe sentinel —
  always implement both the element wait AND the title fallback in `waitForScreen()`

### Preconditions in Spec Header
- Always document prerequisites in the spec file JSDoc:
  - WinAppDriver installed path
  - `npm run appium:start` required
  - App AUMID / exe path

---

## Always Avoid

- Never use hardcoded waits (`browser.pause()`, `setTimeout`) — use `waitForElement()` from the base screen
- Never put raw locator strings directly in spec files — all locators go through screen object methods
- Never assert exact battery percentage — use `contains` matching
- Never assert exact device model string — assert `contains("EliteBook")` or `contains("HP")`
- Never generate tests that depend on execution order or share state between `it()` blocks
- Never use positional or index-based XPath (`//Button[2]`) as a primary locator
- Never use `~exactName` (accessibility ID) for elements with dynamic values
- Never generate placeholder text like "TODO", "your selector here", or "implement this"
- Never re-implement `waitForElement`, `click`, `getText`, or `isVisible` in subclasses — inherit from base

---

## Code Generation Format

### Locators file
```js
// === FILE: src/windows/locators/<appName>-<screen>.locators.js ===
module.exports = {
  /** <What this element is> — verified via windows_list_elements */
  ELEMENT_NAME: '//ControlType[contains(@Name,"<label>")]',
};
```

### Screen object
```js
// === FILE: src/windows/screens/<appName>-<screen>.screen.js ===
const WindowsBaseScreen = require('./windows-base.screen.js');
const locators = require('../locators/<appName>-<screen>.locators.js');
const TD = require('../data/<appName>-test-data.js');

class <Name>Screen extends WindowsBaseScreen {
  async waitForScreen(timeout = TD.timeouts.appLaunch) { ... }
  // one method per user-visible action or assertion
}
module.exports = new <Name>Screen();
```

### Spec file
```js
// === FILE: src/windows/tests/<appName>-<feature>.spec.js ===
const TD = require('../data/<appName>-test-data.js');
const screen = require('../screens/<appName>-<screen>.screen.js');

describe('<AppName> — <Feature> Tests', () => {
  it('[TC-WIN-<APP>-001] should ...', async () => {
    await screen.waitForScreen();
    // assertion using TD.* values only
  });
});
```

---

## Workflow: Adding a Test for a New Screen

1. **Discover locators** → `windows_launch_app` → `windows_take_screenshot` → `windows_list_elements`
2. **Create test data** → `src/windows/data/<appName>-test-data.js`
3. **Create locators file** → `src/windows/locators/<appName>-<screen>.locators.js`
4. **Create screen object** → `src/windows/screens/<appName>-<screen>.screen.js`
5. **Create spec** → `src/windows/tests/<appName>-<feature>.spec.js`
6. **Add npm script** → `package.json` → `"test:windows:<appName>": "cross-env WINDOWS_APP=\"<aumid>\" wdio run wdio.windows.config.js --spec src/windows/tests/<appName>-*.spec.js"`
7. **Run test** → `npm run test:windows:<appName>`
8. **View report** → `npm run windows:show-report`

---

## Jira Story Format

- Title: `[Windows] <brief action or verification>`
- Include: app name, AUMID, screen name, acceptance criteria (Given/When/Then)

## Test Case Format

- Title: `Test Case N: <action verb> <what is verified>`
- Steps numbered, starting with action verb: Launch, Click, Type, Verify, Assert
- Expected result: concrete, observable outcome — never "it works correctly"
- Preconditions: Developer Mode ON, WinAppDriver installed, Appium running
