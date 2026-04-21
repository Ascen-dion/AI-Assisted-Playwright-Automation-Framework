// === FILE: src/tests/nav/ocbc-accounts-nav-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const OcbcAccountsNavPage = require('../../pages/ocbc-accounts-nav.page');
const TD = require('../../data/test-data');

// ─────────────────────────────────────────────────────────────────────────────
//  AC4: Validate Apply Online Button on the 360 Account page
// ─────────────────────────────────────────────────────────────────────────────
test.describe('[UI] AC4: Validate Apply Online button on the 360 Account page', { tag: ['@smoke', '@regression'] }, () => {
  let accountsPage;

  test.beforeEach(async ({ page }) => {
    accountsPage = new OcbcAccountsNavPage(page);
    await accountsPage.gotoAccount360();
  });

  test('[C633] Test Case 2: Validate Apply Online button is visible and enabled on the 360 Account page', async ({ page }) => {
    // Assert — button is visible
    await expect(page.getByRole('link', { name: 'Apply online' }).first()).toBeVisible({ timeout: 15000 });

    // Assert — button is enabled (not disabled)
    await expect(page.getByRole('link', { name: 'Apply online' }).first()).toBeEnabled({ timeout: 15000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  AC3: Navigate to 360 Account page via Accounts dropdown
// ─────────────────────────────────────────────────────────────────────────────
test.describe('[UI] AC3: Navigate to 360 Account page via Accounts dropdown', { tag: ['@smoke', '@regression'] }, () => {
  let accountsPage;

  test.beforeEach(async ({ page }) => {
    accountsPage = new OcbcAccountsNavPage(page);
    await accountsPage.goto();
  });

  test('[C632] Test Case 1: Navigate to 360 Account page via Accounts dropdown', async ({ page }) => {
    // Act
    await accountsPage.openAccountsDropdown();
    await accountsPage.click360Account();

    // Assert
    await expect(page).toHaveURL(TD.urlPatterns.account360, { timeout: 15000 });
  });
});
