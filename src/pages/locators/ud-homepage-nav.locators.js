// === FILE: src/pages/locators/ud-homepage-nav.locators.js ===
/**
 * Locators for UnionDigital Bank homepage (https://uniondigitalbank.io/en).
 *
 * DOM evidence (inspected 2026-04-24):
 *   Navbar logo: <a href="/en"><img alt="Navbar logo" /></a>
 *   Products nav: <div class="styles_menu_item_anchor__f62GR">Products</div>  (div, not <a>)
 *   Loan Payment Guides nav: <div class="styles_menu_item_anchor__f62GR">Loan Payment Guides</div>
 *   About Us nav: <a href="/en/about-us"><div class="styles_menu_item_anchor__f62GR">About Us</div></a>
 *   Cookie consent: <button>I understand</button>
 *   Homepage sections: id="homepage-banner", id="homepage-awards", id="homepage-products", id="homepage-download"
 */
const locators = {
  // ── Navbar ──────────────────────────────────────────────────────────────
  navbarLogo: (page) =>
    page.getByRole('link', { name: 'Navbar logo' }).first(),

  productsNavItem: (page) =>
    page.getByText('Products').first(),

  loanPaymentGuidesNavItem: (page) =>
    page.getByText('Loan Payment Guides').first(),

  promosNavItem: (page) =>
    page.getByText('Promos').first(),

  aboutUsNavLink: (page) =>
    page.getByRole('link', { name: 'About Us' }).first(),

  usapangDiskarteNavLink: (page) =>
    page.getByRole('link', { name: 'Usapang Diskarte' }).first(),

  helpCenterNavLink: (page) =>
    page.getByRole('link', { name: 'Help Center' }).first(),

  // ── Cookie consent ────────────────────────────────────────────────────────
  cookieConsentButton: (page) =>
    page.getByRole('button', { name: /i understand/i }).first(),

  // ── Homepage sections ─────────────────────────────────────────────────────
  homepageBannerSection: (page) =>
    page.locator('#homepage-banner'),

  homepageAwardsSection: (page) =>
    page.locator('#homepage-awards'),

  homepageProductsSection: (page) =>
    page.locator('#homepage-products'),

  homepageDownloadSection: (page) =>
    page.locator('#homepage-download'),

  // ── Hero CTA ──────────────────────────────────────────────────────────────
  downloadTheAppButton: (page) =>
    page.getByRole('button', { name: /download the app/i }).first(),
};

module.exports = locators;
