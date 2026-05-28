# Experian — Application Context

## Overview
Experian is a global consumer credit reporting company. The consumer-facing website at https://www.experian.com/ provides credit reports, FICO scores, identity protection, financial tools, and educational resources.

## Target URL
- **Homepage:** https://www.experian.com/

## Site Structure (Consumer)

### Header Navigation (Primary)
| Menu Item     | Type   | Behaviour                        |
|---------------|--------|----------------------------------|
| Credit        | Button | Opens mega-menu for credit products |
| Protection    | Button | Opens mega-menu for protection products |
| Money         | Button | Opens mega-menu for money tools  |
| Credit Cards  | Button | Opens mega-menu for credit card offers |
| Loans         | Button | Opens mega-menu for loan products |
| Insurance     | Button | Opens mega-menu for insurance products |

### Top Bar (Audience Selector)
| Link              | URL                         |
|-------------------|-----------------------------|
| Consumer          | /                            |
| Small Business    | /small-business/             |
| Business          | /business/                   |
| Credit Support    | (dropdown)                   |
| Financial Guidance| /blogs/ask-experian/         |
| Global Sites      | experianplc.com/contact-us/  |

### Homepage Sections (top → bottom)
1. **Hero** — "Reach your credit and money goals" with tabbed product cards
2. **BFF Section** — "Say hi to your Big Financial Friend" (Experian app promo)
3. **How Can We Help** — Security freeze, Disputes, Fraud alert cards
4. **Legal Disclosures** — Regulatory fine print

### Footer Sections
| Column                 | Key Links                                          |
|------------------------|----------------------------------------------------|
| Support                | Security freeze, Fraud alert, Disputes, Denied credit |
| Education & advice     | Credit reports, Fraud, Banking, Credit cards, Loans |
| Credit resources       | Free monitoring, 3-bureau reports, Boost, CreditLock |
| Experian for businesses| Business credit, Decisioning, Fraud management     |

### Footer Bottom Links
Legal terms & conditions · Privacy center · U.S. data privacy policy · Press · Ad choices · Careers · Investor relations · Contact us

## Key Pages
| Page               | URL                              |
|--------------------|----------------------------------|
| Homepage           | /                                 |
| Credit Score       | /credit/credit-score/             |
| Credit Monitoring  | /credit/credit-monitoring/        |
| Experian Boost     | /credit/score-boost/              |
| Protection         | /protection/                      |
| CreditLock         | /protection/creditlock/           |
| Loans              | /loans/                           |
| Insurance          | /insurance/                       |
| Credit Cards       | /credit-cards/                    |
| Careers            | /careers/                         |
| About Experian     | /corporate/about-experian         |
| Security Freeze    | /help/credit-freeze/              |
| Disputes           | /help/dispute-credit/             |
| Fraud Alert        | /help/fraud-alert/                |
| Sign In            | /help/login/                      |
| Experian App       | /credit/experian-app/             |

## Cookie / Consent Banner
- The site may display a cookie consent banner. Use "Accept All Cookies" to dismiss.
- globalSetup handles this; page objects have a safety-net fallback.

## Known Quirks
- Navigation uses buttons (not links) for mega-menu items — they open dropdown panels on click.
- FICO® has a superscript ® symbol in page text; use regex for flexible matching.
- The hero section uses a tablist pattern with 5 tabs.
- Footer copyright: `© 2026 Experian. All rights reserved.`
