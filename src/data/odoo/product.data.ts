/**
 * product.data.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Test-data definitions for Odoo product-related tests.
 *
 * Keeping data separate from page objects and specs means a single place to
 * change values when requirements evolve, and makes it easy to parameterise
 * tests with multiple data sets.
 */

export interface ProductData {
  /** Internal reference / display name used in Odoo */
  name: string;
  /** Odoo product type: 'goods' (Storable) | 'service' | 'consu' (Consumable) */
  type: 'goods' | 'service' | 'consu';
  /** Whether inventory tracking is required */
  trackInventory: boolean;
}

export interface VendorData {
  /** Name of an existing partner in the Odoo database */
  name: string;
  /** Minimum order quantity (optional) */
  minQty?: number;
  /** Vendor price (optional) */
  price?: number;
}

export interface ReplenishmentRuleData {
  productName: string;
  /** Minimum stock threshold that triggers replenishment */
  minQty: number;
  /** Target quantity after replenishment */
  maxQty: number;
  /** Odoo route to use, e.g. "Buy" */
  route?: string;
}

// ─── Default test data ───────────────────────────────────────────────────────

export const KIT_A_PRODUCT: ProductData = {
  name:           'KIT-A',
  type:           'goods',
  trackInventory: true,
};

export const AZURE_INTERIOR_VENDOR: VendorData = {
  name: process.env.ODOO_VENDOR ?? 'Azure Interior',
};

export const KIT_A_REPLENISHMENT_RULE: ReplenishmentRuleData = {
  productName: KIT_A_PRODUCT.name,
  minQty:      5,
  maxQty:      25,
  route:       'Buy',
};

/** On-hand quantity to set when simulating a stock drop below minimum */
export const STOCK_BELOW_MIN = 0;
