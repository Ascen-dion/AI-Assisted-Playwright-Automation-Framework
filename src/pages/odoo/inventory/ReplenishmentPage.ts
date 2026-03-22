/**
 * ReplenishmentPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for Inventory ▸ Operations ▸ Replenishment.
 *
 * Handles:
 *  – Navigating to the view
 *  – Creating a Min/Max reordering rule
 *  – Clicking "Replenish" on an existing rule
 *  – Running the batch scheduler ("Run Scheduler")
 *  – Asserting rule values
 */

import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/odoo/base/BasePage';
import { type ReplenishmentRuleData } from '@data/odoo/product.data';
import { logger } from '@utils/logger';

export class ReplenishmentPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    logger.step('Navigate to Replenishment');
    await this.openDropdownLink(/Operations/, /Replenishment/);
    logger.info('Replenishment view ready.');
  }

  // ─── Locators ─────────────────────────────────────────────────────────────

  private ruleRow(productName: string): Locator {
    return this.page.locator('.o_data_row').filter({ hasText: productName }).first();
  }

  private get runSchedulerBtn() {
    return this.page
      .locator('button:has-text("Run Scheduler"), button:has-text("Replenish")')
      .first();
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Create a new Min/Max reordering rule.
   * Handles both inline-row and dialog-form variants that Odoo uses depending
   * on the version.
   */
  async createRule(rule: ReplenishmentRuleData): Promise<void> {
    logger.step(`Create replenishment rule for "${rule.productName}"`);
    await this.newBtn.click();

    // Determine rendering mode
    const dialogForm = this.page.locator('.o_dialog .o_form_view');
    const isDialog = await dialogForm.isVisible({ timeout: 4_000 }).catch(() => false);
    const ctx: Locator = isDialog
      ? dialogForm
      : this.page.locator('.o_list_view');

    // Product
    await this.selectMany2oneOption(
      ctx.locator('[name="product_id"] input').first(),
      rule.productName,
    );
    await this.page.waitForLoadState('domcontentloaded');

    // Min quantity
    await ctx.locator('[name="product_min_qty"] input').first().fill(String(rule.minQty));

    // Max quantity
    await ctx.locator('[name="product_max_qty"] input').first().fill(String(rule.maxQty));

    // Route (optional)
    if (rule.route) {
      const routeInput = ctx.locator('[name="route_id"] input').first();
      if (await routeInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await routeInput.fill(rule.route);
        const option = this.page
          .locator(`.o_dropdown_item:has-text("${rule.route}"), .ui-autocomplete li:has-text("${rule.route}")`)
          .first();
        if (await option.isVisible({ timeout: 5_000 }).catch(() => false)) {
          await option.click();
        }
      }
    }

    // Save
    if (isDialog) {
      await dialogForm
        .locator('button:has-text("Save"), button[name="apply"]')
        .first()
        .click();
    }
    await this.saveRecord();
    logger.info(`Rule created: Min=${rule.minQty}, Max=${rule.maxQty}.`);
  }

  /**
   * Click the "Replenish" (or "Order Once") button on a specific product's
   * rule row to manually trigger an order.
   */
  async triggerReplenishment(productName: string): Promise<void> {
    logger.step(`Trigger replenishment for "${productName}"`);
    const row = this.ruleRow(productName);
    await expect(row).toBeVisible({ timeout: 10_000 });

    const orderBtn = row
      .locator('button:has-text("Replenish"), button:has-text("Order Once"), button:has-text("Order")')
      .first();
    await expect(orderBtn).toBeVisible({ timeout: 8_000 });
    await orderBtn.click();
    await this.page.waitForLoadState('domcontentloaded');

    // Confirm dialog if present
    const confirmBtn = this.page.locator(
      '.modal-footer button:has-text("Replenish"), .modal-footer button:has-text("Confirm")',
    );
    if (await confirmBtn.isVisible({ timeout: 4_000 }).catch(() => false)) {
      await confirmBtn.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
    logger.info(`Replenishment triggered for "${productName}".`);
  }

  /**
   * Click "Run Scheduler" to batch-process all pending reordering rules.
   */
  async runScheduler(): Promise<void> {
    logger.step('Run Scheduler');
    if (!(await this.runSchedulerBtn.isVisible({ timeout: 5_000 }).catch(() => false))) {
      logger.warn('"Run Scheduler" button not found – skipping.');
      return;
    }
    await this.runSchedulerBtn.click();

    const confirmBtn = this.page.locator(
      '.modal-footer button:has-text("Run Scheduler"), .modal-footer button:has-text("Confirm")',
    );
    if (await confirmBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await confirmBtn.click();
    }
    await this.page.waitForLoadState('domcontentloaded');
    logger.info('Scheduler run completed.');
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async assertRuleExists(productName: string): Promise<void> {
    await expect(this.ruleRow(productName)).toBeVisible({ timeout: 10_000 });
  }

  async assertRuleQtys(productName: string, minQty: number, maxQty: number): Promise<void> {
    const row = this.ruleRow(productName);
    await expect(row).toBeVisible({ timeout: 10_000 });

    await expect(
      row.locator('[name="product_min_qty"] span, [name="product_min_qty"] input').first(),
    ).toHaveText(new RegExp(`^${minQty}`));

    await expect(
      row.locator('[name="product_max_qty"] span, [name="product_max_qty"] input').first(),
    ).toHaveText(new RegExp(`^${maxQty}`));
  }
}
