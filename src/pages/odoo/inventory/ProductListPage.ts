/**
 * ProductListPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for Inventory ▸ Products ▸ Products (list / kanban view).
 */

import { type Page, expect } from '@playwright/test';
import { BasePage } from '@pages/odoo/base/BasePage';
import { logger } from '@utils/logger';

export class ProductListPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  /** Navigate from the Inventory app to the Products list. */
  async goto(): Promise<void> {
    logger.step('Navigate to Products list');
    await this.page
      .locator('.o_menu_sections a, nav.o_main_navbar a')
      .filter({ hasText: 'Products' })
      .first()
      .click({ timeout: 10_000 });

    // Handle optional submenu
    const subMenu = this.page
      .locator('.o_dropdown_menu a')
      .filter({ hasText: /^Products$/ });
    if (await subMenu.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await subMenu.click();
    }

    await this.page.waitForURL(/product/, { timeout: 15_000 });
    await this.page.waitForLoadState('domcontentloaded');
    logger.info('Products list loaded.');
  }

  /** Search for a product by name and open its form. */
  async openProduct(productName: string): Promise<void> {
    logger.step(`Open product: ${productName}`);
    await this.search(productName);
    await this.page
      .locator(
        `.o_data_row td:has-text("${productName}"), ` +
        `.o_kanban_record:has-text("${productName}")`,
      )
      .first()
      .click({ timeout: 10_000 });
    await this.waitForForm();
    logger.info(`Product "${productName}" form opened.`);
  }

  /** Click "New" and return once the blank product form has appeared. */
  async clickNew(): Promise<void> {
    logger.step('Create new product');
    await this.newBtn.click();
    await this.waitForForm();
  }
}
