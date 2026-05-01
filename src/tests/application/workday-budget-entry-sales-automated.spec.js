const { test, expect } = require('../../fixtures');
const BudgetEntrySalesPage = require('../../pages/workday-budget-entry-sales.page');
const TD = require('../../data/workday-test-data');

test.describe('Budget Entry - Sales Page Tests', () => {
  let budgetPage;

  test.beforeEach(async ({ page }) => {
    budgetPage = new BudgetEntrySalesPage(page);
  });

  test('TS-001 TC-389: Verify default Instructions tab and content in Budget Entry - Sales page @regression', async ({ page }) => {
    // Step 1: Launch the application
    await budgetPage.goto(TD.APPLICATION_URL);
    await budgetPage.waitForPageLoad();
    
    // Step 2: Enter valid Sales Budget Owner credentials
    await budgetPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);
    
    // Step 3: Verify login and dashboard load
    await budgetPage.waitForDashboardLoad();
    await expect(page).toHaveURL(/app/, { timeout: 30000 });
    
    // Step 4: Navigate to Budget Entry - Sales page
    await budgetPage.navigateToBudgetEntrySales();
    await budgetPage.waitForPageLoad();
    
    // Step 5: Verify the default selected tab is Instructions
    const activeTabText = await budgetPage.getActiveTabText();
    expect(activeTabText).toContain('Instructions');
    
    const isInstructionsActive = await budgetPage.isTabActive('Instructions');
    expect(isInstructionsActive).toBeTruthy();
    
    // Step 6: Verify the Instructions content is displayed
    const isContentVisible = await budgetPage.isInstructionsContentVisible();
    expect(isContentVisible).toBeTruthy();
  });

  test('TS-002 TC-390: Verify presence and order of all tabs in Budget Entry - Sales page @regression', async ({ page }) => {
    // Step 1: Launch the application
    await budgetPage.goto(TD.APPLICATION_URL);
    await budgetPage.waitForPageLoad();
    
    // Step 2: Enter valid credentials and login
    await budgetPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);
    await budgetPage.waitForDashboardLoad();
    
    // Step 3: Navigate to Budget Entry - Sales page
    await budgetPage.navigateToBudgetEntrySales();
    await budgetPage.waitForPageLoad();
    
    // Step 4: Verify the presence and order of all 12 tabs
    const tabCount = await budgetPage.getTabCount();
    expect(tabCount).toBe(12);
    
    // Step 5: Verify each tab label matches the expected name and order
    const actualTabs = await budgetPage.getAllTabsText();
    
    for (let i = 0; i < TD.EXPECTED_TABS.length; i++) {
      expect(actualTabs[i]).toContain(TD.EXPECTED_TABS[i]);
    }
  });

  test('TS-003 TC-391: Verify tab highlighting and navigation in Budget Entry - Sales page @regression', async ({ page }) => {
    // Step 1: Launch and login as Sales Budget Owner
    await budgetPage.goto(TD.APPLICATION_URL);
    await budgetPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);
    await budgetPage.waitForDashboardLoad();
    
    // Step 2: Navigate to Budget Entry - Sales page
    await budgetPage.navigateToBudgetEntrySales();
    await budgetPage.waitForPageLoad();
    
    // Step 3: Verify Instructions tab is highlighted as active by default
    let isActive = await budgetPage.isTabActive('Instructions');
    expect(isActive).toBeTruthy();
    
    // Step 4: Click on Target Revenue tab
    await budgetPage.clickTab('Target Revenue');
    await page.waitForTimeout(1000); // Allow UI to update
    isActive = await budgetPage.isTabActive('Target Revenue');
    expect(isActive).toBeTruthy();
    
    // Verify Instructions is no longer active
    const activeTabText = await budgetPage.getActiveTabText();
    expect(activeTabText).not.toContain('Instructions');
    expect(activeTabText).toContain('Target Revenue');
    
    // Step 5: Click on Workforce tab
    await budgetPage.clickTab('Workforce');
    await page.waitForTimeout(1000);
    isActive = await budgetPage.isTabActive('Workforce');
    expect(isActive).toBeTruthy();
    
    // Step 6: Click on Pipeline tab
    await budgetPage.clickTab('Pipeline');
    await page.waitForTimeout(1000);
    isActive = await budgetPage.isTabActive('Pipeline');
    expect(isActive).toBeTruthy();
    
    // Step 7: Click on Review tab
    await budgetPage.clickTab('Review');
    await page.waitForTimeout(1000);
    isActive = await budgetPage.isTabActive('Review');
    expect(isActive).toBeTruthy();
    
    // Step 8: Verify only one tab is highlighted at any given time
    const finalActiveTabText = await budgetPage.getActiveTabText();
    expect(finalActiveTabText).toContain('Review');
  });

  test('TS-004 TC-392: Verify scroll arrows for tab navigation in Budget Entry - Sales page @regression', async ({ page }) => {
    // Step 1: Launch and login as Sales Budget Owner
    await budgetPage.goto(TD.APPLICATION_URL);
    await budgetPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);
    await budgetPage.waitForDashboardLoad();
    
    // Step 2: Navigate to Budget Entry - Sales page
    await budgetPage.navigateToBudgetEntrySales();
    await budgetPage.waitForPageLoad();
    
    // Step 3: Resize browser window to restrict tab display
    await budgetPage.resizeBrowserWindow(TD.REDUCED_WINDOW_WIDTH, TD.REDUCED_WINDOW_HEIGHT);
    await page.waitForTimeout(1000); // Allow UI to adjust
    
    // Step 4: Verify presence of scroll arrows
    const arrowsVisible = await budgetPage.areScrollArrowsVisible();
    expect(arrowsVisible).toBeTruthy();
    
    // Step 5: Verify left arrow is disabled on first tab
    const isLeftDisabled = await budgetPage.isLeftArrowDisabled();
    expect(isLeftDisabled).toBeTruthy();
    
    // Step 6: Click right scroll arrow
    await budgetPage.clickRightScrollArrow();
    await page.waitForTimeout(1000);
    
    // Verify left arrow becomes enabled
    const isLeftEnabledAfterScroll = await budgetPage.isLeftArrowDisabled();
    expect(isLeftEnabledAfterScroll).toBeFalsy();
    
    // Step 7: Click left scroll arrow
    await budgetPage.clickLeftScrollArrow();
    await page.waitForTimeout(1000);
    
    // Step 8: Continue clicking left until first tab and verify arrow is disabled
    let leftDisabled = await budgetPage.isLeftArrowDisabled();
    let attempts = 0;
    while (!leftDisabled && attempts < 5) {
      await budgetPage.clickLeftScrollArrow();
      await page.waitForTimeout(500);
      leftDisabled = await budgetPage.isLeftArrowDisabled();
      attempts++;
    }
    
    expect(leftDisabled).toBeTruthy();
  });

  test('TS-005 TC-393: Verify department, time period, currency, plan version context and Target Revenue sheet @regression', async ({ page }) => {
    // Step 1: Launch and login as Sales Budget Owner
    await budgetPage.goto(TD.APPLICATION_URL);
    await budgetPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);
    await budgetPage.waitForDashboardLoad();
    
    // Step 2: Navigate to Budget Entry - Sales page
    await budgetPage.navigateToBudgetEntrySales();
    await budgetPage.waitForPageLoad();
    
    // Step 3: Verify department context is set to Sales
    const department = await budgetPage.getDepartmentContext();
    expect(department).toContain(TD.EXPECTED_DEPARTMENT);
    
    // Step 4: Verify time period context is set to Q1
    const timePeriod = await budgetPage.getTimePeriodContext();
    expect(timePeriod).toContain(TD.EXPECTED_TIME_PERIOD);
    
    // Step 5: Verify currency context is set to USD
    const currency = await budgetPage.getCurrencyContext();
    expect(currency).toContain(TD.EXPECTED_CURRENCY);
    
    // Step 6: Verify plan version context is set to Initial
    const planVersion = await budgetPage.getPlanVersionContext();
    expect(planVersion).toContain(TD.EXPECTED_PLAN_VERSION);
    
    // Step 7: Click on Target Revenue tab
    await budgetPage.clickTab('Target Revenue');
    await page.waitForTimeout(1000);
    
    const isActive = await budgetPage.isTabActive('Target Revenue');
    expect(isActive).toBeTruthy();
    
    // Step 8: Verify Target Revenue budget input sheet loads
    const isSheetVisible = await budgetPage.isTargetRevenueSheetVisible();
    expect(isSheetVisible).toBeTruthy();
    
    // Step 9: Verify sheet displays data for Sales department
    const deptContext = await budgetPage.getDepartmentContext();
    expect(deptContext).toContain(TD.EXPECTED_DEPARTMENT);
  });
});