# Domain Knowledge — Windows App Automation

## Business Domain

This context file covers Windows desktop app automation for the **HP myHP** app
and any future Windows apps added to the framework.

---

## HP App (myHP) — Domain Rules

**App Purpose**: HP's companion app for HP PCs. Shows device health, warranty,
support tickets, accessories (Shop), software (My Stuff), and account management.

**Target Users**: HP PC owners who have the app pre-installed or download from
Microsoft Store.

**Architecture Note**: UWP wrapper with WebView2 inner panel. Elements rendered
inside the WebView2 zone ARE accessible via UIAutomation when HP sets `aria-label`
/ `accessibleName` attributes on interactive controls. Always verify with
`windows_list_elements` MCP tool before assuming an element is unreachable.

---

## Core Features / Screens

| Feature / Screen     | Description | Key Verification Points |
|----------------------|-------------|------------------------|
| Home (My Notebook)   | Shows device model, battery status, health summary | Window title contains "HP"; My Notebook section visible; battery status readable |
| Sign In / Account    | Unauthenticated state shows "Sign in" button top-right | `Sign in` button is visible; clicking navigates to account auth flow |
| Shop                 | Accessories and software purchase | Shopping icon in nav bar visible |
| Notifications        | Support alerts and update notices | Bell icon visible; click opens notification panel |
| Add (My Stuff)       | Software catalogue / install | Plus icon visible in nav bar |

---

## Business Rules for Test Generation

- **Unauthenticated state**: All smoke tests run without signing in.
  The "Sign in" button MUST be visible on the top-right nav bar when not logged in.
- **Battery status**: Shows "Charging X%" or "X% remaining". The percentage
  changes each run — never assert the exact number. Always use `contains` matching.
- **Device model**: The "My Notebook" section shows the exact HP model name.
  Use `contains(@Name, "EliteBook")` rather than the full model string to stay
  resilient across device-specific wording.
- **Window title**: The OS-level window title is always accessible via
  `browser.getTitle()` even when inner WebView2 content is slow to load.
  Use this as the sentinel for home screen load verification.
- **Navigation icons**: The top bar always shows Shopping, Add, Notifications,
  and Account/Sign-In icons. If any icon is missing, the test should fail.

---

## Acceptance Criteria Patterns

```
Given the HP app is launched (AUMID: AD2F1837.myHP_v10z8vjag6ke6!App)
When the home screen loads
Then the window title contains "HP"
And the "Sign in" button is visible in the top-right navigation bar
```

```
Given the HP app is on the home screen
When the My Notebook section is inspected
Then an element with Name containing "EliteBook" is visible
And a battery status element with Name containing "Charging" or "Battery" is visible
```

---

## Test Case ID Format

- Windows HP app: `TC-WIN-HP-NNN`
- Windows general / cross-app: `TC-WIN-NNN`
- Notepad sanity: `TC-WIN-NPD-NNN`

---

## Adding New Windows Apps

When automating a new Windows app:

1. **Find the AUMID** (Store apps): `Get-StartApps | Where-Object { $_.Name -like "*AppName*" }`
2. **Find the exe path** (Win32): `Get-Command AppName.exe | Select-Object -ExpandProperty Source`
3. **Inspect the accessibility tree**: Use `windows_list_elements` MCP tool or Accessibility Insights
4. **Create data file**: `src/windows/data/<appName>-test-data.js`
5. **Create locators**: `src/windows/locators/<appName>-<screen>.locators.js`
6. **Create screen object**: `src/windows/screens/<appName>-<screen>.screen.js`
7. **Create spec**: `src/windows/tests/<appName>-<feature>.spec.js`
8. **Add npm script** in `package.json`: `"test:windows:<appName>": "cross-env WINDOWS_APP=\"<aumid or path>\" wdio run wdio.windows.config.js --spec src/windows/tests/<appName>-*.spec.js"`
