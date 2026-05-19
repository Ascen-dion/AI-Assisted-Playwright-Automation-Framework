# Application Context - Sun Life Philippines

## Base Configuration

**Target URL**: https://www.sunlife.com.ph/en/
**Application Type**: Corporate insurance & investment marketing website (multi-page, CMS-driven)
**Environment**: Production
**Domain**: Sun Life Philippines — country's #1 life insurance company, regulated by the Insurance Commission of the Philippines

---

## Homepage Structure

The homepage at https://www.sunlife.com.ph/en/ is the main entry point.

### Homepage Sections

| Section | Description |
|---|---|
| Header / Nav | Hamburger menu (mobile-style), Sun Life logo, "open menu" button |
| Hero Carousel | 6 slides linking to featured products; Previous/Next buttons; group[name=Carousel] |
| Get Help | Link to Client Services directory |
| Calculators & Quizzes | combobox to select online tool + "Go to online tool" button |
| Get a Quote | combobox to select product + "Get a quote" button |
| Needs Finder | "I would like to" combobox with life-goal options |
| Bright Ideas | 4 featured audience segments (Business Owners, OFW, Professionals, Employees) |
| Payment Section | Online Payment, Autocredit/Autodebit, Bank Bills Payment |
| Why Sun Life | #1 in PH, Reliable policies, Building wealth |
| Trustpilot Carousel | Embedded iframe with customer reviews |
| Footer | Quick links, Products, Careers, About us, Contact us, Legal, Privacy, Security, Sitemap |

---

## Top-Level Navigation

### Responsive Behaviour (CRITICAL)

Sun Life PH uses a **responsive nav** — behaviour differs by viewport:

| Viewport width | Hamburger button (`[aria-label="open menu"]`) | Nav items (Insurance, Investments…) | Log in link |
|---|---|---|---|
| ≥992px (desktop, default 1280px) | `display:none` — **NOT clickable** | Directly visible in top bar | **Directly visible** in utility nav — NO hamburger click needed |
| <992px (mobile) | Visible | Hidden inside dialog | Hidden inside dialog — requires hamburger click |

**Default Playwright viewport is 1280×720 (desktop).**

At desktop width:
- `button[aria-label='open menu']` is CSS-hidden — calling `click()` will timeout
- Nav sub-menu items (Insurance sub-pages, Investments, etc.) are directly accessible via their visible buttons
- "Log in" link is directly visible — do NOT call `openMenu()` before asserting it

To test the **hamburger menu on mobile**, resize the viewport first:
```js
await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14
```
Only after resize does `button[aria-label='open menu']` become visible.

Navigation is accessed via **dialog[name='Sun Life menu']** (mobile) or directly (desktop).
Opening selector (mobile only): `button[name='open menu']`

### Main Nav Buttons (expand to sub-menus)

| Button | Expands To |
|---|---|
| Insurance | Insurance sub-navigation |
| Investments | Investments sub-navigation |
| Life goals | Life goals articles |
| About us | About us sub-navigation |

### Utility Links (always visible in open menu)

| Link | URL |
|---|---|
| Log in | https://mobile.sunlife.com.ph/slocpicp/index.html#/ |
| Search | Opens search dialog |

---

## Insurance Navigation (sub-menu)

### Quick Links (inside Insurance expanded menu)

| Link | URL |
|---|---|
| All products | /en/all-products/ |
| VUL fund prices | /en/insurance/vul-fund-prices/ |
| File a claim | /en/about-us/how-to-file-a-claim-video/ |
| Online Payment Portal | https://online.sunlife.com.ph/onlinepay/payment |
| Tools and services | /en/insurance/tools-and-services/ |
| Get help | /en/about-us/become-an-empowered-sun-lifer/ |
| FAQs | /en/about-us/faqs/ |
| Contact us | /en/about-us/contact-us/ |
| Learn finance | /en/life-goals/ |

### Insurance Sub-categories

