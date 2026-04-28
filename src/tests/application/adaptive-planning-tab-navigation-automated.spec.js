// === FILE: src/tests/application/adaptive-planning-tab-navigation-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const AdaptivePlanningPage = require('../../pages/adaptive-planning.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] Adaptive Planning: Tab Navigation — Budget Entry - Sales', {
  tag: ['@smoke', '@regression', '@adaptive-planning'],
}, () => {
  let planning;

  // Run tests serially to avoid parallel login contention
  test.describe.configure({ mode: 'serial' });

  // Increase timeout — login + redirect + dashboard load can take 30-40s
  test.setTimeout(120000);

  /**
   * Helper: login and navigate to Budget Entry - Sales.
   * Each test is independent — login + navigate per test.
   */
  async function loginAndNavigate(page) {
    planning = new AdaptivePlanningPage(page);
    await planning.gotoLogin();
    await planning.loginWithDefaults();
    // Wait for post-login redirect to complete
    await page.waitForURL(/adaptiveplanning\.com/, { timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 60000 });
    // Wait for tab bar to be ready
    await page.locator('[role="tablist"]').waitFor({ state: 'visible', timeout: 60000 });
    // Dismiss any popups (e.g. "Level is Required")
    try {
      const popup = page.locator('.toast, [role="alert"], [role="dialog"]').first();
      await popup.waitFor({ state: 'visible', timeout: 3000 });
      await page.keyboard.press('Escape');
    } catch {
      // No popup — continue
    }
  }

  // ── AC-001: Default landing tab is Instructions ─────────────────────────
  test('[C389] Test Case 1: Budget Entry Sales page lands on Instructions tab by default', async ({ page }) => {
    await loginAndNavigate(page);

    const activeTab = await planning.getActiveTabText();
    expect(activeTab).toBe(TD.budgetEntry.defaultTab);

    const isActive = await planning.isTabActive(TD.budgetEntry.defaultTab);
    expect(isActive).toBe(true);

    const hasContent = await planning.isTabContentVisible();
    expect(hasContent).toBe(true);
  });

  // ── AC-002: All 12 tabs visible in correct order ────────────────────────
  test('[C390] Test Case 2: All 12 budget section tabs are visible in correct order', async ({ page }) => {
    await loginAndNavigate(page);

    const tabCount = await planning.getTabCount();
    expect(tabCount).toBe(TD.budgetEntry.tabCount);

    const tabLabels = await planning.getAllTabLabels();
    expect(tabLabels).toEqual(TD.budgetEntry.tabLabels);
  });

  // ── AC-003: Clicking a tab highlights it and loads content ──────────────
  test('[C391] Test Case 3: Clicking a tab highlights it and loads its content', async ({ page }) => {
    await loginAndNavigate(page);

    // Click Target Revenue tab
    await planning.clickTab('Target Revenue');

    // Verify Target Revenue is now active
    const isActive = await planning.isTabActive('Target Revenue');
    expect(isActive).toBe(true);

    // Verify Instructions is no longer active
    const isInstructionsActive = await planning.isTabActive('Instructions');
    expect(isInstructionsActive).toBe(false);

    // Verify content area has loaded
    const hasContent = await planning.isTabContentVisible();
    expect(hasContent).toBe(true);
  });

  // ── AC-004: Scroll arrows and left arrow disabled at start ─────────────
  test('[C392] Test Case 4: Tab scroll arrows appear and left arrow is disabled at start', async ({ page }) => {
    await loginAndNavigate(page);

    // Verify scroll arrows are visible
    const scrollLeftVisible = await planning.isScrollLeftVisible();
    expect(scrollLeftVisible).toBe(true);

    const scrollRightVisible = await planning.isScrollRightVisible();
    expect(scrollRightVisible).toBe(true);

    // Left arrow should be disabled when on the first tab
    const isLeftDisabled = await planning.isScrollLeftDisabled();
    expect(isLeftDisabled).toBe(true);
  });

  // ── AC-005: Budget input sheets load for revenue/expense/workforce/product tabs
  test('[C393] Test Case 5: Budget input sheet loads for Target Revenue, Target Expense, Workforce, Product Revenue', async ({ page }) => {
    await loginAndNavigate(page);

    for (const tabName of TD.budgetEntry.budgetInputTabs) {
      await planning.clickTab(tabName);

      const isActive = await planning.isTabActive(tabName);
      expect(isActive).toBe(true);

      const hasContent = await planning.isTabContentVisible();
      expect(hasContent).toBe(true);
    }
  });

  // // ── AC-006: Planning view loads for Sensitivity Analysis and Pipeline ───
  // test('[C0] Test Case 6: Planning view loads for Sensitivity Analysis and Pipeline tabs', async ({ page }) => {
  //   await loginAndNavigate(page);

  //   for (const tabName of TD.budgetEntry.planningViewTabs) {
  //     await planning.clickTab(tabName);

  //     const isActive = await planning.isTabActive(tabName);
  //     expect(isActive).toBe(true);

  //     const hasContent = await planning.isTabContentVisible();
  //     expect(hasContent).toBe(true);
  //   }
  // });

  // // ── AC-007: Cost planning sheet loads for Travel, Capital, Expenses ─────
  // test('[C0] Test Case 7: Cost planning sheet loads for Travel, Capital, Expenses tabs', async ({ page }) => {
  //   await loginAndNavigate(page);

  //   for (const tabName of TD.budgetEntry.costPlanningTabs) {
  //     await planning.clickTab(tabName);

  //     const isActive = await planning.isTabActive(tabName);
  //     expect(isActive).toBe(true);

  //     const hasContent = await planning.isTabContentVisible();
  //     expect(hasContent).toBe(true);
  //   }
  // });

  // // ── AC-008: Summary view loads for Variances and Review ─────────────────
  // test('[C0] Test Case 8: Summary view loads for Variances and Review tabs', async ({ page }) => {
  //   await loginAndNavigate(page);

  //   for (const tabName of TD.budgetEntry.summaryTabs) {
  //     await planning.clickTab(tabName);

  //     const isActive = await planning.isTabActive(tabName);
  //     expect(isActive).toBe(true);

  //     const hasContent = await planning.isTabContentVisible();
  //     expect(hasContent).toBe(true);
  //   }
  // });

  // // ── AC-009: Context selectors persist across tab switches ───────────────
  // test('[C0] Test Case 9: Context selectors persist when switching tabs', async ({ page }) => {
  //   await loginAndNavigate(page);

  //   // Capture initial context values on Instructions tab
  //   const versionBefore = await planning.getVersionText();

  //   // Switch to Target Revenue
  //   await planning.clickTab('Target Revenue');
  //   const versionAfterFirst = await planning.getVersionText();
  //   expect(versionAfterFirst).toBe(versionBefore);

  //   // Switch to Expenses
  //   await planning.clickTab('Expenses');
  //   const versionAfterSecond = await planning.getVersionText();
  //   expect(versionAfterSecond).toBe(versionBefore);
  // });

  // // ── AC-010: Back button navigates to previous page ──────────────────────
  // test('[C0] Test Case 10: Back button navigates to previous page', async ({ page }) => {
  //   await loginAndNavigate(page);

  //   // Capture current URL
  //   const budgetUrl = page.url();

  //   // Click Back button
  //   await planning.clickBackButton();

  //   // Verify URL has changed
  //   const newUrl = page.url();
  //   expect(newUrl).not.toBe(budgetUrl);
  // });
});
