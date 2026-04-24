// === FILE: src/tests/nav/ud-loan-payment-guides-nav-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const UdLoanPaymentGuidesNavPage = require('../../pages/ud-loan-payment-guides-nav.page');
const TD = require('../../data/test-data');

test.describe('[UI] AC1: Navigate to Loan Payment Guides Page', { tag: ['@smoke', '@regression'] }, () => {
  let navPage;

  test.beforeEach(async ({ page }) => {
    navPage = new UdLoanPaymentGuidesNavPage(page);
    await navPage.goto();
    await navPage.dismissCookieConsent();
  });

  test('[C127] Test Case 1: Navigate to UD Loans Payment Guide page via Loan Payment Guides dropdown', async ({ page }) => {
    // Act
    await navPage.navigateToUdLoans();

    // Assert
    await expect(page).toHaveURL(TD.urlPatterns.guidesUdLoans, { timeout: 15000 });
  });
});
