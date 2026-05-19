// === FILE: src/web/locators/sunlife-homepage.locators.js ===
/**
 * Locators for the Sun Life Philippines homepage and shared site navigation.
 * URL: https://www.sunlife.com.ph/en/
 */

const locators = {
  // ── Hamburger menu ────────────────────────────────────────────────────────
  openMenuButton: (page) => page.getByRole('button', { name: 'open menu' }),
  menuDialog:     (page) => page.getByRole('dialog', { name: 'Sun Life menu' }),

  // ── Menu links (visible after opening the hamburger menu) ────────────────
  loginLink:      (page) => page.getByRole('link', { name: 'Log in' }),

  // ── Utility nav (top bar — always visible, no hamburger required) ─────────
  howToFileAClaimLink: (page) => page.getByRole('link', { name: 'How to file a claim' }).first(),
  whereToPayLink:      (page) => page.getByRole('link', { name: 'Where to pay' }).first(),
  advisorListLink:     (page) => page.getByRole('link', { name: 'Advisor list' }).first(),
  careersLink:         (page) => page.getByRole('link', { name: 'Careers' }).first(),
};

module.exports = locators;
