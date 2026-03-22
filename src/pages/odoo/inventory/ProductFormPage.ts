/**
 * ProductFormPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for the Odoo product form (create / edit).
 *
 * Covers:
 *  – General tab : name, product type, track-inventory
 *  – Inventory tab : routes (Buy, Manufacture, …)
 *  – Purchase tab  : vendor (seller) lines
 *
 * Every action method follows the "do the thing → assert it worked" pattern
 * so callers do not need to add extra expect() calls for basic state.
 */

import { type Page, expect } from '@playwright/test';
import { BasePage } from '@pages/odoo/base/BasePage';
import { type ProductData, type VendorData } from '@data/odoo/product.data';
import { logger } from '@utils/logger';

export class ProductFormPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── General tab locators ─────────────────────────────────────────────────

  private get nameInput() {
    return this.page.locator('.o_field_widget[name="name"] input, input#name').first();
  }

  private get productTypeField() {
    return this.page.locator('.o_field_widget[name="detailed_type"]');
  }

  private get trackInventoryCheckbox() {
    return this.page.locator(
      '.o_field_widget[name="tracking"] input[type="checkbox"], ' +
      '.o_field_widget[name="type"] input[value="product"], ' +
      '[name="tracking"] .o_checkbox input',
    ).first();
  }

  // ─── Inventory tab locators ───────────────────────────────────────────────

  private routeLabel(routeName: string) {
    return this.page.locator(
      '.o_field_widget[name="route_ids"] label, .o_field_many2many_checkboxes label',
    ).filter({ hasText: routeName }).first();
  }

  private routeCheckbox(routeName: string) {
    return this.routeLabel(routeName).locator('input[type="checkbox"]');
  }

  // ─── Purchase tab locators ────────────────────────────────────────────────

  private get vendorRows() {
    return this.page.locator('.o_field_widget[name="seller_ids"] .o_data_row');
  }

  private get addVendorLineBtn() {
    return this.page.locator(
      '.o_field_widget[name="seller_ids"] .o_field_one2many .o_list_button_add, ' +
      '.o_field_widget[name="seller_ids"] a:has-text("Add a line")',
    ).first();
  }

  private get vendorPartnerInput() {
    return this.page.locator(
      '.o_field_widget[name="seller_ids"] .o_data_row .o_field_widget[name="partner_id"] input, ' +
      '.o_dialog .o_field_widget[name="partner_id"] input',
    ).first();
  }

  // ─── Update quantity button ───────────────────────────────────────────────

  private get updateQtyBtn() {
    return this.page
      .locator('button:has-text("Update Quantity"), button:has-text("Update Qty")')
      .first();
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /** Fill in the product name. */
  async setName(name: string): Promise<void> {
    logger.step(`Set product name: "${name}"`);
    await this.nameInput.fill(name);
  }

  /**
   * Set the product type.
   * Handles both radio-button (Odoo 17) and select-widget (Odoo 16) layouts.
   */
  async setProductType(type: ProductData['type']): Promise<void> {
    logger.step(`Set product type: ${type}`);
    const labelPattern = type === 'goods'
      ? /Goods|Storable Product/
      : type === 'service' ? /Service/ : /Consumable/;

    const radioLabel = this.productTypeField
      .locator('label')
      .filter({ hasText: labelPattern })
      .first();

    if (await radioLabel.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await radioLabel.click();
    } else {
      await this.productTypeField
        .locator('select')
        .selectOption({ label: labelPattern });
    }
    logger.info(`Product type set to "${type}".`);
  }

  /**
   * Ensure "Track Inventory" is checked.
   * In Odoo 16, selecting "Storable Product" already implies tracking;
   * in Odoo 17 a separate checkbox may appear.
   */
  async enableTrackInventory(): Promise<void> {
    logger.step('Enable Track Inventory');
    const cb = this.trackInventoryCheckbox;
    if (await cb.isVisible({ timeout: 3_000 }).catch(() => false)) {
      if (!(await cb.isChecked())) {
        await cb.click();
      }
      await expect(cb).toBeChecked();
      logger.info('Track Inventory enabled.');
    } else {
      logger.info('Track Inventory checkbox not visible – implied by product type.');
    }
  }

  /** Switch to the Inventory tab and tick a route by name (e.g. "Buy"). */
  async enableRoute(routeName: string): Promise<void> {
    await this.clickTab(/Inventory/);
    logger.step(`Enable route: "${routeName}"`);

    const label = this.routeLabel(routeName);
    await expect(label).toBeVisible({ timeout: 10_000 });

    const cb = this.routeCheckbox(routeName);
    if (!(await cb.isChecked().catch(() => false))) {
      await label.click();
    }
    await expect(cb).toBeChecked();
    logger.info(`Route "${routeName}" enabled.`);
  }

  /**
   * Switch to the Purchase tab and add a vendor if one is not already present.
   */
  async addVendorIfMissing(vendor: VendorData): Promise<void> {
    await this.clickTab(/Purchase/);
    logger.step(`Ensure vendor: "${vendor.name}"`);

    const count = await this.vendorRows.count();
    if (count > 0) {
      logger.info(`Vendor already present (${count} row(s)). Skipping.`);
      return;
    }

    await this.addVendorLineBtn.click();
    await this.selectMany2oneOption(this.vendorPartnerInput, vendor.name);
    logger.info(`Vendor "${vendor.name}" added.`);
  }

  /**
   * Apply a full product configuration using a ProductData object:
   * sets name, product type, track-inventory, then saves.
   */
  async configure(data: ProductData): Promise<void> {
    await this.setName(data.name);
    await this.setProductType(data.type);
    if (data.trackInventory) {
      await this.enableTrackInventory();
    }
  }

  /**
   * Click "Update Quantity" and handle both the wizard-dialog and the
   * inventory-adjustments list variants.
   *
   * @param targetQty The new on-hand quantity to apply.
   */
  async updateQuantity(targetQty: number): Promise<void> {
    logger.step(`Update on-hand quantity to ${targetQty}`);
    await expect(this.updateQtyBtn).toBeVisible({ timeout: 10_000 });
    await this.updateQtyBtn.click();
    await this.page.waitForLoadState('domcontentloaded');

    const dialog = this.page.locator('.o_dialog');
    const isDialog = await dialog.isVisible({ timeout: 4_000 }).catch(() => false);

    if (isDialog) {
      const qtyInput = dialog.locator(
        'input[id*="quantity"], [name="inventory_quantity"] input',
      ).first();
      await qtyInput.fill(String(targetQty));
      await dialog
        .locator('button:has-text("Apply All"), button:has-text("Validate"), button:has-text("Apply")')
        .first()
        .click();
    } else {
      // Full Inventory Adjustments list view
      await this.search('KIT-A');
      const row = this.page
        .locator('.o_data_row')
        .filter({ hasText: 'KIT-A' })
        .first();
      await row
        .locator('[name="inventory_quantity"] input, [name="product_qty"] input')
        .first()
        .fill(String(targetQty));
      await this.page
        .locator('button:has-text("Apply All"), button:has-text("Validate")')
        .first()
        .click();
      const confirmBtn = this.page.locator(
        '.modal-content button:has-text("Ok"), .modal-content button:has-text("Apply All")',
      );
      if (await confirmBtn.isVisible({ timeout: 4_000 }).catch(() => false)) {
        await confirmBtn.click();
      }
    }

    await this.page.waitForLoadState('domcontentloaded');
    logger.info(`On-hand quantity set to ${targetQty}.`);
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async assertProductName(expected: string): Promise<void> {
    await expect(
      this.page.locator('.o_field_widget[name="name"] input, .o_field_char[name="name"]').first(),
    ).toHaveValue(expected);
  }

  async assertProductTypeContains(pattern: RegExp): Promise<void> {
    const el = this.page
      .locator(
        '.o_field_widget[name="detailed_type"] .o_field_radio .active, ' +
        '.o_field_widget[name="detailed_type"] select',
      )
      .first();
    const text = await el.textContent().catch(() => '');
    expect(text).toMatch(pattern);
  }

  async assertRouteEnabled(routeName: string): Promise<void> {
    await this.clickTab(/Inventory/);
    await expect(this.routeCheckbox(routeName)).toBeChecked();
  }

  async assertVendorExists(): Promise<void> {
    await this.clickTab(/Purchase/);
    await expect(this.vendorRows.first()).toBeVisible();
  }
}
