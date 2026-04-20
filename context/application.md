# Application Context - OCBC Bank Singapore

## Base Configuration

**Target URL**: https://www.ocbc.com/group/gateway
**Personal Banking URL**: https://www.ocbc.com/personal-banking
**Business Banking URL**: https://www.ocbc.com/business-banking
**Application Type**: Banking & financial services website
**Environment**: Production
**Domain**: OCBC Bank Singapore — full-service banking

---

## Gateway Page Structure

The gateway page at `https://www.ocbc.com/group/gateway` is the entry point to OCBC's digital presence. It provides navigation to different banking segments.

### Gateway Segments

| Segment | URL |
|---|---|
| Personal Banking | https://www.ocbc.com/personal-banking |
| Business Banking | https://www.ocbc.com/business-banking |
| Premier Banking | https://www.ocbc.com/premier-banking |
| FRANK by OCBC | https://www.frankbyocbc.com |
| OCBC Securities | https://www.iocbc.com |
| Group Corporate | https://www.ocbc.com/group/who-we-are |

---

## Top-Level Navigation — Personal Banking

The personal banking section at `https://www.ocbc.com/personal-banking` has navigation tabs/mega menus for banking product categories.

---

### Tab 1: Accounts

**Page Object**: `src/pages/ocbc-accounts-nav.page.js`
**Locators**: `src/pages/locators/ocbc-accounts-nav.locators.js`

| Link Text | URL |
|---|---|
| Savings Accounts | https://www.ocbc.com/personal-banking/deposits/savings-accounts |
| Current Accounts | https://www.ocbc.com/personal-banking/deposits/current-accounts |
| Fixed Deposits | https://www.ocbc.com/personal-banking/deposits/fixed-deposits |
| 360 Account | https://www.ocbc.com/personal-banking/deposits/360-account |
| Statement Savings Account | https://www.ocbc.com/personal-banking/deposits/statement-savings-account |
| Compare Accounts | https://www.ocbc.com/personal-banking/deposits/compare-accounts |

---

### Tab 2: Cards

**Page Object**: `src/pages/ocbc-cards-nav.page.js`
**Locators**: `src/pages/locators/ocbc-cards-nav.locators.js`

| Link Text | URL |
|---|---|
| Credit Cards | https://www.ocbc.com/personal-banking/cards/credit-cards |
| Debit Cards | https://www.ocbc.com/personal-banking/cards/debit-cards |
| 365 Credit Card | https://www.ocbc.com/personal-banking/cards/credit-cards/365-credit-card |
| Titanium Rewards Card | https://www.ocbc.com/personal-banking/cards/credit-cards/titanium-rewards |
| 90°N Card | https://www.ocbc.com/personal-banking/cards/credit-cards/90n-card |
| Compare Cards | https://www.ocbc.com/personal-banking/cards/compare-cards |

---

### Tab 3: Loans

**Page Object**: `src/pages/ocbc-loans-nav.page.js`
**Locators**: `src/pages/locators/ocbc-loans-nav.locators.js`

| Link Text | URL |
|---|---|
| Home Loans | https://www.ocbc.com/personal-banking/loans/home-loans |
| Renovation Loans | https://www.ocbc.com/personal-banking/loans/renovation-loans |
| Car Loans | https://www.ocbc.com/personal-banking/loans/car-loans |
| Personal Loans | https://www.ocbc.com/personal-banking/loans/personal-loans |
| Education Loans | https://www.ocbc.com/personal-banking/loans/education-loans |
| Refinancing | https://www.ocbc.com/personal-banking/loans/refinancing |

---

### Tab 4: Investments

**Page Object**: `src/pages/ocbc-investments-nav.page.js`
**Locators**: `src/pages/locators/ocbc-investments-nav.locators.js`

| Link Text | URL |
|---|---|
| Unit Trusts | https://www.ocbc.com/personal-banking/investments/unit-trusts |
| Stocks & Shares | https://www.ocbc.com/personal-banking/investments/stocks-shares |
| Bonds | https://www.ocbc.com/personal-banking/investments/bonds |
| RoboInvest | https://www.ocbc.com/personal-banking/investments/roboinvest |
| Structured Deposits | https://www.ocbc.com/personal-banking/investments/structured-deposits |
| SRS Investments | https://www.ocbc.com/personal-banking/investments/srs |

---

### Tab 5: Insurance

**Page Object**: `src/pages/ocbc-insurance-nav.page.js`
**Locators**: `src/pages/locators/ocbc-insurance-nav.locators.js`

| Link Text | URL |
|---|---|
| Life Insurance | https://www.ocbc.com/personal-banking/insurance/life-insurance |
| Health Insurance | https://www.ocbc.com/personal-banking/insurance/health-insurance |
| Travel Insurance | https://www.ocbc.com/personal-banking/insurance/travel-insurance |
| Car Insurance | https://www.ocbc.com/personal-banking/insurance/car-insurance |
| Home Insurance | https://www.ocbc.com/personal-banking/insurance/home-insurance |
| Great Eastern | https://www.greateasternlife.com |

---

### Tab 6: Digital Banking

**Page Object**: `src/pages/ocbc-digital-nav.page.js`
**Locators**: `src/pages/locators/ocbc-digital-nav.locators.js`

| Link Text | URL |
|---|---|
| OCBC Digital App | https://www.ocbc.com/personal-banking/digital-banking/ocbc-digital |
| Internet Banking | https://www.ocbc.com/personal-banking/digital-banking/internet-banking |
| PayAnyone | https://www.ocbc.com/personal-banking/digital-banking/payanyone |
| OCBC OneAdvisor | https://www.ocbc.com/personal-banking/digital-banking/oneadvisor |
| e-Statements | https://www.ocbc.com/personal-banking/digital-banking/e-statements |

