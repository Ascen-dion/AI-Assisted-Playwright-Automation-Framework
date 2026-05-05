// === FILE: src/pages/locators/starhub.locators.js ===
/**
 * Locators for StarHub Personal website (www.starhub.com/personal.html).
 *
 * Selector priority: ARIA role > visible text > stable CSS.
 * Confirmed via live DOM inspection on 2026-05-05.
 */

const loc = {
  // ── Cookie Consent Banner ────────────────────────────────────────────
  cookieConsent: {
    banner:      (page) => page.locator('[ref="e6"], .cookie-banner, .consent-banner').first(),
    gotItButton: (page) => page.getByRole('button', { name: 'Got it' }),
  },

  // ── Top Navigation Bar (Personal | SME | Enterprise | About Us) ──────
  topNav: {
    personalLink:   (page) => page.getByRole('link', { name: 'Personal' }).first(),
    smeLink:        (page) => page.getByRole('link', { name: 'SME' }),
    enterpriseLink: (page) => page.getByRole('link', { name: 'Enterprise' }),
    aboutUsLink:    (page) => page.getByRole('link', { name: 'About Us' }),
  },

  // ── Main Navigation Menu ─────────────────────────────────────────────
  mainNav: {
    mobileButton:           (page) => page.getByRole('button', { name: 'Mobile' }),
    broadbandButton:        (page) => page.getByRole('button', { name: 'Broadband' }),
    entertainmentButton:    (page) => page.getByRole('button', { name: 'Entertainment' }),
    lifestyleSafetyButton:  (page) => page.getByRole('button', { name: 'Lifestyle & Safety' }),
    perksPromosButton:      (page) => page.getByRole('button', { name: 'Perks & Promos' }),
    supportLink:            (page) => page.getByRole('link', { name: 'Support' }).first(),
    starhubLogo:            (page) => page.locator('nav').locator('a').first(),
  },

  // ── Hero Banner / Carousel ────────────────────────────────────────────
  hero: {
    heroHeading:  (page) => page.locator('h1').first(),
    shopNowLink:  (page) => page.getByRole('link', { name: 'Shop now' }).first(),
  },

  // ── Value Propositions Strip ──────────────────────────────────────────
  valueProps: {
    peaceOfMind:       (page) => page.getByText('Peace of mind'),
    fullFlexibility:   (page) => page.getByText('Full flexibility'),
    multiServiceSavings: (page) => page.getByText('Multi-service savings'),
    hubCare:           (page) => page.getByText('24/7 HubCare'),
  },

  // ── Section Headings ─────────────────────────────────────────────────
  sections: {
    betterWayToConnect: (page) => page.getByRole('heading', { name: /better way to connect/i }),
    curatedOffers:      (page) => page.getByRole('heading', { name: /curated offers/i }),
    trendingDevices:    (page) => page.getByRole('heading', { name: /trending devices/i }),
    gearUp:             (page) => page.getByRole('heading', { name: /gear up with starhub/i }),
  },

  // ── Footer ────────────────────────────────────────────────────────────
  footer: {
    copyright:        (page) => page.getByText(/© StarHub/),
    contactUsLink:    (page) => page.getByRole('link', { name: 'Contact Us' }),
    faqLink:          (page) => page.getByRole('link', { name: 'FAQ' }),
    legalNoticesLink: (page) => page.getByRole('link', { name: 'Legal Notices' }),
    dataProtection:   (page) => page.getByRole('link', { name: 'Data Protection Policy' }).last(),
    facebookLink:     (page) => page.getByRole('link', { name: /facebook/i }).first(),
    instagramLink:    (page) => page.getByRole('link', { name: /instagram/i }).first(),
    backToTop:        (page) => page.getByText('Back to top'),
  },
};

module.exports = loc;
