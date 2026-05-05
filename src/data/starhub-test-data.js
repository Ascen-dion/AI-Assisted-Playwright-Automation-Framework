// === FILE: src/data/starhub-test-data.js ===
/**
 * Centralised test data for StarHub website automation suite.
 *
 * Single source of truth for all assertion strings, URLs, and expected values.
 * When the application changes a label or value, update here — not in each spec or step.
 *
 * Set BASE_URL in .env — e.g. https://www.starhub.com/personal.html
 */

const BASE = process.env.BASE_URL || 'https://www.starhub.com/personal.html';

module.exports = {

  // ── URLs ─────────────────────────────────────────────────────────────────
  urls: {
    home:       BASE,
    base:       BASE,
    broadband:  'https://www.starhub.com/personal/broadband.html',
    mobile:     'https://consumer.starhub.com/personal/store/mobile-plans',
    promotions: 'https://www.starhub.com/personal/promotions.html',
    support:    'https://www.starhub.com/personal/support.html',
    sme:        'https://www.starhub.com/sme.html',
    enterprise: 'https://www.starhub.com/business.html',
    aboutUs:    'https://www.starhub.com/about-us.html',
  },

  // ── URL patterns (regex for toHaveURL assertions) ─────────────────────────
  urlPatterns: {
    home:       /starhub\.com\/personal\.html/,
    broadband:  /starhub\.com\/personal\/broadband/,
    mobile:     /starhub\.com\/personal\/store\/mobile/,
    promotions: /starhub\.com\/personal\/promotions/,
    support:    /starhub\.com\/personal\/support/,
    sme:        /starhub\.com\/sme/,
    enterprise: /starhub\.com\/business/,
    aboutUs:    /starhub\.com\/about-us/,
  },

  // ── Page Titles ───────────────────────────────────────────────────────────
  pageTitles: {
    home:      /StarHub.*Mobile.*Broadband/i,
    broadband: /Broadband/i,
    support:   /Support/i,
  },

  // ── Main Navigation Menu Items ────────────────────────────────────────────
  mainNavItems: ['Mobile', 'Broadband', 'Entertainment', 'Lifestyle & Safety', 'Perks & Promos'],

  // ── Top Navigation Links ──────────────────────────────────────────────────
  topNavLinks: ['Personal', 'SME', 'Enterprise', 'About Us'],

  // ── Value Propositions ────────────────────────────────────────────────────
  valueProps: ['Peace of mind', 'Full flexibility', 'Multi-service savings', '24/7 HubCare'],

  // ── Section Headings ──────────────────────────────────────────────────────
  sectionHeadings: {
    betterWay:       /better way to connect/i,
    curatedOffers:   /curated offers/i,
    trendingDevices: /trending devices/i,
    gearUp:          /gear up with starhub/i,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    copyrightPattern: /© StarHub 2026/,
    usefulLinks:      ['Check out our latest promotions!', 'Switch to StarHub', 'Store Locations'],
    supportLinks:     ['Contact Us', 'FAQ'],
    legalLinks:       ['Legal Notices', 'Data Protection Policy', 'Report Vulnerability'],
  },
};
