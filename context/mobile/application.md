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

## Homepage Structure

The homepage at `https://uniondigitalbank.io/en` is the main entry point. It is a
single-page marketing site that promotes the UD mobile banking app.

### Homepage Sections (anchor IDs)

| Anchor ID | Heading |
|---|---|
| `#homepage-banner` | "Empowering Every Filipino, EVERYWHERE!" |
| `#homepage-awards` | "Magtiwala sa Pinalaki nang Tama!" |
| `#homepage-products` | "High Earnings sa Aming High-Interest Accounts" |
| `#homepage-download` | "Mag-bank na with the UBEH bank" |

---

## Top-Level Navigation

### Products Dropdown

**Page Object**: `src/pages/ud-products-nav.page.js`
**Locators**: `src/pages/locators/ud-products-nav.locators.js`

| Link Text | URL |
|---|---|
| UD Save | https://uniondigitalbank.io/en/products-savings |
| UD Time Deposit | https://uniondigitalbank.io/en/products-time-deposit |
| UD Loan Protect Insurance | https://uniondigitalbank.io/en/products-ud-loan-protect-insurance |
| In App Helpdesk | https://uniondigitalbank.io/en/products-inapp-ticket |
| Rates & Fees | https://uniondigitalbank.io/en/product-rates-fees |

---

### Loan Payment Guides Dropdown

| Link Text | URL |
|---|---|
| UD Cash Loans | https://uniondigitalbank.io/en/guides-ud-cash-loans |
| UD Loans | https://uniondigitalbank.io/en/guides-ud-loans |

---

### Promos Dropdown

| Link Text | URL |
|---|---|
| Kaya Mo Jingle Contest | https://uniondigitalbank.io/en/promo-kaya-mo-jingle-ugc |
| QRPH Cashback | https://uniondigitalbank.io/en/promo-qrph-cashback |
| Cashback Kada Bayad | https://uniondigitalbank.io/en/promo-cashback-kada-bayad |
| Doble Ka-UD | https://uniondigitalbank.io/en/promo-doble-ka-ud |
| Ipon Mode Challenge On | https://uniondigitalbank.io/en/promo-ipon-mode-challenge-on |
| Free InstaPay Transfers | https://uniondigitalbank.io/en/uniondigital-free-instapay-promo |

---

### Top-Level Links

| Link Text | URL |
|---|---|
| About Us | https://uniondigitalbank.io/en/about-us |
| Usapang Diskarte | https://uniondigitalbank.io/en/learn |
| Help Center | https://uniondigitalbank.io/en/faqs |

---

## Product Pages

### UD Save Account (`/en/products-savings`)

**Page Object**: `src/pages/ud-save-nav.page.js`
**Locators**: `src/pages/locators/ud-save-nav.locators.js`
**Page Title**: "UnionDigital Bank | Savings"

| Element | Value |
|---|---|
| Hero heading | "UD Save Account" |
| Sub-heading | "Your all-in-one account para sa 'yong savings and payment" |
| Feature 1 | "Mag-ipon lang sa account mo and enjoy high interest rates" |
| Feature 2 | "Goodbye na sa mahabang pila! Pay your bills quickly and conveniently from your phone" |

---

### UD Time Deposit (`/en/products-time-deposit`)

**Page Title**: "Time Deposit | UnionDigital Bank"
**Description**: "Palaguin ang pera with our competitive time deposit rates!"

---

## Footer Links

| Link Text | URL |
|---|---|
| About Us | https://uniondigitalbank.io/about-us |
| Help Center | https://uniondigitalbank.io/faqs |
| Terms & Conditions | https://uniondigitalbank.io/terms-and-conditions |
| Privacy Statement | https://uniondigitalbank.io/privacy-statement |
| Privacy Notice | https://uniondigitalbank.io/privacy-policy |
| Disclosures | https://uniondigitalbank.io/disclosures |
| Customer Feedback Mechanism | https://uniondigitalbank.io/customer-feedback-mechanism |

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

