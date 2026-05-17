# Domain Knowledge — macOS App Automation

## Business Domain

This context file covers macOS desktop app automation for the **HP Smart** app
and any future macOS apps added to the framework.

---

## HP Smart (macOS) — Domain Rules

**App Purpose**: HP's companion app for macOS. Allows users to set up printers,
scan documents, print files, manage ink/toner levels, and access HP support.

**Target Users**: macOS users with HP printers — home and office environments.

**Architecture Note**: HP Smart for Desktop is distributed via Mac App Store.
It is sandboxed and uses native macOS accessibility APIs exposed via XCTest.
Elements are accessible when they have `accessibilityLabel` / `accessibilityIdentifier`
attributes set in the app's SwiftUI / AppKit layer.

---

## Core Features / Screens

| Feature / Screen  | Description | Key Verification Points |
|-------------------|-------------|------------------------|
| Home              | Landing screen after launch | Main window visible; navigation items present |
| Sign In           | Unauthenticated state shows "Sign In" button | `Sign In` button visible; not signed in by default in smoke tests |
| My Printers       | Printer list and status overview | Nav item "My Printers" visible; status indicator present |
| Scan              | Document/photo scanning via connected HP printer | Nav item "Scan" visible |
| Print             | Print documents from macOS | Nav item "Print" visible |

---

## Business Rules for Test Generation

- **Unauthenticated state**: All smoke tests run without signing in.
  The "Sign In" button MUST be visible on the home screen when not logged in.
- **Printer status**: Shows printer as online/offline. The exact label changes based on
  the printer connected. Never assert the exact printer name — use `contains(@label, ...)`.
- **Nav items**: The navigation always shows My Printers, Scan, Print.
  If any nav item is missing, the test MUST fail.
- **Sandbox restrictions**: The app runs sandboxed — no file system or network access
  outside its container. This does NOT affect UI automation.
- **Accessibility first launch**: On first launch after OS install, macOS may show a
  system permission dialog. The screen object MUST handle this via `dismissOnboardingIfPresent()`.

---

## Acceptance Criteria Patterns

```
Given HP Smart is installed (Bundle ID: com.hp.SmartForDesktop)
And Appium is running on port 4724
When the app is launched via wdio.mac.config.js
Then the main window is visible
And the Sign In button is visible
And all navigation items are accessible (My Printers, Scan, Print)
And the My Printers section heading is displayed
And a printer status indicator element is present
```

---

## Test ID Convention

macOS tests use the prefix `TC-MAC-HP-NNN`:

```
[TC-MAC-HP-001] should launch HP Smart and display the home screen
[TC-MAC-HP-002] should display the Sign In button on the home screen
[TC-MAC-HP-003] should display the correct label on the Sign In button
[TC-MAC-HP-004] should display all main navigation items (Printers, Scan, Print)
[TC-MAC-HP-005] should display the My Printers section
[TC-MAC-HP-006] should display the printer status indicator
```

For new apps on macOS, use `TC-MAC-<APPCODE>-NNN`.

---

## macOS-Specific Failure Modes

| Failure | Cause | Fix |
|---------|-------|-----|
| `An unknown server-side error occurred` | Accessibility permission not granted to Terminal/Node | System Settings → Accessibility → add Terminal/Node |
| `Application is not running` | App not installed or bundle ID wrong | `mdfind "kMDItemCFBundleIdentifier == 'com.hp.SmartForDesktop'"` |
| `Element not found` | Locator uses wrong XCUIElementType or wrong label | Verify with Xcode Accessibility Inspector |
| `Session not created` | Appium not running or wrong port | `npm run appium:mac:start` (port 4724) |
| `Could not connect to mac2` | mac2 driver not installed | `npm run appium:install:mac` |
| Privacy dialog blocking | First-run macOS system permission dialog | `dismissOnboardingIfPresent()` in screen object |
