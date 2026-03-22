/**
 * BasePage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Abstract base for every Odoo Page Object.
 *
 * Responsibilities:
 *  • Holds the Playwright `Page` instance
 *  • Provides shared Odoo UI helpers:
 *      – openApp()          navigate to a top-level Odoo application
 *      – saveRecord()       persist an open form record
 *      – search()           type into the global search bar and confirm
 *      – openDropdownLink() click a menu item inside a revealed dropdown
 *      – waitForForm()      wait for a form view to be ready
 *  • Exposes common Odoo selectors as readonly properties so sub-classes
 *    don't hardcode strings
 *
 * All public methods are async and resolve only after the UI has settled
 * (dom content loaded), keeping tests free of manual waits.
 */

import { type Page, type Locator } from '@playwright/test';
import { logger } from '@utils/logger';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ─── Common Odoo selectors ────────────────────────────────────────────────

  protected get saveBtn(): Locator {
    return this.page.locator(
      'button.o_form_button_save, [data-hotkey="s"].btn-primary, button:has-text("Save manually")',
    ).first();
  }

  protected get searchInput(): Locator {
    return this.page.locator('.o_searchview input').first();
  }

  protected get formView(): Locator {
    return this.page.locator('.o_form_view');
  }

  protected get newBtn(): Locator {
    return this.page.locator(
      'button.o_list_button_add, button:has-text("New")',
    ).first();
  }

  // ─── Shared Odoo actions ──────────────────────────────────────────────────

  /**
   * Navigate to an Odoo top-level application by its display name.
   * Opens the home menu if the app grid is not already visible.
   */
  async openApp(appName: string): Promise<void> {
    logger.step(`Open app: ${appName}`);
    const homeIcon = this.page.locator(
      '.o_main_navbar .o_menu_toggle, .o_home_menu_toggle',
    );
    if (await homeIcon.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await homeIcon.click();
    }
    await this.page
      .locator(`.o_home_menu .o_app:has-text("${appName}")`)
      .click({ timeout: 15_000 });
    await this.page.waitForLoadState('domcontentloaded');
    logger.info(`App "${appName}" opened.`);
  }

  /**
   * Save an open Odoo form record.
   * Prefers the explicit save button; falls back to Ctrl+S.
   */
  async saveRecord(): Promise<void> {
    logger.step('Save record');
    if (await this.saveBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await this.saveBtn.click();
    } else {
      await this.page.keyboard.press('Control+S');
    }
    // Wait for the dirty-form indicator to disappear
    await this.page
      .waitForSelector(
        '.o_form_editable:not(.o_form_readonly), .o_form_status_indicator_save',
        { state: 'detached', timeout: 10_000 },
      )
      .catch(() => { /* already clean */ });
    await this.page.waitForLoadState('domcontentloaded');
    logger.info('Record saved.');
  }

  /**
   * Type a query into the Odoo search bar and press Enter.
   */
  async search(query: string): Promise<void> {
    logger.step(`Search: "${query}"`);
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Click a menu section title to reveal its dropdown, then click a link
   * inside it.  Designed for the top navigation bar in Odoo.
   */
  async openDropdownLink(menuLabel: string | RegExp, itemLabel: string | RegExp): Promise<void> {
    logger.step(`Navigate: [${menuLabel}] › [${itemLabel}]`);
    await this.page
      .locator('.o_menu_sections a')
      .filter({ hasText: menuLabel })
      .first()
      .click({ timeout: 10_000 });

    const item = this.page
      .locator('.o_dropdown_menu a, .o_menu_sections a')
      .filter({ hasText: itemLabel })
      .first();
    await item.waitFor({ state: 'visible', timeout: 8_000 });
    await item.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.info(`Opened [${itemLabel}].`);
  }

  /**
   * Wait for a form view to be visible and interactive.
   */
  async waitForForm(): Promise<void> {
    await this.formView.waitFor({ state: 'visible', timeout: 20_000 });
  }

  /**
   * Select a many2one dropdown option by typing the value and clicking the
   * first matching suggestion from Odoo's autocomplete.
   */
  async selectMany2oneOption(inputLocator: Locator, value: string): Promise<void> {
    await inputLocator.fill(value);
    const option = this.page
      .locator(`.o_dropdown_item:has-text("${value}"), .ui-autocomplete li:has-text("${value}")`)
      .first();
    await option.waitFor({ state: 'visible', timeout: 10_000 });
    await option.click();
  }

  /**
   * Click a notebook tab by its visible label.
   */
  async clickTab(tabLabel: string | RegExp): Promise<void> {
    logger.step(`Switch tab: ${tabLabel}`);
    await this.page
      .locator('.o_notebook .nav-link')
      .filter({ hasText: tabLabel })
      .click({ timeout: 10_000 });
    await this.page.waitForLoadState('domcontentloaded');
  }
}
