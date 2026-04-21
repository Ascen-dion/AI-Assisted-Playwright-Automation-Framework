// === FILE: config/globalSetup.js ===
/**
 * Playwright globalSetup — runs once before all tests.
 *
 * Logs into the Workday Finance tenant (Capital One impl sandbox) and saves the
 * resulting browser storage state (cookies + session) to
 * playwright/.auth/workday-storageState.json.
 *
 * All subsequent tests load this state so the Workday login is performed only once
 * per test run, removing the per-test login overhead and keeping the suite fast.
 *
 * Required env vars: WORKDAY_BASE_URL, WORKDAY_USERNAME, WORKDAY_PASSWORD
 * If credentials are not set, globalSetup skips auth and writes an empty state file.
 * Tests that require auth will then navigate to the login page and authenticate individually.
 */

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.WORKDAY_BASE_URL || 'https://capitalone.wd12.myworkdayjobs.com/Capital_One';
const LOGIN_URL = `${BASE_URL}/login.htmld`;
const USERNAME = process.env.WORKDAY_USERNAME;
const PASSWORD = process.env.WORKDAY_PASSWORD;

const STORAGE_STATE_PATH = path.resolve(__dirname, '../playwright/.auth/workday-storageState.json');

module.exports = async function globalSetup() {
  fs.mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });

  if (!USERNAME || !PASSWORD) {
    console.log('[globalSetup] WORKDAY_USERNAME / WORKDAY_PASSWORD not set — skipping Workday auth');
    fs.writeFileSync(STORAGE_STATE_PATH, JSON.stringify({ cookies: [], origins: [] }));
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  try {
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Workday login form
    await page.locator('[data-automation-id="userName"]').waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('[data-automation-id="userName"]').fill(USERNAME);
    await page.locator('[data-automation-id="password"]').fill(PASSWORD);
    await page.locator('[data-automation-id="submitButton"]').click();
    await page.waitForLoadState('networkidle', { timeout: 60000 });

    console.log('[globalSetup] Workday login successful — saving storage state');
    await context.storageState({ path: STORAGE_STATE_PATH });
    console.log(`[globalSetup] Storage state saved to ${STORAGE_STATE_PATH}`);
  } catch (err) {
    console.warn(`[globalSetup] Workday login failed: ${err.message} — writing empty state`);
    fs.writeFileSync(STORAGE_STATE_PATH, JSON.stringify({ cookies: [], origins: [] }));
  } finally {
    await browser.close();
  }
};
