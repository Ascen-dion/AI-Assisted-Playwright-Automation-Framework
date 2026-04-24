// === FILE: config/globalSetup.js ===
/**
 * Playwright globalSetup — runs once before all tests.
 *
 * Navigates to the UnionDigital Bank homepage, dismisses the cookie/privacy consent banner,
 * and saves the resulting browser storage state (cookies + localStorage)
 * to playwright/.auth/storageState.json.
 *
 * All subsequent tests load this state so the cookie banner is never shown,
 * removing the per-test dismissal dependency and eliminating a common flakiness source.
 *
 * The dismissCookieConsent() try/catch in page objects remains as a safe guard
 * in case storage state is stale or the banner reappears on a new session.
 */

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const HOMEPAGE = process.env.BASE_URL
  ? `${process.env.BASE_URL}`
  : 'https://uniondigitalbank.io/en';

const STORAGE_STATE_PATH = path.resolve(__dirname, '../playwright/.auth/storageState.json');

module.exports = async function globalSetup() {
  // Ensure the .auth directory exists
  fs.mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  try {
    await page.goto(HOMEPAGE, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Dismiss cookie/privacy consent banner ("I understand" button on UnionDigital Bank)
    try {
      await page.getByRole('button', { name: /i understand/i }).first().click({ timeout: 8000 });
      console.log('[globalSetup] Cookie consent dismissed');
    } catch {
      console.log('[globalSetup] No cookie consent banner found — skipping');
    }

    // Save cookies and localStorage so all tests start with consent already given
    await context.storageState({ path: STORAGE_STATE_PATH });
    console.log(`[globalSetup] Storage state saved to ${STORAGE_STATE_PATH}`);
  } finally {
    await browser.close();
  }
};
