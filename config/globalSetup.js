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

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars'
    ]
  });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    // Spoof a real Windows Chrome UA so the site doesn't serve a 404 to headless bots
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  // Mask automation fingerprint so the site serves real content
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  try {
    await page.goto(HOMEPAGE, { waitUntil: 'networkidle', timeout: 60000 });

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
