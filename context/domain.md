# Domain Knowledge — Banking & Financial Services

## Business Domain
OCBC Bank Singapore — a leading financial services group offering personal banking, business banking, premier banking, wealth management, and insurance products to retail and corporate customers.

## Core Business Concepts

### Account Opening Process
- **Account Selection**: Browse savings, current, and fixed deposit accounts
- **Eligibility Check**: Age, residency, minimum deposit requirements
- **Application Form**: Personal details, income declaration, identification documents
- **Authentication Required**: SingPass MyInfo or manual verification for new customers
- **Approval**: Instant for basic accounts, 1-3 days for premium accounts

### Credit Card Application Process
- **Card Comparison**: Browse cards by rewards type (cashback, miles, rewards points)
- **Eligibility**: Minimum income requirements (typically $30K-$120K annual)
- **Application**: Online form with income proof
- **Card Categories**: Cashback, Travel/Miles, Rewards, Business, Student
- **Key Products**: 365 Credit Card (cashback), 90°N Card (travel), Titanium Rewards

### Loan & Mortgage Products
- **Home Loans**: Fixed rate, floating rate, SORA-pegged packages
- **Renovation Loans**: Up to $30,000 for HDB, higher for private property
- **Car Loans**: New and used car financing
- **Personal Loans**: EasiCredit personal line of credit
- **Calculators**: Loan eligibility, monthly repayment, refinancing comparison

### Investment Products
- **Unit Trusts**: Managed funds across various asset classes
- **Stocks & Shares**: Trading via iOCBC platform
- **Bonds**: Government and corporate bonds
- **RoboInvest**: Automated portfolio management
- **SRS**: Supplementary Retirement Scheme investments
- **Structured Deposits**: Principal-protected investments

### Insurance Products (via Great Eastern)
- **Life Insurance**: Term, whole life, endowment plans
- **Health Insurance**: Hospitalisation, critical illness, personal accident
- **Travel Insurance**: Single trip and annual plans
- **Motor Insurance**: Comprehensive and third-party coverage
- **Home Insurance**: Fire and contents protection

### Digital Banking
- **OCBC Digital App**: Mobile banking with PayAnyone, bill payments
- **Internet Banking**: Full-service online banking portal
- **PayAnyone**: P2P transfers via mobile number or QR code
- **OneAdvisor**: Digital financial planning tool

### Pricing and Rate Information
- **Interest Rates**: Savings rates, FD rates, loan rates (SORA-based)
- **Fees & Charges**: Card annual fees, account maintenance, loan processing
- **Promotional Rates**: Introductory offers on cards and deposits
- **Cashback Tiers**: Category-based cashback percentages on 365 Card

### Customer Journey Requirements
1. **Product Discovery**: Compare products via navigation and comparison tools
2. **Eligibility Assessment**: Check income/age/residency criteria
3. **Application**: Online form completion with document upload
4. **Verification**: SingPass MyInfo or manual identity verification
5. **Approval**: Instant or delayed based on product type
6. **Activation**: Card activation, account funding, first login

### Business Validation Points
- **Rate Accuracy**: Displayed rates match current published rates
- **Eligibility Criteria**: Income requirements correctly stated per product
- **Calculator Accuracy**: Loan/mortgage calculators produce correct results
- **Navigation Integrity**: All links resolve to correct product pages
- **Form Validation**: Required fields enforced, format validation active
- **Security**: Login redirects use HTTPS, session timeouts enforced

### Error States and Edge Cases
- **Ineligible Application**: User below income threshold shown rejection message
- **Session Timeout**: Internet banking session expires after inactivity
- **Rate Changes**: Promotional rates with expiry dates
- **Document Upload Failures**: File type/size validation errors
- **Calculator Edge Cases**: Zero values, maximum loan tenure exceeded
- **Cross-product Navigation**: Moving between personal and business banking segments

## Test Data Requirements
- **Product Details**: Current rates, fees, eligibility criteria
- **Test Accounts**: Demo/sandbox credentials for authenticated flows (if available)
- **Calculator Inputs**: Standard scenarios for loan/mortgage calculators
- **Card Categories**: Active card products for comparison testing

## Test Data Rules
- All assertion values (product names, rates, URLs, page titles) must be sourced from `src/data/test-data.js` — never hardcode them in specs
- `src/data/test-data.js` exports: `urls`, `urlPatterns`, `accounts`, `cards`, `loans`, `pageTitles`
- Add new entries to `src/data/test-data.js` whenever a spec introduces new string assertions or URL patterns
- Do not use shared test accounts — isolate per test run where possible
- If test data creates state (e.g. starts an application), clean up after or use a fresh session

## Edge Cases to Cover
- Promotional banner rotations — do not assert on carousel content that changes
- Rate update lag — cached rates vs live rates
- SingPass redirect flow — external authentication handoff
- Mobile-responsive navigation — mega menu vs hamburger menu
- Cross-domain navigation — www.ocbc.com to internet.ocbc.com handoff
- PDF download links — terms and conditions, product brochures

## Acceptance Criteria Patterns
When a Jira story says "verify X is visible" — test both isVisible AND position (above fold)
When a Jira story says "verify X text" — assert exact text content, not partial
When a Jira story says "verify navigation" — test all nav links are present and clickable
When a Jira story says "verify page loads" — test URL, title, and at least one key element
When a Jira story says "verify rate" — assert against test-data constant; flag if rate may change

## Quality Expectations
- Smoke tests: cover gateway, personal banking nav, key product pages load
- Regression tests: cover card comparison, loan calculators, account navigation
- All tests must pass in headed and headless Chromium
- Flaky tests should be triaged and healed within one sprint