---

## Key Application Pages

| Page | URL |
|---|---|
| Gateway (entry) | https://www.ocbc.com/group/gateway |
| Personal Banking Home | https://www.ocbc.com/personal-banking |
| Credit Cards Listing | https://www.ocbc.com/personal-banking/cards/credit-cards |
| Home Loans | https://www.ocbc.com/personal-banking/loans/home-loans |
| Savings Accounts | https://www.ocbc.com/personal-banking/deposits/savings-accounts |
| Rates & Charges | https://www.ocbc.com/personal-banking/rates |
| Promotions | https://www.ocbc.com/personal-banking/promotions |
| Internet Banking Login | https://internet.ocbc.com/internet-banking/ |

---

## Application Routes & Navigation

### Key Navigation Paths
1. **Savings Account Flow**:
   - Gateway → Personal Banking → Accounts → Savings Accounts → Account Details → Apply
2. **Credit Card Flow**:
   - Gateway → Personal Banking → Cards → Credit Cards → Card Details → Apply
3. **Home Loan Flow**:
   - Gateway → Personal Banking → Loans → Home Loans → Calculator → Apply
4. **Investment Flow**:
   - Gateway → Personal Banking → Investments → Unit Trusts / RoboInvest → Details
5. **Insurance Flow**:
   - Gateway → Personal Banking → Insurance → Life/Health/Travel → Quote → Apply
6. **Digital Banking Flow**:
   - Gateway → Personal Banking → Digital Banking → OCBC Digital / Internet Banking
6. **Membership Flow**:
   - Home → Membership (dropdown) → Membership Tiers

### Page Loading Characteristics
- **Initial load time**: 3-5 seconds for product pages
- **JavaScript heavy**: SPA-style navigation with dynamic content loading
- **Cookie consent**: Dismissed once by `globalSetup` before any test runs; storage state saved to `playwright/.auth/storageState.json`
- **Network requests**: Heavy API usage for product data

## Key UI Elements & Selectors

### Navigation
- **Mobile dropdown button**: `button[text="Mobile"]`
- **All Phones link**: `link[text="All Phones"]`
- **Breadcrumb navigation**: Present on all product pages
- **Cookie consent button**: `button[text="Got it"]` (handled by globalSetup; page objects retain try/catch as safety net)

### Product Listing Page
- **Device cards**: Grid layout with product images, names, pricing
- **Filters sidebar**: Brand, features, price range controls
- **Sort dropdown**: Various sorting options (newest, price, popularity)
- **Total items display**: Shows count of available devices
- **Samsung Galaxy A57 5G**: First product in "New" section

### Product Detail Page
- **Color selector**: Defaults to "Awesome Navy"
- **Storage selector**: Multiple options with 256GB default
- **Payment options**: 24-month (default), 12-month, Pay today
- **Next button**: Primary CTA for purchase flow
- **Add-ons**: SmartSupport optional service
- **Price display**: Format `$XX.XX/mthx24 mths`

### Authentication Elements (Expected)
- **Login popup/modal**: Triggered after "Next" button click
- **Hub ID login button**: Primary authentication method
- **Sign up link**: Account creation option
- **Login message**: "Please log in or create an account to continue with your purchase"

## Application-Specific Rules

### Element Stability
- Product cards use dynamic ref IDs but stable text selectors
- Navigation uses consistent button/link text
- Price formatting: `from $XX.XX/mth or $XXX.XX` pattern
- Color/storage options use clickable text selectors

### Data Validation Points
- **Product pricing**: Format `from $29.08/mth or $698.00`
- **Color options**: Text-based selection (e.g., "Awesome Navy")
- **Storage options**: GB-based values (256GB default)
- **Payment terms**: Monthly installment calculations

### Error Handling
- **Slow loading**: Pages may take 3-5 seconds to fully render
- **Cookie consent**: Dismissed by globalSetup before test run; page objects retain fallback dismissal for stale storage
- **Dynamic content**: Wait for product data to load before assertions

## Environment Configuration

### Timeouts
- **Page load**: 60 seconds (heavy JS/API loading)
- **Element wait**: 15 seconds (dynamic content)
- **Network wait**: 30 seconds (API-heavy application)

### Browser Configuration
- **Viewport**: 1920x1080 (desktop-optimized)
- **User agent**: Default Chromium
- **JavaScript**: Required (SPA application)
- **Cookies**: Required for session management

## Selector Priority Strategy
1. **Text-based selectors**: `getByRole('button', { name: 'Mobile' })`
2. **Link selectors**: `getByRole('link', { name: 'All Phones' })`
3. **Exact text matching**: For device names and pricing
4. **Ref-based selectors**: As fallback for dynamic elements
4. Stable CSS: class names like `.hero-title`, `.hero-subtitle`, `.product-card`
5. Avoid: XPath, index-based selectors, brittle positional selectors

## Environment Notes
- This is a lower/unstable Azure-hosted environment
- Cold start delays possible — always use `waitFor` with 15000ms timeout
- Use `waitUntil: 'domcontentloaded'` for navigation (not `load`)
- Products page uses async data fetch — wait for product cards to appear before asserting
- Run `goto()` with `timeout: 60000` to handle cold starts

## Known User Journeys
1. **Welcome / Homepage verification** — Load homepage, verify hero title, subtitle, feature cards visible above fold
2. **Product discovery** — Navigate to /products, wait for products to load, verify product cards appear
3. **Add to cart** — On products page, click "Add to Cart" on a product, verify cart count increments
4. **Cart review** — Navigate to /cart, verify cart contents or empty state
5. **Navigation smoke** — Verify all nav links (Home, Products, Cart) are visible and functional
