const locators = {
  // Cookie consent
  cookieConsentButton: (page) => page.getByRole('button', { name: /got it|accept|agree|consent/i }).first(),

  // Main navigation (www.starhub.com)
  mobileDropdownButton: (page) => page.getByRole('button', { name: 'Mobile' }),
  allPhonesLink: (page) => page.getByRole('link', { name: 'All Phones' }),

  // Product listing page (consumer.starhub.com/personal/store/mobile/devices)
  // Confirmed live DOM: class="product-item-card ..." — 39 devices on listing
  galaxyA57Device: (page) => page.locator('[class*="product-item-card"]').filter({ hasText: 'Galaxy A57 5G' }).first(),

  // Product detail page (consumer.starhub.com/.../samsung/galaxy-a57-5g)
  // Confirmed live DOM 2026-04-13
  productTitle: (page) => page.locator('.product-detail-supernova'),
  colourSection: (page) => page.locator('.colour-section').first(),
  storageSection: (page) => page.locator('.storage-section').first(),
  // Active payment option — class includes both 'paymentoption-selection-option' AND 'active'
  paymentOptionActive: (page) => page.locator('.paymentoption-selection-option.active'),
  // Desktop-visible Next button (two exist; the mobile one is hidden)
  nextButton: (page) => page.locator('button.add-to-cart-button.width-full-desktop'),

  // Authentication popup (overlay-modal shown after clicking Next when unauthenticated)
  authMessage: (page) => page.locator('.overlay-modal-title'),
  authModalFooter: (page) => page.locator('.overlay-modal-footer-content'),
  hubIdLoginButton: (page) => page.getByRole('button', { name: 'Log in with Hub ID' }),
  signUpLink: (page) => page.getByRole('button', { name: "Don't have an account? Sign up here" }),
};

module.exports = locators;