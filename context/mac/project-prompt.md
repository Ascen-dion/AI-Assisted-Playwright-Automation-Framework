# Project Prompt — Always-On Instructions (macOS App)

These instructions are injected into every macOS app agent session.
They act as guardrails to keep all generated output aligned with this project's
macOS automation standards and consistent with the Playwright / MobileWright / Windows
coding style used everywhere else in this framework.

---

## Always Do

### Context First
- Always read `context/mac/application.md` first — get the bundle ID, screen inventory, and verified locators
- Always read `context/mac/framework.md` — file naming, POM structure, locator priority rules, mac2 differences from Windows
- Always read `context/mac/domain.md` — business rules and assertion values

### Locator Discovery
- Always use **Xcode Accessibility Inspector** to verify element labels before writing any locator
  → Xcode → Open Developer Tool → Accessibility Inspector → select the running app process
- If Accessibility Inspector is unavailable, dump all elements via WDIO:
  ```js
  const elements = await browser.$$('//*');
  for (const el of elements) {
    console.log(await el.getAttribute('label'), await el.getAttribute('identifier'), await el.getAttribute('elementType'));
  }
  ```
- Always verify `~accessibilityId` locators match the **Label** or **Identifier** field in Accessibility Inspector
- Never assume visual text equals the accessibility label — they can differ in HP Smart

### Locator Rules
- Always prefer `~accessibilityId` over XPath for mac2
- Always use XPath `contains(@label, ...)` for dynamic/translatable content
- Always use `XCUIElementType*` prefixes in XPath — never Windows-style `//Button`
- Always add a comment above each locator explaining what it targets and why that strategy was chosen

### File Generation
- Always generate three separate code blocks: locators file, screen object file, spec file
- Each block must start with `// === FILE: <relative-path> ===` as the first line
- Use CommonJS (`require` / `module.exports`) — this project does not use ES modules
- Use 2-space indentation throughout
- Export screen objects as **singletons**: `module.exports = new ClassName();`
- Never import `browser` — it is a WDIO global available everywhere

### Test Data
- All assertion strings, timeouts, and bundle IDs must come from a test data file
  `src/mac/data/<appName>-test-data.js` — never hardcode inline
- All timeout values must reference `TD.timeouts.<key>`, not raw numbers
- Never hardcode bundle IDs in spec files — they come from `TD.app.bundleId`

### Test ID and Tags
- Always embed a `[TC-MAC-<APP>-NNN]` case ID in every test title
  - HP Smart: `[TC-MAC-HP-NNN]`
  - Other apps: `[TC-MAC-<APPCODE>-NNN]`
- Add `@smoke` tag comment to launch and visibility tests
- Add `@regression` tag comment to full interaction flows

### Test Steps
- Every `it()` block MUST have `await browser.step('...')` calls for:
  - Each element being located/waited for
  - Each assertion being made and the expected value
  - Any conditional logic (dismissing onboarding, handling system dialogs)

---

## Never Do

- ❌ Never use Windows-style locators (`//Button`, `@Name`, `~AutomationId`) — macOS uses `//XCUIElementTypeButton`, `@label`, `~accessibilityId`
- ❌ Never hardcode bundle IDs in spec files
- ❌ Never use `browser.pause()` or `setTimeout` for waits — always use `waitForElement()` or `waitUntil()`
- ❌ Never put locators directly in spec files — always through screen object methods
- ❌ Never generate TODO placeholders or unimplemented stubs
- ❌ Never assert the exact printer model name — always use `contains(@label, ...)`
- ❌ Never use port 4723 for macOS — always port 4724

---

## Home Screen Verification Pattern

Always verify the home screen with this sequence:

```js
async waitForHomeScreen(timeout = TD.timeouts.appLaunch) {
  // Step 1: Dismiss system permission dialogs if present
  await this.dismissPrivacyScreenIfPresent();

  // Step 2: Dismiss app onboarding if present
  await this.dismissOnboardingIfPresent();

  // Step 3: Wait for main window to be stable
  await this.waitForElement(locators.MAIN_WINDOW, timeout);
}
```

---

## CI-Specific Notes

When generating code that may run in GitHub Actions (`macos-latest`):
- Accessibility permission for Node.js is pre-granted via TCC sqlite in the workflow
- HP Smart is installed via `mas install 1474276998`
- Appium runs on port 4724 as a background process
- Environment variable: `CI=true` (affects `mochaOpts.timeout`)
- The `MAC_BUNDLE_ID` env var overrides the default bundle ID

---

## Coding Rules (Hard Constraints)

| Rule | Detail |
|------|--------|
| Module system | CommonJS (`require`/`module.exports`) only — no ES modules |
| Indentation | 2 spaces |
| Singletons | `module.exports = new ClassName()` for all screen objects |
| `browser` global | Available from WDIO — never import it |
| Assertion strings | Always from `TD.*` — never hardcoded inline |
| Timeouts | Always from `TD.timeouts.*` — never raw numbers |
| Waits | Always `waitForElement()` — never `browser.pause()` or `setTimeout` |
| Locators in specs | Never — all locators go through screen object methods |
| Dynamic values | Always `contains(@label, ...)` — never exact match for things that change |
| Test IDs | `[TC-MAC-<APP>-NNN]` in every `it()` title |
| No placeholders | Never generate "TODO", "your selector here", or unimplemented stubs |
| Locator priority | `~accessibilityId` > `@label` XPath > `contains(@label)` XPath > XCUIElementType |
| XPath style | `XCUIElementType*` prefixes always — never Windows UIAutomation types |
| Test steps | Every `it()` block must have `browser.step()` calls for each action and assertion |
| Port | Always 4724 for macOS — never 4723 |

---

## Reporting & Artifacts

After running tests, artifacts are generated automatically:

- **HTML report**: `test-results/mac/html/report.html` → open with `npm run mac:show-report`
- **Email report**: `node scripts/generate-email-mac.js` → produces `email-body.html`
- **TestRail**: `node scripts/report-mac-to-testrail.js` → posts results to TestRail
- **CI**: `.github/workflows/mac-hp-app-tests.yml` runs on `macos-latest`

---

## Troubleshooting Quick Reference

| Symptom | Fix |
|---------|-----|
| `Accessibility not granted` | System Settings → Privacy & Security → Accessibility → add Terminal |
| App not found | `mdfind "kMDItemCFBundleIdentifier == 'com.hp.SmartForDesktop'"` |
| Appium not responding | `npm run appium:mac:start` (kills existing on 4724 first) |
| mac2 driver missing | `npm run appium:install:mac` |
| Wrong element type | Open Accessibility Inspector, check element type, use correct `XCUIElementType*` |
| Label not matching | Accessibility label ≠ visual text — verify with Accessibility Inspector |
| CI test install fails | Check `APPLE_ID` / `APPLE_PASSWORD` secrets in GitHub repo settings |
