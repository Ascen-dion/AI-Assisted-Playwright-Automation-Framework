const locators = {
  // Cookie consent
  cookieConsentButton: (page) => page.getByRole('button', { name: /got it|accept|agree|consent/i }).first(),

  // Main navigation
  mobileDropdownButton: (page) => page.getByRole('button', { name: 'Mobile' }),
  allPhonesLink: (page) => page.getByRole('link', { name: 'All Phones' }),

  // Product listing page
  productCards: (page) => page.locator('generic').filter({ hasText: 'Samsung' }),
  galaxyA57Device: (page) => page.locator('text=Galaxy A57 5G').first(),
  galaxyA57ProductCard: (page) => page.locator(':has-text("Samsung Galaxy A57 5G")').first(),

  // Product detail page elements
  productTitle: (page) => page.getByText('Samsung Galaxy A57 5G').first(),
  colorDisplay: (page) => page.getByText(/Colour:/),
  colorAwesomeNavy: (page) => page.getByText('Colour: Awesome Navy'),
  storageDisplay: (page) => page.getByText(/Storage:/),
  storage256GB: (page) => page.getByText('Storage: 256GB'),
  paymentOptionsLabel: (page) => page.getByText('Payment option'),
  payment24Month: (page) => page.getByText('24-month'),
  nextButton: (page) => page.getByRole('button', { name: 'Next', exact: true }).last(),
  priceDisplay: (page) => page.getByText('$29.08'),

  // Authentication popup elements (expected after Next click)
  authModal: (page) => page.locator(':has-text("Please log in or create an account to continue with your purchase")').last(),
  authMessage: (page) => page.getByText('Please log in or create an account to continue with your purchase'),
  hubIdLoginButton: (page) => page.getByRole('button', { name: 'Log in with Hub ID' }),
  signUpLink: (page) => page.getByRole('button', { name: "Don't have an account? Sign up here" }),

  // Page loading indicators
  loadingSpinner: (page) => page.locator('.loading, .spinner, [data-testid*="loading"]'),
  pageContent: (page) => page.locator('main, [role="main"], .main-content')
};

module.exports = locators;