# Application Context — Windows App Automation

> **How to use this file**: This file is loaded first in every Windows agent session.
> It provides the app AUMID, screen inventory, and known locator values
> verified against the live UIAutomation accessibility tree.

---

## Base Configuration

**Framework Runner**: WebDriverIO (WDIO) v9 + Appium + WinAppDriver
**App Name**: `HP App (myHP)`
**AUMID (UWP / Store)**: `AD2F1837.myHP_v10z8vjag6ke6!App`
**Platform**: `Windows 10 / 11`
**Architecture**: UWP wrapper with WebView2 inner content
**Environment**: Production (Microsoft Store app)
**Config file**: `wdio.windows.config.js` at project root

---

## Launch Preconditions

Before running any Windows test:
1. **Developer Mode ON** → Settings → Update & Security → For Developers → Developer Mode ON
2. **WinAppDriver installed** → `C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe`
3. **Appium running** → `npm run appium:start` (port 4723, shared with MobileWright)
4. **HP App installed** → Microsoft Store; verify with `Get-StartApps | Where Name -like "*HP*"`

---

## UIAutomation Accessibility Note

The HP app is a **WebView2-wrapped UWP** app. This means:
- The native UWP window chrome (title bar, min/max/close buttons, system tray) IS accessible via UIAutomation
- UI elements rendered inside the WebView2 panel are also accessible when they have `Name` attributes set
- Locator strategy: **XPath with `contains(@Name, ...)`** — more resilient than exact accessibility ID matches
- **Never** use `~ExactName` for HP app elements; always use XPath contains() patterns

---

## Screen Inventory

| Screen Name         | File Name Prefix   | Sentinel Element               | Verified Locator |
|---------------------|--------------------|--------------------------------|------------------|
| `Home`              | `hp-app-home`      | Window title contains "HP"     | `browser.getTitle()` |
| `Sign In / Account` | `hp-app-signin`    | Sign In button in top-right    | `//Button[contains(@Name,"Sign in")]` |
| `My Notebook`       | `hp-app-notebook`  | "My Notebook" heading          | `//*[contains(@Name,"My Notebook")]` |
| `Shop`              | `hp-app-shop`      | Shopping button in nav bar     | `//Button[contains(@Name,"Shop")]` |

---

## Navigation Structure

```
Launch (AUMID)
  └── Home Screen
        ├── Top nav: Shopping, Add, Notifications, Account (right side)
        ├── Top nav: Sign In button (top right)
        └── Main content: My Notebook section
              ├── Device model text (HP EliteBook...)
              └── Battery / charging status indicator
```

---

## Known Verified Locators (as of 2026-05-17)

> All locators verified against live accessibility tree via Appium session.
> Use **XPath** locators exclusively for this app (WebView2 rendering).

| Screen  | Element              | Locator Strategy | Locator Value |
|---------|----------------------|------------------|---------------|
| Home    | Window title check   | `browser.getTitle()` | must contain `"hp"` (case-insensitive) |
| Nav bar | Sign In button       | xpath | `//Button[contains(@Name,"Sign in") or contains(@Name,"Sign In")]` |
| Nav bar | Shopping icon        | xpath | `//Button[contains(@Name,"Shop")]` |
| Nav bar | Add icon             | xpath | `//Button[contains(@Name,"Add")]` |
| Nav bar | Notifications icon   | xpath | `//Button[contains(@Name,"Notification")]` |
| Nav bar | Account icon         | xpath | `//Button[contains(@Name,"Account")]` |
| Content | My Notebook heading  | xpath | `//*[contains(@Name,"My Notebook")]` |
| Content | EliteBook model name | xpath | `//*[contains(@Name,"EliteBook")]` |
| Content | Battery/charge status| xpath | `//*[contains(@Name,"Charging") or contains(@Name,"Battery")]` |
| Chrome  | Window close button  | xpath | `//Button[@Name="Close"]` |

---

## Test Data File

**Location**: `src/windows/data/hp-app-test-data.js`

```js
module.exports = {
  app: {
    name: 'HP App',
    aumid: 'AD2F1837.myHP_v10z8vjag6ke6!App',
    windowTitleContains: 'hp',
    deviceModel: 'EliteBook',
  },
  timeouts: {
    appLaunch:   20000,
    elementVisible: 10000,
    navigation:  15000,
  },
  selectors: {
    signInButton:  '//Button[contains(@Name,"Sign in") or contains(@Name,"Sign In")]',
    myNotebook:    '//*[contains(@Name,"My Notebook")]',
    eliteBookModel:'//*[contains(@Name,"EliteBook")]',
    batteryStatus: '//*[contains(@Name,"Charging") or contains(@Name,"Battery")]',
  },
};
```
