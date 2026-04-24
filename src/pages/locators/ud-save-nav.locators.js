// === FILE: src/pages/locators/ud-save-nav.locators.js ===
/**
 * Locators for UnionDigital Bank UD Save Account page
 * (https://uniondigitalbank.io/en/products-savings).
 *
 * DOM evidence (inspected 2026-04-24):
 *   Hero heading: <h1 ...>UD Save Account</h1>
 *   Page title: "UnionDigital Bank | Savings"
 *   Feature text: "Mag-ipon lang sa account mo and enjoy high interest rates"
 *   Feature text: "Goodbye na sa mahabang pila! Pay your bills quickly..."
 *   Download section: id="homepage-download"
 */
const locators = {
  // ── UD Save page hero ─────────────────────────────────────────────────────
  heroHeading: (page) =>
    page.getByRole('heading', { name: /UD Save Account/i }).first(),

  // ── Feature sections ──────────────────────────────────────────────────────
  savingsFeatureText: (page) =>
    page.getByText(/Mag-ipon lang sa account mo/i).first(),

  billsFeatureText: (page) =>
    page.getByText(/Goodbye na sa mahabang pila/i).first(),

  // ── App download section ──────────────────────────────────────────────────
  downloadSection: (page) =>
    page.locator('#homepage-download'),

  downloadSectionHeading: (page) =>
    page.getByText(/Mag-bank na with/i).first(),
};

module.exports = locators;
