// === FILE: src/tests/nav/ud-loan-payment-page-automated.spec.js ===
/**
 * Automated spec for ED-77: Navigate to Loan Payment Page
 *
 * AC1:
 *   Given the "How To Pay Your UD Loans" accordion is expanded
 *   Then "Free UnionBank payment options" section is visible on the Loan Payment page
 *
 * AC2:
 *   Given the "How To Pay Your UD Loans" accordion is expanded
 *   Then "Pay through your other bank accounts or e-wallets via UPAY" section is visible
 *   on the Loan Payment page
 *
 * TestRail: C211, C212
 */

const { test, expect } = require('../../fixtures');
const UdLoansGuidePage = require('../../pages/ud-loans-guide.page');
const TD = require('../../data/test-data');

test.describe('[UI] ED-77: Navigate to Loan Payment Page', { tag: ['@smoke', '@regression'] }, () => {
  let guidePage;

  test.beforeEach(async ({ page }) => {
    guidePage = new UdLoansGuidePage(page);
    await guidePage.goto();
    try { await page.getByRole('button', { name: /i understand/i }).first().click({ timeout: 3000 }); } catch {}
    // Expand accordion so payment option sections are visible
    await guidePage.expandHowToPayAccordion();
  });

  test('[C211] Test Case 1: Verify Free UnionBank payment options section is visible', async ({ page }) => {
    // Assert — correct page URL
    await expect(page).toHaveURL(TD.urlPatterns.guidesUdLoans, { timeout: 15000 });

    // Assert — "1. Free UnionBank payment options" section heading is visible
    const freeOption = await guidePage.getFreeUnionBankOptionText();
    await expect(freeOption).toBeVisible();
    await expect(freeOption).toContainText(TD.loansGuidePage.freeUnionBankOption);
  });

  test('[C212] Test Case 2: Verify UPAY payment section is visible on Loan Payment page', async ({ page }) => {
    // Assert — correct page URL
    await expect(page).toHaveURL(TD.urlPatterns.guidesUdLoans, { timeout: 15000 });

    // Assert — "2. Pay through your other bank accounts or e-wallets via UPAY." section is visible
    const upaySection = await guidePage.getUpaySectionText();
    await expect(upaySection).toBeVisible();
    await expect(upaySection).toContainText(TD.loansGuidePage.upaySection);
  });
});
