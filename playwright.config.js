// Root-level playwright.config.js — delegates to config/playwright.config.js
// This ensures `npx playwright test` (without --config) always uses the
// correct settings: 1 worker, 60s timeout, headless flags, etc.
module.exports = require('./config/playwright.config.js');
