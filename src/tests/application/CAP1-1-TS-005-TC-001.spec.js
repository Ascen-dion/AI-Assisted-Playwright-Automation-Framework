/**
 * Test Spec: CAP1-1 TS-005 TC-001
 * Verify left scroll arrow is disabled on first tab
 */

const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const NavigationPage = require('../../pages/navigation.page');
const BudgetEntrySalesPage = require('../../pages/budget-entry-sales.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-005: Verify Left Scroll Arrow Disabled', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let navigationPage;
  let budgetPage;

  test('[CAP1-1 TS-005 TC-001] Verify left arrow is disabled on first tab', async ({ page }) => {
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);
    budgetPage = new BudgetEntrySalesPage(page);

    // Step 1-2: Login and navigate
    await loginPage.goto();
    await loginPage.login(TD.VALID_USERNAME, TD.VALID_PASSWORD);
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');

    // Step 3: Resize to small window
    await page.setViewportSize(TD.VIEWPORT_SMALL);
    await page.waitForTimeout(1000);

    // Step 4: Verify on Instructions tab
    const activeTab = await budgetPage.getActiveTabName();
    await expect(activeTab.trim()).toBe('Instructions');

    // Step 5: Verify left scroll arrow is disabled
    const isLeftDisabled = await budgetPage.isScrollLeftDisabled();
    await expect(isLeftDisabled).toBeTruthy();

    // Step 6: Attempt to click disabled left arrow (should not scroll)
    const activeTabBefore = await budgetPage.getActiveTabName();
    await budgetPage.clickScrollLeft();
    const activeTabAfter = await budgetPage.getActiveTabName();
    await expect(activeTabBefore).toBe(activeTabAfter);

    // Step 7: Click right arrow and verify left arrow becomes enabled
    await budgetPage.clickScrollRight();
    await page.waitForTimeout(500);
    const isLeftDisabledAfter = await budgetPage.isScrollLeftDisabled();
    await expect(isLeftDisabledAfter).toBeFalsy();
  });
});