// === FILE: src/tests/nav/ud-loans-guide-automated.spec.js ===
/**
 * Automated spec for ED-74: Access UD Loans Payment Guide and validate expand option.
 *
 * AC1 (Validate Expand Option):
 *   Given user is on UD Loans Payment Guide page
 *   Then "+" icon is displayed to the right of "How To Pay Your UD Loans" text
 *   (verified via aria-expanded="false" on the collapsed accordion button)
 *
 * TestRail: C128
 */

const { test, expect } = require('../../fixtures');
const UdLoansGuidePage = require('../../pages/ud-loans-guide.page');
const TD = require('../../data/test-data');

test.describe('[UI] ED-74: Validate Expand Option on UD Loans Payment Guide', { tag: ['@smoke', '@regression'] }, () => {
  let guidePage;

  test.beforeEach(async ({ page }) => {
    guidePage = new UdLoansGuidePage(page);
    await guidePage.goto();
    try { await page.getByRole('button', { name: /i understand/i }).first().click({ timeout: 3000 }); } catch {}
  });

  test('[C128] Test Case 1: Verify \'+\' expand icon is visible on UD Loans Payment Guide accordion', async ({ page }) => {
    // Assert — page URL is correct
    await expect(page).toHaveURL(TD.urlPatterns.guidesUdLoans, { timeout: 15000 });

    // Assert — page title matches
    await expect(page).toHaveTitle(TD.pageTitles.udLoansGuide, { timeout: 15000 });

    // Assert — main page heading "UD LOANS PAYMENT GUIDES" is visible
    const heading = await guidePage.getPageHeading();
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(TD.loansGuidePage.pageHeading);

    // Assert — accordion button "How To Pay Your UD Loans" is visible
    const accordionBtn = await guidePage.getHowToPayAccordionButton();
    await expect(accordionBtn).toBeVisible();

    // Assert — accordion is in collapsed state (aria-expanded="false") which renders the "+" icon
    const expandedState = await guidePage.getHowToPayExpandedState();
    expect(expandedState).toBe('false');
  });
});
