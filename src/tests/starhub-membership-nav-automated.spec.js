// === FILE: src/tests/starhub-membership-nav-automated.spec.js ===
const { test, expect } = require('@playwright/test');
const StarhubMembershipNavPage = require('../pages/starhub-membership-nav.page');

test.describe('[UI] AC8: Membership Tab Navigation to Membership Overview', () => {
  let membershipNavPage;

  test.beforeEach(async ({ page }) => {
    membershipNavPage = new StarhubMembershipNavPage(page);
    await membershipNavPage.goto();
    await membershipNavPage.dismissCookieConsent();
  });

  test('[C572] Test Case 8: Navigate to Membership overview via Membership dropdown', async ({ page }) => {
    // Act
    await membershipNavPage.openMembershipDropdown();
    await membershipNavPage.clickMembershipOverview();

    // Assert — URL navigates to Membership overview page
    await expect(page).toHaveURL('https://www.starhub.com/personal/membership.html', { timeout: 15000 });

    // Assert — page title confirms correct destination
    await expect(page).toHaveTitle(/membership/i, { timeout: 15000 });
  });
});
