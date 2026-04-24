# Application Context - UnionDigital Bank Philippines

## Base Configuration

**Target URL**: https://uniondigitalbank.io/en
**UD Save URL**: https://uniondigitalbank.io/en/products-savings
**UD Time Deposit URL**: https://uniondigitalbank.io/en/products-time-deposit
**Application Type**: Digital banking website (mobile-first, Next.js)
**Environment**: Production
**Domain**: UnionDigital Bank Philippines — BSP-licensed digital bank

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

