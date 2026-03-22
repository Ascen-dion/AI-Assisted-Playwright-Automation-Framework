/**
 * playwright.config.ts
 * 
 * Root Playwright configuration for the Odoo automation framework.
 *
 * Path aliases (@utils, @pages, @data, @fixtures) are defined in tsconfig.json
 * and are resolved automatically by Playwright built-in TypeScript transform.
 *
 * Environment variables (set in .env or shell):
 *   ODOO_BASE_URL  – Odoo tenant URL  (required for Odoo tests)
 *   ODOO_EMAIL     – Login email      (required)
 *   ODOO_PASSWORD  – Login password   (required)
 *   ODOO_VENDOR    – Vendor name      (optional, default: Azure Interior)
 *   HEADLESS       – Set to 'true' to run headless  (default: headed)
 *   LOG_LEVEL      – DEBUG|INFO|WARN|ERROR  (default: INFO)
 */
import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',

  // Timeouts – generous for Odoo multi-step UI flows + Cloudflare Turnstile
  timeout:  180_000,
  expect:   { timeout: 15_000 },

  // Run settings – sequential because Odoo tests share database state
  fullyParallel: false,
  workers:       1,
  forbidOnly:    !!process.env.CI,
  retries:       process.env.CI ? 1 : 0,

  // Reporters
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  // Global browser settings
  use: {
    baseURL:           process.env.ODOO_BASE_URL || 'https://demo.odoo.com',
    headless:          process.env.HEADLESS === 'true',
    viewport:          { width: 1440, height: 900 },
    actionTimeout:     20_000,
    navigationTimeout: 60_000,
    trace:             'retain-on-failure',
    screenshot:        'only-on-failure',
    video:             'retain-on-failure',
  },

  // Projects (browsers)
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari']  } },
  ],

  outputDir: 'test-results',
});