**Insurance to meet your needs:**

| Link | URL |
|---|---|
| Income continuation | /en/insurance/income-continuation/ |
| Education | /en/insurance/education/ |
| Retirement | /en/insurance/retirement/ |
| Estate preservation | /en/insurance/estate-preservation/ |
| Preparing for life milestones | /en/insurance/preparing-for-life-milestones/ |
| Health protection | /en/insurance/health-protection/ |

**Life insurance:**

| Link | URL |
|---|---|
| Overview | /en/insurance/life-insurance/ |
| Wealth transfer | /en/insurance/life-insurance/wealth-transfer/ |
| Wealth accumulation | /en/insurance/life-insurance/wealth-accumulation/ |
| Term insurance | /en/insurance/life-insurance/term-insurance/ |

**Group life insurance:**

| Link | URL |
|---|---|
| Overview | /en/insurance/group-insurance/ |

**Health insurance:**

| Link | URL |
|---|---|
| Overview | /en/insurance/health-insurance/ |

**Business owners insurance packages:**

| Link | URL |
|---|---|
| Overview | /en/insurance/business-owner-insurance-packages/ |

**Investment-linked insurance (VUL):**

| Link | URL |
|---|---|
| Overview | /en/insurance/VULs-and-Fund-Options/ |

---

## Investments Navigation

**Page URL**: https://www.sunlife.com.ph/en/investments/
**Page Title**: Investment Products | Sun Life Philippines

| Section | URL |
|---|---|
| Sun Life Prosperity Funds | /en/investments/sun-life-prosperity-funds/ |
| The Conservative Investor | /en/investments/the-conservative-investor/ |
| The Moderate Investor | /en/investments/the-moderate-investor/ |
| The Balanced Investor | /en/investments/the-balanced-investor/ |
| The Growth Investor | /en/investments/the-growth-investor/ |
| The Aggressive Investor | /en/investments/the-aggressive-investor/ |
| Stakeholder relations | /en/investments/stakeholder-relations/ |
| Our profile and awards | /en/investments/sun-life-prosperity-funds/our-profile-and-awards/ |
| Our programs | /en/investments/sun-life-prosperity-funds/our-programs-video/ |
| Fund managers | /en/investments/sun-life-prosperity-funds/sun-life-prosperity-fund-managers/ |
| Our financials | /en/investments/sun-life-prosperity-funds/our-financials/ |
| Our broker partners | /en/investments/sun-life-prosperity-funds/our-broker-partners/ |
| Invest now (external) | https://online.sunlife.com.ph/cdt/esales/isa |
| Announcements | /en/investments/announcements/ |

---

## Life Goals Navigation

**Page URL**: https://www.sunlife.com.ph/en/life-goals/
**Page Title**: Personal Insurance Lifestyle Articles | Sun Life Philippines

---

## About Us Navigation

**Page URL**: https://www.sunlife.com.ph/en/about-us/
**Page Title**: About Us | Sun Life Philippines

| Section | Description |
|---|---|
| Who we are | Country's first and longest-standing life insurer |
| Our services | /en/about-us/become-an-empowered-sun-lifer/ |
| Newsroom | Latest news and press releases |
| Sun Life Worldwide | Global operations |
| Building health in Asia | Innovation in health |
| The Sun Life Foundation | Philanthropy |
| Where to find us | Office/hub locations |
| Sustainability | ESG focus |

---

## Key Product Pages

### Life Insurance (/en/insurance/life-insurance/)
**Page Title**: Life insurance | Sun Life Philippines

**Products — Term Insurance:**

| Product | URL |
|---|---|
| SUN Healthier Life | /en/insurance/life-insurance/term-insurance/sun-healthier-life/ |
| Sun LifeAssure | /en/insurance/life-insurance/term-insurance/sun-lifeassure/ |
| Sun Maiden and Sun Maiden Plus | /en/insurance/life-insurance/term-insurance/sun-maiden-and-sun-maiden-plus/ |
| Sun First Aid and Sun First Aid Plus | /en/insurance/life-insurance/term-insurance/sun-first-aid/ |
| SUN Safer Life | /en/insurance/life-insurance/term-insurance/sun-safer-life/ |

