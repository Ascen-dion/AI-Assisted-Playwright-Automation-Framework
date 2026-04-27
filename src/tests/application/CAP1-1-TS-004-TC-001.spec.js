/**
 * Test Spec: CAP1-1 TS-004 TC-001
 * Verify tab scrolling functionality on smaller screens
 */

const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const NavigationPage = require('../../pages/navigation.page');
const BudgetEntrySalesPage = require('../../pages/budget-entry-sales.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-004: Verify Tab Scrolling', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let navigationPage;
  let budgetPage;

  test('[CAP1-1 TS-004 TC-001] Verify scroll arrows appear and work on small screens', async ({ page }) => {
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);
    budgetPage = new BudgetEntrySalesPage(page);

    // Step 1-2: Login and navigate
    await loginPage.goto();
    await loginPage.login(TD.VALID_USERNAME, TD.VALID_PASSWORD);
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');

    // Step 3: Resize browser to smaller width
    await page.setViewportSize(TD.VIEWPORT_SMALL);
    await page.waitForTimeout(1000);

    // Step 4: Verify scroll arrows are visible
    const isLeftVisible = await budgetPage.isScrollLeftVisible();
    const isRightVisible = await budgetPage.isScrollRightVisible();
    await expect(isRightVisible).toBeTruthy();

    // Step 5: Click right scroll arrow
    await budgetPage.clickScrollRight();
    await page.waitForTimeout(500);
    
    // Verify tabs scrolled
    const isLeftVisibleAfter = await budgetPage.isScrollLeftVisible();
    await expect(isLeftVisibleAfter).toBeTruthy();

    // Step 6: Click left scroll arrow
    await budgetPage.clickScrollLeft();
    await page.waitForTimeout(500);

    // Step 7: Continue clicking right until last tab
    let isDisabled = false;
    let attempts = 0;
    while (!isDisabled && attempts < 15) {
      await budgetPage.clickScrollRight();
      await page.waitForTimeout(500);
      isDisabled = await budgetPage.isScrollRightDisabled();
      attempts++;
    }
    
    // Verify right arrow is disabled at the end
    await expect(isDisabled).toBeTruthy();
  });
});