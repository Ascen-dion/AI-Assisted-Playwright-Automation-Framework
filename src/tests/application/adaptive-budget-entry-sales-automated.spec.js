const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const AdaptiveBudgetHeaderPage = require('../../pages/adaptive-budget-header.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const TD = require('../../data/adaptive-test-data');

test.describe('Budget Entry - Sales Page Tests', () => {
  let loginPage;
  let navigationPage;
  let budgetTabsPage;
  let budgetHeaderPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new AdaptiveLoginPage(page);
    navigationPage = new AdaptiveNavigationPage(page);
    budgetTabsPage = new AdaptiveBudgetTabsPage(page);
    budgetHeaderPage = new AdaptiveBudgetHeaderPage(page);
    dashboardPage = new AdaptiveDashboardPage(page);
  });

  test('CAP1-1 TS-001 TC-001 - Verify Instructions tab is default and content is displayed', async ({ page }) => {
    // Step 1: Launch the application in a browser
    await loginPage.navigate(TD.urls.login);
    await expect(page).toHaveURL(/login/i);

    // Step 2 & 3: Enter valid Sales Budget Owner credentials and login
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    
    // Verify dashboard/home page loads
    await expect(page).toHaveURL(TD.urlPatterns.dashboard);
    const isDashboardLoaded = await dashboardPage.isDashboardLoaded();
    expect(isDashboardLoaded).toBeTruthy();

    // Step 4: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToBudgetEntrySales();
    await expect(page).toHaveURL(TD.urlPatterns.budgetEntrySales);

    // Step 5: Verify the default selected tab
    const activeTab = await budgetTabsPage.getActiveTab();
    expect(activeTab).toBe(TD.tabs.defaultTab);
    
    const isInstructionsActive = await budgetTabsPage.isTabActive(TD.tabs.defaultTab);
    expect(isInstructionsActive).toBeTruthy();

    // Step 6: Verify the content displayed
    const isContentVisible = await budgetTabsPage.isTabContentVisible();
    expect(isContentVisible).toBeTruthy();
    
    const tabContent = await budgetTabsPage.getTabContent();
    const hasInstructionsContent = TD.content.instructionsKeywords.some(keyword => 
      tabContent.toLowerCase().includes(keyword.toLowerCase())
    );
    expect(hasInstructionsContent).toBeTruthy();
  });

  test('CAP1-1 TS-002 TC-001 - Verify all 12 tabs are present in correct order', async ({ page }) => {
    // Step 1: Launch the application in a browser
    await loginPage.navigate(TD.urls.login);
    await expect(page).toHaveURL(/login/i);

    // Step 2: Enter valid Sales Budget Owner credentials and login
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    await expect(page).toHaveURL(TD.urlPatterns.dashboard);

    // Step 3: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToBudgetEntrySales();
    await expect(page).toHaveURL(TD.urlPatterns.budgetEntrySales);

    // Step 4 & 5: Verify the presence and order of all tabs
    const allTabNames = await budgetTabsPage.getAllTabNames();
    expect(allTabNames.length).toBe(TD.tabs.allTabs.length);
    
    const isOrderCorrect = await budgetTabsPage.verifyTabOrder(TD.tabs.allTabs);
    expect(isOrderCorrect).toBeTruthy();

    // Verify each tab label matches the expected name
    for (let i = 0; i < TD.tabs.allTabs.length; i++) {
      expect(allTabNames[i]).toBe(TD.tabs.allTabs[i]);
    }
  });

  test('CAP1-1 TS-003 TC-001 - Verify tab highlighting behavior on tab clicks', async ({ page }) => {
    // Step 1: Launch the application and login as Sales Budget Owner
    await loginPage.navigate(TD.urls.login);
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    await expect(page).toHaveURL(TD.urlPatterns.dashboard);

    // Step 2: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToBudgetEntrySales();
    await expect(page).toHaveURL(TD.urlPatterns.budgetEntrySales);

    // Step 3: Verify Instructions tab is highlighted as active
    let isInstructionsActive = await budgetTabsPage.isTabActive('Instructions');
    expect(isInstructionsActive).toBeTruthy();

    // Step 4: Click on Target Revenue tab
    await budgetTabsPage.clickTab('Target Revenue');
    let isTargetRevenueActive = await budgetTabsPage.isTabActive('Target Revenue');
    expect(isTargetRevenueActive).toBeTruthy();
    isInstructionsActive = await budgetTabsPage.isTabActive('Instructions');
    expect(isInstructionsActive).toBeFalsy();
    const isContentVisible1 = await budgetTabsPage.isTabContentVisible();
    expect(isContentVisible1).toBeTruthy();

    // Step 5: Click on Workforce tab
    await budgetTabsPage.clickTab('Workforce');
    let isWorkforceActive = await budgetTabsPage.isTabActive('Workforce');
    expect(isWorkforceActive).toBeTruthy();
    isTargetRevenueActive = await budgetTabsPage.isTabActive('Target Revenue');
    expect(isTargetRevenueActive).toBeFalsy();
    const isContentVisible2 = await budgetTabsPage.isTabContentVisible();
    expect(isContentVisible2).toBeTruthy();

    // Step 6: Click on Pipeline tab
    await budgetTabsPage.clickTab('Pipeline');
    let isPipelineActive = await budgetTabsPage.isTabActive('Pipeline');
    expect(isPipelineActive).toBeTruthy();
    isWorkforceActive = await budgetTabsPage.isTabActive('Workforce');
    expect(isWorkforceActive).toBeFalsy();
    const isContentVisible3 = await budgetTabsPage.isTabContentVisible();
    expect(isContentVisible3).toBeTruthy();

    // Step 7: Click on Review tab
    await budgetTabsPage.clickTab('Review');
    let isReviewActive = await budgetTabsPage.isTabActive('Review');
    expect(isReviewActive).toBeTruthy();
    isPipelineActive = await budgetTabsPage.isTabActive('Pipeline');
    expect(isPipelineActive).toBeFalsy();
    const isContentVisible4 = await budgetTabsPage.isTabContentVisible();
    expect(isContentVisible4).toBeTruthy();

    // Step 8: Verify only one tab is highlighted at any given time
    const activeTab = await budgetTabsPage.getActiveTab();
    expect(activeTab).toBe('Review');
  });

  test('CAP1-1 TS-004 TC-001 - Verify tab scroll arrows functionality', async ({ page }) => {
    // Step 1: Launch the application and login as Sales Budget Owner
    await loginPage.navigate(TD.urls.login);
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    await expect(page).toHaveURL(TD.urlPatterns.dashboard);

    // Step 2: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToBudgetEntrySales();
    await expect(page).toHaveURL(TD.urlPatterns.budgetEntrySales);

    // Step 3: Resize the browser window to restrict the tab display area
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(1000);

    // Step 4: Verify the presence of left and right scroll arrows
    const isScrollLeftVisible = await budgetTabsPage.isScrollLeftButtonVisible();
    const isScrollRightVisible = await budgetTabsPage.isScrollRightButtonVisible();
    expect(isScrollLeftVisible || isScrollRightVisible).toBeTruthy();

    // Step 5: Verify the state of the left arrow when on the first tab
    if (isScrollLeftVisible) {
      const isLeftDisabled = await budgetTabsPage.isScrollLeftButtonDisabled();
      expect(isLeftDisabled).toBeTruthy();
    }

    // Step 6: Click on the right scroll arrow
    if (isScrollRightVisible) {
      await budgetTabsPage.clickScrollRight();
      
      // Verify the left arrow becomes enabled/active
      if (isScrollLeftVisible) {
        const isLeftDisabledAfterScroll = await budgetTabsPage.isScrollLeftButtonDisabled();
        expect(isLeftDisabledAfterScroll).toBeFalsy();
      }
    }

    // Step 7: Click on the left scroll arrow
    if (isScrollLeftVisible) {
      await budgetTabsPage.clickScrollLeft();
    }

    // Step 8: Continue clicking left arrow until reaching the first tab
    if (isScrollLeftVisible) {
      let isLeftDisabled = await budgetTabsPage.isScrollLeftButtonDisabled();
      let attempts = 0;
      while (!isLeftDisabled && attempts < 10) {
        await budgetTabsPage.clickScrollLeft();
        isLeftDisabled = await budgetTabsPage.isScrollLeftButtonDisabled();
        attempts++;
      }
      expect(isLeftDisabled).toBeTruthy();
    }
  });

  test('CAP1-1 TS-005 TC-001 - Verify context settings and Target Revenue sheet loads', async ({ page }) => {
    // Step 1: Launch the application and login as Sales Budget Owner
    await loginPage.navigate(TD.urls.login);
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    await expect(page).toHaveURL(TD.urlPatterns.dashboard);

    // Step 2: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToBudgetEntrySales();
    await expect(page).toHaveURL(TD.urlPatterns.budgetEntrySales);

    // Verify Instructions tab is active
    const isInstructionsActive = await budgetTabsPage.isTabActive('Instructions');
    expect(isInstructionsActive).toBeTruthy();

    // Step 3-6: Verify the context is set correctly
    const departmentContext = await budgetHeaderPage.getDepartmentContext();
    expect(departmentContext).toContain(TD.context.department);

    const timePeriodContext = await budgetHeaderPage.getTimePeriodContext();
    expect(timePeriodContext).toContain(TD.context.timePeriod);

    const currencyContext = await budgetHeaderPage.getCurrencyContext();
    expect(currencyContext).toContain(TD.context.currency);

    const planVersionContext = await budgetHeaderPage.getPlanVersionContext();
    expect(planVersionContext).toContain(TD.context.planVersion);

    // Step 7: Click on the Target Revenue tab
    await budgetTabsPage.clickTab('Target Revenue');
    const isTargetRevenueActive = await budgetTabsPage.isTabActive('Target Revenue');
    expect(isTargetRevenueActive).toBeTruthy();

    // Step 8 & 9: Verify the Target Revenue budget input sheet loads
    const isContentVisible = await budgetTabsPage.isTabContentVisible();
    expect(isContentVisible).toBeTruthy();

    // Verify the sheet displays data for the correct department
    const departmentContextAfterTabSwitch = await budgetHeaderPage.getDepartmentContext();
    expect(departmentContextAfterTabSwitch).toContain(TD.context.department);
  });
});