**Products — Wealth Transfer:**

| Product | URL |
|---|---|
| Sun Life Premier Legacy | /en/insurance/life-insurance/wealth-transfer/sun-life-premier-legacy/ |
| Sun StartUp | /en/insurance/life-insurance/wealth-transfer/sun-startup/ |
| SUN Smarter Life Classic | /en/insurance/life-insurance/wealth-transfer/sun-smarter-life-classic/ |
| Sun Life Save and Protect | /en/insurance/preparing-for-life-milestones/sun-life-save-and-protect/ |

**Products — Wealth Accumulation (VUL):**

| Product | URL |
|---|---|
| Sun Life Secure Income | /en/insurance/life-insurance/wealth-accumulation/sun-life-secure-income/ |
| SUN Smarter Life Elite | /en/insurance/life-insurance/wealth-accumulation/sun-smarter-life-elite/ |
| Sun Acceler8 | /en/insurance/life-insurance/wealth-accumulation/sun-acceler8/ |
| Sun Dream Achiever | /en/insurance/life-insurance/wealth-accumulation/sun-dream-achiever/ |
| Sun Legacy | /en/insurance/life-insurance/wealth-accumulation/sun-legacy/ |
| Sun Wealth Prime 7 | /en/insurance/life-insurance/wealth-accumulation/sun-wealth-prime/ |
| Sun FlexiLink | /en/insurance/life-insurance/wealth-accumulation/sun-flexilink/ |
| Sun FlexiLink1 | /en/insurance/life-insurance/wealth-accumulation/sun-flexilink1/ |
| Sun FlexiDollar | /en/insurance/life-insurance/wealth-accumulation/sun-flexidollar/ |
| Sun FlexiDollar1 | /en/insurance/life-insurance/wealth-accumulation/sun-flexidollar1/ |
| Sun MaxiLink One | /en/insurance/life-insurance/wealth-accumulation/sun-maxilink-one/ |
| Sun MaxiLink Bright | /en/insurance/life-insurance/wealth-accumulation/sun-maxilink-bright/ |
| Sun MaxiLink 100 | /en/insurance/life-insurance/wealth-accumulation/sun-maxilink-100/ |
| Sun MaxiLink Prime | /en/insurance/life-insurance/wealth-accumulation/sun-maxilink-prime/ |
| Sun MaxiLink Dollar One | /en/insurance/life-insurance/wealth-accumulation/sun-maxilink-dollar-one/ |

---

### Health Insurance (/en/insurance/health-insurance/)
**Page Title**: Health insurance | Sun Life Philippines

| Product | URL |
|---|---|
| SUN Cancer Care | /en/insurance/health-insurance/sun-cancer-care/ |
| SUN Fit and Well | /en/insurance/health-insurance/sun-fit-and-well/ |
| SUN Senior Care | /en/insurance/health-insurance/sun-senior-care-video/ |
| Sun ICU Protect | /en/insurance/health-insurance/sun-icu-protect/ |
| Sun Life OFW Health Protect | /en/insurance/health-insurance/sun-life-ofw-health-protect/ |

---

### Digital Insurance (/en/insurance/digital-insurance/)

| Product | URL |
|---|---|
| Life Armor | /en/insurance/digital-insurance/life-armor/ |

---

## Audience-Specific Programs

| Program | URL |
|---|---|
| Business Owners Insurance Packages | /en/insurance/business-owners-insurance-packages/ |
| Shine Pinoy Program for Overseas Filipinos | /en/insurance/shine-pinoy-program/ |
| Partner for Professionals | /en/insurance/partner-for-professionals/ |
| Sweldo Power Up for Employees | /en/insurance/sweldo-power-up-for-employees/ |

