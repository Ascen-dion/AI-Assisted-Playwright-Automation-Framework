// === FILE: src/tests/nav/ocbc-gateway-nav-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const OcbcGatewayNavPage = require('../../pages/ocbc-gateway-nav.page');
const TD = require('../../data/test-data');

test.describe('[UI] AC1: Navigate to Personal Banking via gateway Banking for individuals link', { tag: ['@smoke', '@regression'] }, () => {
  let gatewayPage;

  test.beforeEach(async ({ page }) => {
    gatewayPage = new OcbcGatewayNavPage(page);
    await gatewayPage.goto();
  });

  test('[C622] Test Case 1: Navigate to Personal Banking via Banking for individuals link on gateway page', async ({ page }) => {
    // Act
    await gatewayPage.clickBankingForIndividuals();
    await gatewayPage.clickPersonalBanking();

    // Assert
    await expect(page).toHaveURL(TD.urlPatterns.personalBanking, { timeout: 15000 });
  });
});
