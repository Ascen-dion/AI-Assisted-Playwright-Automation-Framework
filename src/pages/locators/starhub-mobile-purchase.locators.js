// === FILE: src/pages/locators/starhub-mobile-purchase.locators.js ===
const locators = {
  // Homepage navigation — Mobile tab
  mobileNavButton: (page) => page.getByRole('button', { name: 'Mobile' }),
  allPhonesLink: (page) => page.getByRole('link', { name: 'All Phones' }).first(),

  // Device listing page (consumer.starhub.com/personal/store/mobile/devices)
  deviceListingHeading: (page) => page.getByText('Mobile Devices', { exact: true }).first(),
  deviceItemCount: (page) => page.locator('text=/\\d+ items/').first(),
  galaxyA57Card: (page) => page.getByText('Galaxy A57 5G', { exact: true }).first(),

  // Device PDP — product identification
  // Breadcrumb shows "Samsung Galaxy A57 5G" - two elements match, use .first() (the breadcrumb link)
  deviceBreadcrumbTitle: (page) => page.getByText('Samsung Galaxy A57 5G', { exact: true }).first(),
  // Product title (brand + model are sibling elements; locate model text)
  deviceModelName: (page) => page.getByText('Galaxy A57 5G', { exact: true }).first(),

  // Device PDP — configuration selectors
  // .f-label-phone span holds only "Colour: " prefix; colour name lives in a sibling span.
  // Use xpath=.. to get the parent div which has both prefix + value as combined textContent.
  colourLabel: (page) => page.locator('.f-label-phone').filter({ hasText: /^Colour:/ }).locator('xpath=..'),
  // Similarly for storage label — parent div contains "Storage: 256GB" combined
  storageLabel: (page) => page.locator('.f-label-phone').filter({ hasText: /^Storage:/ }).locator('xpath=..'),
  // The 256GB option chip visible below the storage label — two spans match, use .first()
  storage256GBOption: (page) => page.getByText('256GB', { exact: true }).first(),
  // Active (selected) payment option — scope to paymentoption class to exclude
  // the storage .shop-option.active which also carries the active modifier
  activePaymentOption: (page) => page.locator('.paymentoption-selection-option.active'),
  payment24MonthOption: (page) => page.getByText('24-month', { exact: true }),

  // Device PDP — purchase CTA
  // 'Next' (exact) distinguishes from 'Next Item' (carousel button)
  nextButton: (page) => page.getByRole('button', { name: 'Next', exact: true }),

  // Auth gate popup rendered after unauthenticated Next click
  loginPopupModal: (page) => page.locator('.overlay-modal'),
  loginPopupMessage: (page) => page.locator('.overlay-modal-title'),
  loginWithHubIDButton: (page) => page.getByRole('button', { name: 'Log in with Hub ID' }),
  signUpButton: (page) => page.getByRole('button', { name: "Don't have an account? Sign up here" }),

  // 5G Unlimited+ link in Mobile dropdown
  fiveGUnlimitedLink: (page) => page.getByRole('link', { name: '5G Unlimited+' }),

  // Mobile Plans page — 5G Lite is the first plan card under the default 5G Unlimited+ tab
  selectPlanFor5GLite: (page) => page.getByRole('button', { name: 'Select plan' }).first(),

  // boc-bos add-on popup — "Protect from scams" complimentary services modal
  // Appears after clicking Select plan; must be dismissed to proceed to revieworder
  scamProtectionPopupDismiss: (page) => page.getByRole('button', { name: 'No, thanks' }),

  // Review Order page
  cartItemFiveGLite: (page) => page.getByText('5G Lite').first(),
  proceedToCheckoutButton: (page) => page.getByRole('button', { name: 'Proceed to checkout' }),
};

module.exports = locators;
