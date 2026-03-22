/**
 * odoo-inventory-kit-replenishment.spec.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Odoo Inventory – Kit Product + Min/Max Replenishment Rule
 *
 * Scenario (4 steps):
 *   1. Create product KIT-A  (Storable, Track Inventory ON)
 *   2. Enable the "Buy" route + add a vendor
 *   3. Create a Min/Max reordering rule  (Min: 5, Max: 25)
 *   4. Drop on-hand stock below Min → verify Odoo generates an RFQ
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * Requirements before running:
 *   $env:ODOO_BASE_URL = "https://yourcompany.odoo.com"
 *   $env:ODOO_EMAIL    = "admin@yourcompany.com"
 *   $env:ODOO_PASSWORD = "your-password"
 *   $env:ODOO_VENDOR   = "Azure Interior"  # optional, this is the default
 *
 * Run:
 *   npx playwright test tests/odoo/odoo-inventory-kit-replenishment.spec.ts \
 *     --headed --workers=1
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { test, expect }       from '@fixtures/odoo.fixtures';
import { getSkipReason }       from '@utils/env';
import {
  KIT_A_PRODUCT,
  AZURE_INTERIOR_VENDOR,
  KIT_A_REPLENISHMENT_RULE,
  STOCK_BELOW_MIN,
} from '@data/odoo/product.data';

// ─────────────────────────────────────────────────────────────────────────────
// Suite
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Odoo Inventory – Kit + Min/Max Replenishment', () => {

  test.setTimeout(180_000);

  // Skip the entire suite when Odoo credentials / URL are not configured.
  // test.skip() called at describe scope applies to all tests in the block.
  const _skipReason = getSkipReason();
  test.skip(!!_skipReason, _skipReason || 'Skipping – no reason provided');

  // ───────────────────────────────────────────────────────────────────────────
  // Step 1: Create the KIT-A product
  // ───────────────────────────────────────────────────────────────────────────
  test(
    'Step 1 – Create KIT-A product (Goods / Storable, inventory tracking ON)',
    async ({ authenticatedPage, productListPage, productFormPage }) => {

      // Navigate to Inventory app → Products
      await productListPage.openApp('Inventory');
      await productListPage.goto();
      await productListPage.clickNew();

      // Configure the product (name + type + tracking)
      await productFormPage.configure(KIT_A_PRODUCT);

      // Save and verify
      await productFormPage.saveRecord();
      await productFormPage.assertProductName(KIT_A_PRODUCT.name);
      await productFormPage.assertProductTypeContains(/Goods|Storable/i);
    },
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Step 2: Enable the Buy route + add a vendor
  // ───────────────────────────────────────────────────────────────────────────
  test(
    'Step 2 – Enable Buy route and add vendor on KIT-A',
    async ({ authenticatedPage, productListPage, productFormPage }) => {

      await productListPage.openApp('Inventory');
      await productListPage.goto();
      await productListPage.openProduct(KIT_A_PRODUCT.name);

      // Inventory tab – tick "Buy" route
      await productFormPage.enableRoute('Buy');
      await productFormPage.saveRecord();

      // Purchase tab – add vendor if missing
      await productFormPage.addVendorIfMissing(AZURE_INTERIOR_VENDOR);
      await productFormPage.saveRecord();

      // Assert both
      await productFormPage.assertRouteEnabled('Buy');
      await productFormPage.assertVendorExists();
    },
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Step 3: Create Min/Max reordering rule
  // ───────────────────────────────────────────────────────────────────────────
  test(
    'Step 3 – Create Min/Max reordering rule for KIT-A (Min: 5, Max: 25)',
    async ({ authenticatedPage, replenishmentPage }) => {

      await replenishmentPage.openApp('Inventory');
      await replenishmentPage.goto();
      await replenishmentPage.createRule(KIT_A_REPLENISHMENT_RULE);

      // Assert rule row shows correct values
      await replenishmentPage.assertRuleQtys(
        KIT_A_REPLENISHMENT_RULE.productName,
        KIT_A_REPLENISHMENT_RULE.minQty,
        KIT_A_REPLENISHMENT_RULE.maxQty,
      );
    },
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Step 4: Drop stock below Min → RFQ is generated
  // ───────────────────────────────────────────────────────────────────────────
  test(
    'Step 4 – Drop on-hand stock below Min and verify RFQ is generated',
    async ({ authenticatedPage, productListPage, productFormPage, replenishmentPage, rfqListPage }) => {

      // 4a. Reduce on-hand stock to 0 (below Min of 5)
      await productListPage.openApp('Inventory');
      await productListPage.goto();
      await productListPage.openProduct(KIT_A_PRODUCT.name);
      await productFormPage.updateQuantity(STOCK_BELOW_MIN);

      // 4b. Trigger replenishment manually
      await replenishmentPage.goto();
      await replenishmentPage.triggerReplenishment(KIT_A_PRODUCT.name);

      // 4c. Verify RFQ exists in Purchase module
      await rfqListPage.openApp('Purchase');
      await rfqListPage.goto();
      await rfqListPage.assertRfqExists(KIT_A_PRODUCT.name);
    },
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Step 4 (alt): Run Scheduler → RFQ on the form is in Draft state
  // ───────────────────────────────────────────────────────────────────────────
  test(
    'Step 4 (alt) – Run scheduler and verify RFQ order line and status',
    async ({ authenticatedPage, replenishmentPage, rfqListPage, rfqFormPage }) => {

      await replenishmentPage.openApp('Inventory');
      await replenishmentPage.goto();
      await replenishmentPage.runScheduler();

      // Open Purchase → RFQ list, search for KIT-A and open the record
      await rfqListPage.openApp('Purchase');
      await rfqListPage.goto();
      await rfqListPage.openRfqForProduct(KIT_A_PRODUCT.name);

      // Assert the RFQ contains the expected product line and is in Draft
      await rfqFormPage.assertOrderLineExists(KIT_A_PRODUCT.name);
      await rfqFormPage.assertStatusIsDraft();
    },
  );

});
