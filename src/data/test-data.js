// === FILE: src/data/test-data.js ===
/**
 * Centralised test data for StarHub automation suite.
 *
 * Single source of truth for all assertion strings, URLs, and expected values.
 * When the application changes a label or copy, update here — not in each spec.
 */

module.exports = {

  // ── URLs ────────────────────────────────────────────────────────────────
  urls: {
    homepage:        'https://www.starhub.com/personal.html',
    allPhones:       'https://consumer.starhub.com/personal/store/mobile/devices',
    galaxyA57:       'https://consumer.starhub.com/personal/store/mobile/devices/samsung/galaxy-a57-5g',
    broadband:       'https://www.starhub.com/personal/broadband.html',
    entertainment:   'https://www.starhub.com/personal/tvplus/passes.html',
    membership:      'https://www.starhub.com/personal/membership.html',
    aboutUs:         'https://corporate.starhub.com/about-us.html',
    sme:             'https://www.starhub.com/sme.html',
  },

  // ── URL patterns (regex for toHaveURL assertions) ────────────────────────
  urlPatterns: {
    allPhones:  /consumer\.starhub\.com\/personal\/store\/mobile\/devices/,
    galaxyA57:  /galaxy-a57-5g/,
    aboutUs:    /corporate\.starhub\.com\/about-us/,
  },

  // ── Galaxy A57 5G — default product configuration ────────────────────────
  // NOTE: Jira AC3 specifies "Black"; live PDP defaults to "Awesome Navy" (April 2026).
  // Update this value if StarHub changes the default colour.
  galaxyA57: {
    defaultColour:         'Awesome Navy',
    defaultStorage:        '256GB',
    defaultPaymentPeriod:  '24-month',
    colourLabelPrefix:     'Colour:',
    storageLabelPrefix:    'Storage:',
  },

  // ── Auth gate popup ───────────────────────────────────────────────────────
  authPopup: {
    message:          'Please log in or create an account to continue with your purchase',
    loginButtonText:  'Log in with Hub ID',
    signUpButtonText: "Don't have an account? Sign up here",
  },

  // ── Device listing ────────────────────────────────────────────────────────
  deviceListing: {
    headingText:    'Mobile Devices',
    itemCountRegex: /\d+ items/,
  },

  // ── Page titles ───────────────────────────────────────────────────────────
  pageTitles: {
    homepage:      /StarHub|Best Mobile/i,
    broadband:     /broadband/i,
    entertainment: /entertainment|tv\+/i,
    membership:    /membership/i,
    sme:           /sme/i,
  },

};
