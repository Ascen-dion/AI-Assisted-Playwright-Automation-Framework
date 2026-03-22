/**
 * LoginPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for the Odoo login screen (/web/login).
 *
 * Handles:
 *  • Navigating to the login URL
 *  • Filling credentials
 *  • Waiting for Cloudflare Turnstile to release the submit button
 *  • Confirming the Odoo shell has loaded after sign-in
 */

import { type Page } from '@playwright/test';
import { BasePage } from '@pages/odoo/base/BasePage';
import { logger } from '@utils/logger';

export class LoginPage extends BasePage {
  private readonly URL = '/web/login';

  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ─────────────────────────────────────────────────────────────

  private get usernameInput() {
    return this.page.locator('#login');
  }

  private get passwordInput() {
    return this.page.locator('#password');
  }

  /**
   * The enabled submit button (no `.disabled` / `[disabled]` attribute).
   * Odoo SaaS with Cloudflare Turnstile keeps the button disabled until the
   * bot-challenge resolves; polling this selector is the cleanest wait.
   */
  private get enabledSubmitBtn() {
    return this.page.locator(
      'button[type="submit"]:not(.disabled):not([disabled]), ' +
      'button[name="login"]:not(.disabled):not([disabled])',
    ).first();
  }

  /** Odoo shell indicator – present once logged in */
  private get odooShell() {
    return this.page.locator('.o_home_menu, .o_main_navbar');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Navigate to the login page.
   */
  async goto(): Promise<void> {
    logger.step('Navigate to login page');
    await this.page.goto(this.URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
  }

  /**
   * Perform a full login: navigate → fill credentials → wait for Turnstile →
   * click sign-in → confirm Odoo shell is loaded.
   */
  async login(email: string, password: string): Promise<void> {
    await this.goto();

    logger.step(`Login as: ${email}`);
    await this.usernameInput.fill(email);
    await this.passwordInput.fill(password);

    // Wait for Turnstile (or any other challenge) to enable the button
    logger.info('Waiting for submit button to become enabled …');
    await this.enabledSubmitBtn.waitFor({ state: 'visible', timeout: 90_000 });

    await this.enabledSubmitBtn.click({ timeout: 90_000 });

    logger.info('Waiting for Odoo shell …');
    await this.odooShell.waitFor({ state: 'visible', timeout: 60_000 });
    logger.info('Login successful.');
  }
}
