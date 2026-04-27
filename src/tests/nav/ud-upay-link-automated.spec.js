// === FILE: src/tests/nav/ud-upay-link-automated.spec.js ===
/**
 * Automated spec for ED-76: Validate UPAY Link
 *
 * AC1:
 *   Given payment option details are displayed (accordion expanded)
 *   Then "Click here to pay via UPAY" link is displayed under
 *   "Pay through your other bank accounts or e-wallets via UPAY." section
 *
 * TestRail: C129
 */

const { test, expect } = require('../../fixtures');
const UdLoansGuidePage = require('../../pages/ud-loans-guide.page');
const TD = require('../../data/test-data');

test.describe('[UI] ED-76: Validate UPAY Link', { tag: [ '@regression'] }, () => {
  let guidePage;

  test.beforeEach(async ({ page }) => {
    guidePage = new UdLoansGuidePage(page);
    await guidePage.goto();
    try { await page.getByRole('button', { name: /i understand/i }).first().click({ timeout: 3000 }); } catch {}
    // Expand the accordion so payment option details are displayed
    await guidePage.expandHowToPayAccordion();
  });

  test('[C129] Test Case 1: Verify \'Click here to pay via UPAY\' link is visible under the UPAY payment section', async ({ page }) => {
    // Assert — correct page URL
    await expect(page).toHaveURL(TD.urlPatterns.guidesUdLoans, { timeout: 15000 });

    // Assert — UPAY section text is visible
    const upaySectionText = await guidePage.getUpaySectionText();
    await expect(upaySectionText).toBeVisible();
    await expect(upaySectionText).toContainText(TD.loansGuidePage.upaySection);

    // Assert — "Click here to pay via UPAY" link is visible under the UPAY section
    const upayLink = await guidePage.getUpayLink();
    await expect(upayLink).toBeVisible();
    await expect(upayLink).toHaveText(TD.loansGuidePage.upayLinkText);
    await expect(upayLink).toHaveAttribute('href', TD.loansGuidePage.upayLinkHref);
  });
});
