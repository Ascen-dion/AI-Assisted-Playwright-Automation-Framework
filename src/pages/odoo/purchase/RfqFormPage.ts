/**
 * RfqFormPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for an individual RFQ / Purchase Order form.
 */

import { type Page, expect } from '@playwright/test';
import { BasePage } from '@pages/odoo/base/BasePage';
import { logger } from '@utils/logger';

export class RfqFormPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ─────────────────────────────────────────────────────────────

  private orderLine(productName: string) {
    return this.page
      .locator('.o_field_widget[name="order_line"] .o_data_row')
      .filter({ hasText: productName })
      .first();
  }

  private get statusBadge() {
    return this.page
      .locator(
        '.o_statusbar_status .o_arrow_button.o_arrow_button_current, ' +
        '.o_field_statusbar .btn.active, ' +
        '.o_statusbar_status button[disabled]',
      )
      .first();
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  /** Assert that a line for the given product appears on the RFQ. */
  async assertOrderLineExists(productName: string): Promise<void> {
    logger.step(`Assert order line for "${productName}"`);
    await expect(this.orderLine(productName)).toBeVisible({ timeout: 10_000 });
    logger.info(`Order line for "${productName}" confirmed.`);
  }

  /** Assert that the RFQ is in a draft / quotation state. */
  async assertStatusIsDraft(): Promise<void> {
    logger.step('Assert RFQ status is Draft / Quotation');
    await expect(this.statusBadge).toBeVisible({ timeout: 5_000 });
    const text = (await this.statusBadge.textContent()) ?? '';
    expect(text).toMatch(/RFQ|Draft|Quotation/i);
    logger.info(`RFQ status: "${text.trim()}"`);
  }
}
