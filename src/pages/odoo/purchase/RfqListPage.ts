/**
 * RfqListPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for Purchase ▸ Orders ▸ Requests for Quotation (list view).
 */

import { type Page, expect } from '@playwright/test';
import { BasePage } from '@pages/odoo/base/BasePage';
import { logger } from '@utils/logger';

export class RfqListPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  /** Navigate from the Purchase app to the RFQ list. */
  async goto(): Promise<void> {
    logger.step('Navigate to RFQ list');
    await this.page
      .locator('.o_menu_sections a')
      .filter({ hasText: /Orders|Purchase Orders/ })
      .first()
      .click({ timeout: 10_000 });

    const rfqLink = this.page
      .locator('.o_dropdown_menu a')
      .filter({ hasText: /Requests for Quotation|RFQ/ })
      .first();

    if (await rfqLink.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await rfqLink.click();
    }

    await this.page.waitForLoadState('domcontentloaded');
    logger.info('RFQ list loaded.');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /** Search for RFQs containing a product name and open the first result. */
  async openRfqForProduct(productName: string): Promise<void> {
    logger.step(`Open RFQ for "${productName}"`);
    await this.search(productName);

    const record = this.page
      .locator('.o_data_row, .o_kanban_record')
      .filter({ hasText: productName })
      .first();
    await expect(record).toBeVisible({ timeout: 20_000 });
    await record.click();
    await this.waitForForm();
    logger.info(`RFQ for "${productName}" opened.`);
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  /** Assert that at least one RFQ row containing the product name is visible. */
  async assertRfqExists(productName: string): Promise<void> {
    const rfqRow = this.page
      .locator('.o_data_row')
      .filter({ hasText: productName })
      .first();
    await expect(rfqRow).toBeVisible({ timeout: 20_000 });
    logger.info(`RFQ found for "${productName}".`);
  }
}
