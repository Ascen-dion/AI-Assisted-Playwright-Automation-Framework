/**
 * odoo.fixtures.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom Playwright test fixtures for Odoo tests.
 *
 * Fixtures provided:
 *
 *  loginPage          – LoginPage instance (unauthenticated tab)
 *  authenticatedPage  – Page that is already logged in to Odoo.
 *                       Re-uses a persisted storage-state file when available
 *                       to avoid logging in before every single test.
 *  productListPage    – ProductListPage (requires auth)
 *  productFormPage    – ProductFormPage (requires auth)
 *  replenishmentPage  – ReplenishmentPage (requires auth)
 *  rfqListPage        – RfqListPage (requires auth)
 *  rfqFormPage        – RfqFormPage (requires auth)
 *
 * Usage in a spec:
 *
 *   import { test } from '@fixtures/odoo.fixtures';
 *
 *   test('my test', async ({ productListPage, productFormPage }) => { … });
 */

import * as fs   from 'fs';
import * as path from 'path';
import { test as base, type Page } from '@playwright/test';

import { LoginPage }          from '@pages/odoo/auth/LoginPage';
import { ProductListPage }    from '@pages/odoo/inventory/ProductListPage';
import { ProductFormPage }    from '@pages/odoo/inventory/ProductFormPage';
import { ReplenishmentPage }  from '@pages/odoo/inventory/ReplenishmentPage';
import { RfqListPage }        from '@pages/odoo/purchase/RfqListPage';
import { RfqFormPage }        from '@pages/odoo/purchase/RfqFormPage';
import { EMAIL, PASSWORD, getSkipReason } from '@utils/env';

// Path where we persist the authenticated browser state so subsequent tests
// can skip the full login flow.
const AUTH_STATE_FILE = path.resolve(__dirname, '../../.auth/odoo-auth.json');

// ─── Type declarations ────────────────────────────────────────────────────────

type OdooFixtures = {
  /** Raw unauthenticated LoginPage for explicit login tests */
  loginPage: LoginPage;
  /** A Page that has already completed the Odoo login flow */
  authenticatedPage: Page;
  productListPage:   ProductListPage;
  productFormPage:   ProductFormPage;
  replenishmentPage: ReplenishmentPage;
  rfqListPage:       RfqListPage;
  rfqFormPage:       RfqFormPage;
};

// ─── Extended test object ─────────────────────────────────────────────────────

export const test = base.extend<OdooFixtures>({

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  /**
   * Provides an authenticated Page.
   * Skips the test if Odoo credentials / URL are not properly configured.
   * Tries to load a saved storage state first; falls back to a full login.
   * Saves the state after a fresh login so the next test can reuse it.
   */
  authenticatedPage: async ({ browser }, use, testInfo) => {
    // Guard: skip if env is not configured
    const reason = getSkipReason();
    if (reason) {
      testInfo.skip(true, reason);
      return; // testInfo.skip() throws – this line is safety only
    }

    const storageStateExists = fs.existsSync(AUTH_STATE_FILE);

    const context = await browser.newContext(
      storageStateExists
        ? { storageState: AUTH_STATE_FILE }
        : {},
    );

    const page = await context.newPage();

    if (!storageStateExists) {
      const loginPage = new LoginPage(page);
      await loginPage.login(EMAIL, PASSWORD);

      // Persist auth state for future tests
      fs.mkdirSync(path.dirname(AUTH_STATE_FILE), { recursive: true });
      await context.storageState({ path: AUTH_STATE_FILE });
    }

    await use(page);
    await context.close();
  },

  // Each page-object fixture wires up to the shared authenticated page
  productListPage: async ({ authenticatedPage }, use) => {
    await use(new ProductListPage(authenticatedPage));
  },

  productFormPage: async ({ authenticatedPage }, use) => {
    await use(new ProductFormPage(authenticatedPage));
  },

  replenishmentPage: async ({ authenticatedPage }, use) => {
    await use(new ReplenishmentPage(authenticatedPage));
  },

  rfqListPage: async ({ authenticatedPage }, use) => {
    await use(new RfqListPage(authenticatedPage));
  },

  rfqFormPage: async ({ authenticatedPage }, use) => {
    await use(new RfqFormPage(authenticatedPage));
  },
});

export { expect } from '@playwright/test';
