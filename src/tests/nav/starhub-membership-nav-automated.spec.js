// === FILE: src/tests/nav/starhub-membership-nav-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const StarhubMembershipNavPage = require('../../pages/starhub-membership-nav.page');
const TD = require('../../data/test-data');

test.describe('[UI] AC8: Membership Tab Navigation to Membership Overview', { tag: ['@smoke', '@regression'] }, () => {
  let membershipNavPage;

  test.beforeEach(async ({ page }) => {
    membershipNavPage = new StarhubMembershipNavPage(page);
    await membershipNavPage.goto();
    try {
      await page.getByRole('button', { name: /got it/i }).first().click({ timeout: 3000 });
    } catch {}
  });

  test('[C572] Test Case 8: Navigate to Membership overview via Membership dropdown', async ({ page }) => {
    // Act
    await membershipNavPage.openMembershipDropdown();
    await membershipNavPage.clickMembershipOverview();

    // Assert — URL navigates to Membership overview page
    await expect(page).toHaveURL(TD.urls.membership, { timeout: 15000 });

    // Assert — page title confirms correct destination
    await expect(page).toHaveTitle(TD.pageTitles.membership, { timeout: 15000 });
  });
});
