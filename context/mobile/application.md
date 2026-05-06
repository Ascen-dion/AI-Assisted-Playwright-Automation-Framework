# Application Context — Mobile App Under Test

> **How to use this file**: Replace every `<placeholder>` value with the real app details before
> running the mobile brownfield agent. This file is loaded first in every agent session.

---

## Base Configuration

**App Name**: `<AppName>`
**Bundle ID (Android)**: `<com.example.app>`
**Bundle ID (iOS)**: `<com.example.app>` _(if applicable)_
**Platform**: `android` | `ios` | `both`
**App Version Under Test**: `<x.y.z>`
**Environment**: `production` | `staging` | `uat`
**APK / IPA Path**: `mobile/apk/<filename>.apk`

---

## Device / Emulator Configuration

**Primary Test Device**: `<emulator name or physical device model>`
**OS Version**: `<Android 14 / iOS 17>`
**Screen Resolution**: `<e.g. 1080x2400>`
**Device ID** _(from `mobile_list_available_devices`)_: `<emulator-5554>`

---

## App Entry Point

**Launch behaviour**: _(describe what appears on cold start — e.g. splash screen, onboarding, login)_

```
<Describe the initial screen the app shows on first launch and after a fresh install>
```

**Sign-in / Consent prompt**: _(describe any overlay that must be dismissed before testing begins)_

```
<Describe how to dismiss the sign-in / consent prompt, or state "none" if not applicable>
```

---

## Screen Inventory

List every screen (or major view) that the app exposes. For each screen, note:
- The screen name used in page object file names
- The sentinel element (most stable element that confirms the screen is loaded)
- The `content-desc` or `text` value of the sentinel

| Screen Name | File Name Prefix | Sentinel Element | Sentinel Selector |
|---|---|---|---|
| `<HomeScreen>` | `<appName>-home` | `<content-desc value>` | `screen.getByLabel('<value>')` |
| `<LoginScreen>` | `<appName>-login` | `<content-desc value>` | `screen.getByLabel('<value>')` |
| `<SearchScreen>` | `<appName>-search` | `<content-desc value>` | `screen.getByLabel('<value>')` |
| _(add rows as needed)_ | | | |

---

## Navigation Flows

Describe the primary navigation paths between screens:

```
Launch
  └── <HomeScreen>
        ├── <tap X> → <ScreenA>
        ├── <tap Y> → <ScreenB>
        └── <tap Z> → <ScreenC>
```

---

## Known Stable Selectors

Document any selectors already verified against the live accessibility tree:

| Screen | Element | Selector Method | Selector Value |
|---|---|---|---|
| `<HomeScreen>` | `<element description>` | `getByLabel` | `'<content-desc value>'` |
| `<HomeScreen>` | `<element description>` | `getByText` | `'<text value>'` |
| _(add rows as needed)_ | | | |

---

## Deep Links

If the app supports deep links, list them here:

| Screen | Deep Link URL |
|---|---|
| `<ScreenName>` | `<appscheme://path>` |

---

## Known Issues / Flaky Areas

Document any known instabilities to account for in test design:

- _(e.g. Splash screen takes up to 8 seconds on cold start — use `TD.timeouts.appLaunch`)_
- _(e.g. Sign-in prompt does not always appear — wrap dismiss in try/catch)_

---

## Navigation Locator Notes

- The **navbar logo** uses `<a href="/en">` with `img alt="Navbar logo"`
- The **Products** nav item is a `div` with class `styles_menu_item_anchor__f62GR` (not an `<a>` tag) — interact via `page.getByText('Products').first()`
- The **Loan Payment Guides** nav item is also a `div` — interact via `page.getByText('Loan Payment Guides').first()`
- The **Promos** nav item is also a `div` — interact via `page.getByText('Promos').first()`
- Dropdown links become visible after clicking the parent nav item (they are `<a>` tags once open)
- Language toggle button text: `ENG` or `FIL`
- Cookie/privacy consent: `button` with text "I understand" — appears on first visit

---

## Environment Notes

- **Timeout recommendation**: `waitUntil: 'domcontentloaded', timeout: 60000`
- **Cookie consent**: appears on first visit — handle in `beforeEach` try/catch with `getByRole('button', { name: /i understand/i })`
- **Cold-start**: allow up to 15s for elements to appear after navigation
- **Language**: default is English (ENG) — tests should run in English locale
- **Mobile-first**: site has responsive layout; desktop viewport (1280×720) recommended for tests
- **SPA**: Next.js app; navigation may not trigger full page reload