---

## Online Tools & Calculators

All calculator links are external to https://online.sunlife.com.ph/cdt/

| Tool | URL Pattern |
|---|---|
| Investment Calculator | /cdt/eCalcAge/investmentCalculator |
| Money for Life Planner | /cdt/eplanner |
| Expense Calculator | /cdt/eCalcAge/expenseCalculator |
| Inflation Calculator | /cdt/eCalcAge/inflationCalculator |
| Get a Quote (eSales) | /cdt/esales/isa |
| Online Payment Portal | https://online.sunlife.com.ph/onlinepay/payment |

---

## Payment Channels

| Channel | URL |
|---|---|
| Online Payment Portal | https://online.sunlife.com.ph/onlinepay/payment |
| Autocredit or Autodebit | /en/about-us/become-an-empowered-sun-lifer/insurance/#accordion-section-4 |
| Bank Bills Payment | /en/about-us/become-an-empowered-sun-lifer/insurance/#accordion-section-2 |
| Payment channels overview | /en/about-us/become-an-empowered-sun-lifer/payment-channels/ |

---

## Footer

| Section | URL |
|---|---|
| Quick links | — |
| Products | /en/all-products/ |
| Careers | — |
| About us | /en/about-us/ |
| Contact us | /en/about-us/contact-us/ |
| Legal | https://www.sunlife.com/sl/pslf-philippines/en/legal/ |
| Privacy | https://www.sunlife.com/sl/pslf-philippines/en/privacy/ |
| Security | https://www.sunlife.com/sl/pslf-philippines/en/security/ |
| Site map | /en/sitemap/ |
| Physical address | 2/F Sun Life Centre, 5th Avenue corner Rizal Drive, Bonifacio Global City, Taguig City 1634 |
| Copyright | © 2024 Sun Life Assurance Company of Canada |

**Social Media:**

| Platform | URL |
|---|---|
| Twitter/X | https://twitter.com/SunLifePH/ |
| Facebook | https://www.facebook.com/sunlifeph/ |
| LinkedIn | https://www.linkedin.com/company/sun-life-financial |
| Instagram | https://www.instagram.com/SunLifePH/ |
| YouTube | https://www.youtube.com/user/SunLifePH |
| TikTok | https://www.tiktok.com/discover/sunlife-insurance |

---

## Navigation Locator Notes

- **Hamburger menu button**: utton[name='open menu'] — opens dialog[name='Sun Life menu']
- **Main nav buttons**: utton[name='Insurance'], utton[name='Investments'], utton[name='Life goals'], utton[name='About us'] — each expands a sub-list
- **Log in link**: link[name='Log in'] inside the menu dialog
- **Cookie/privacy consent banner**: utton with text "I understand" — appears on first visit
- **"Talk to an advisor" sticky CTA**: link[name='Talk to an advisor'] linking to #o2o-leadgen anchor
- **Get a quote combobox**: combobox[name='Select a product'] + utton[name='Get a quote']
- **Calculators combobox**: combobox[name='Calculators and quizzes'] + utton[name='Go to online tool']
- **Hero carousel**: group[name='Carousel']; next/prev via utton[name='Next'] / utton[name='Previous']
- **Chat widget**: embedded iframe — ignore in tests unless explicitly testing chat

---

## Environment Notes

- **Viewport**: 1280×720 (desktop); menu is hamburger-only at all widths
- **Timeout recommendation**: waitUntil: 'domcontentloaded', timeout: 60000
- **Cookie consent**: page.getByRole('button', { name: /i understand/i }) — dismiss in globalSetup storage state
- **Language**: English only (no language toggle on this site)
- **Page load strategy**: waitUntil: 'domcontentloaded' — site is server-rendered CMS, not SPA
- **External links**: calculator and eSales links open in new tab — verify visibility only, not navigation
- **IC regulatory footer**: every product page ends with Insurance Commission disclaimer text
