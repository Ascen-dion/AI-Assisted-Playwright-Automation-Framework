# Domain Knowledge — Mobile App Under Test

> **How to use this file**: Replace all placeholder content with real domain knowledge for the app
> under test. This file is read by the agent to generate meaningful, accurate test assertions.

---

## Business Domain

**App Name**: `<AppName>`
**Business Category**: _(e.g. e-commerce, banking, media, productivity, health, travel)_
**Target Users**: _(e.g. retail customers, enterprise employees, general public)_
**Primary Purpose**: _(one-sentence description of what the app does)_

---

## Core Features / Modules

List each major feature or module the app exposes. For each, describe what it does and what a
passing test should verify:

| Feature / Module | Description | Key Verification Points |
|---|---|---|
| `<FeatureName>` | _(what it does)_ | _(observable outcomes a test should assert)_ |
| `<FeatureName>` | _(what it does)_ | _(observable outcomes a test should assert)_ |
| _(add rows as needed)_ | | |

---

## Business Rules

Document rules that affect how tests should be written:

- _(e.g. "A user must be logged in to access the account screen")_
- _(e.g. "Search results are only shown after the user types at least 2 characters")_
- _(e.g. "The checkout flow has 3 steps: Cart → Address → Payment")_
- _(add rules as needed)_

---

## Acceptance Criteria Patterns

Common AC shapes used in this project's Jira stories:

```
Given the app is launched and the home screen is visible
When the user taps <element>
Then <observable outcome>
```

```
Given the user is on <ScreenName>
When the user types "<query>" into the search input and submits
Then search results matching "<query>" are displayed
```

---

## Test Data Requirements

List values that tests need to assert against. These should be added to
`mobile/data/<appName>-test-data.js`:

| Category | Key | Example Value | Notes |
|---|---|---|---|
| `app` | `bundleId` | `com.example.app` | Package name |
| `<screen>` | `<labelKey>` | `'Exact Label Text'` | Verified against accessibility tree |
| `timeouts` | `appLaunch` | `40000` | Cold start timeout in ms |
| _(add rows)_ | | | |

---

## Edge Cases to Test

- _(e.g. "No network connection — verify offline error message is shown")_
- _(e.g. "Empty state — verify placeholder message appears when list has no items")_
- _(e.g. "Long text input — verify field truncates correctly")_
- _(add edge cases as needed)_

---

## Out of Scope

Features explicitly excluded from automated test coverage:

- _(e.g. "Payment processing — covered by manual tests only")_
- _(e.g. "Push notification delivery — not automatable via Mobilewright")_


## Core Business Concepts

### Account Products
- **UD Save Account**: All-in-one savings and payment account with high interest rates. Pay, spend, transfer, and save via mobile app.
- **UD Time Deposit**: Competitive time deposit rates for growing savings over fixed periods.

### Loan Products
- **UD Cash Loans**: Digital cash loan product accessible via the UD app (UBEH Cash Loan).
- **UD Loans**: General loan product offerings available through the digital platform.
- **UD Loan Protect Insurance**: Insurance coverage tied to loan products.

### Digital Banking Features
- **Pay Bills**: Bill payments conveniently from the mobile app.
- **Send & Receive Money**: InstaPay transfers and QR code payments (QRPH).
- **In-App Helpdesk**: Support ticket system accessible within the app.

### Key Trust Indicators
- **BSP Regulated**: Licensed by Bangko Sentral ng Pilipinas.
- **PDIC Insured**: Deposits insured by Philippine Deposit Insurance Corporation up to PHP 1 million per depositor.
- **UnionBank Subsidiary**: Backed by UnionBank of the Philippines (a trusted universal bank).

### Promotions
- **QRPH Cashback**: Cashback rewards on QR payments.
- **Cashback Kada Bayad**: Cashback on bill payments.
- **Doble Ka-UD**: Double rewards promotion.
- **Ipon Mode Challenge On**: Savings challenge promotion.
- **Free InstaPay Transfers**: Zero-fee InstaPay promotion.

### Customer Journey Requirements
1. **App Discovery**: Visit website, learn about products, download app.
2. **Account Opening**: Register via mobile app with government ID.
3. **Product Exploration**: Browse UD Save, Time Deposit, and Loan products on website.
4. **Navigation**: Use Products dropdown to navigate between product pages.
5. **Support**: Use Help Center (FAQs) or In-App Helpdesk for assistance.

### Business Validation Points
- **Navigation Integrity**: All nav links resolve to correct product pages.
- **Product Page Content**: Hero headings, descriptions, and feature text are visible and accurate.
- **Download CTAs**: App store links are visible and functional.
- **Footer Links**: All policy and legal links are accessible.
- **Language Toggle**: ENG/FIL language switching works correctly.
- **Cookie Consent**: Privacy notice "I understand" button dismisses the consent banner.

## Test Data Requirements
- **Product Details**: Page titles, headings, feature text sourced from `src/data/test-data.js`
- **URLs**: All assertion URLs must reference `TD.urls.*`
- **URL Patterns**: Regex patterns for `toHaveURL()` from `TD.urlPatterns.*`

## Test Data Rules
- All assertion values (product names, URLs, page titles) must be sourced from `src/data/test-data.js`
- Never hardcode strings in specs — always use `TD.*`
- `src/data/test-data.js` exports: `urls`, `urlPatterns`, `products`, `pageTitles`

## Edge Cases to Cover
- Cookie consent banner rotation — handle in every beforeEach with try/catch
- Language toggle — tests run in ENG locale by default
- Dropdown nav items are `div` elements, not `<a>` tags — clicking them reveals sub-links
- Mobile hamburger menu may appear at narrow viewports — use desktop (1280×720)
- App download buttons link to onelink.me (affiliate redirect) — verify visibility only, not final destination
- Page content is Taglish (mixed Tagalog/English) — assertion text must match exactly

