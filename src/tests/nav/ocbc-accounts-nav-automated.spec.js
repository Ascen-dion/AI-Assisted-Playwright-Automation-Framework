// === FILE: src/tests/nav/ocbc-accounts-nav-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const OcbcAccountsNavPage = require('../../pages/ocbc-accounts-nav.page');
const TD = require('../../data/test-data');

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
