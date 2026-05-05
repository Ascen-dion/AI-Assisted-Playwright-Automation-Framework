# Domain Knowledge — UnionDigital Bank Philippines

## Business Domain
UnionDigital Bank Philippines — a BSP-licensed digital bank subsidiary of UnionBank of the Philippines and a member of the Aboitiz Group. It empowers Filipinos with accessible, mobile-first banking services.

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

