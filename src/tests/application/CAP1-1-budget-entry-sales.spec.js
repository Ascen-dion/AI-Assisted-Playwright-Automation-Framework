const { test, expect } = require('../../fixtures');
const BudgetEntrySalesPage = require('../../pages/budget-entry-sales.page');
const LoginPage = require('../../pages/login.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] CAP1-1: Budget Entry - Sales Tab Navigation and Content Display', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let budgetEntrySalesPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    budgetEntrySalesPage = new BudgetEntrySalesPage(page);
    
    // Login to application
    await loginPage.goto();
    await loginPage.login(process.env.ADAPTIVE_USERNAME, process.env.ADAPTIVE_PASSWORD);
    await expect(page).toHaveURL(TD.urlPatterns.homePage);
  });

  test('[CAP1-1 TS-001 TC-001] Verify Instructions tab is active by default on Budget Entry - Sales page load', async ({ page }) => {
    // Navigate to Budget Entry - Sales page
    await budgetEntrySalesPage.gotoBudgetEntrySales();
    
    // Verify Budget Entry - Sales page loads successfully
    await expect(page).toHaveURL(TD.urlPatterns.budgetEntrySalesPage);
    
    // Verify Instructions tab is highlighted as active by default
    await expect(budgetEntrySalesPage.locators.instructionsTab).toHaveClass(/active|selected|highlighted/);
    
    // Verify Instructions content is displayed
    await expect(budgetEntrySalesPage.locators.instructionsContent).toBeVisible();
    await expect(budgetEntrySalesPage.locators.instructionsContent).toContainText(/budget guidelines|due dates/i);
  });

  test('[CAP1-1 TS-002 TC-001] Verify all 12 tabs are visible in correct order', async ({ page }) => {
    await budgetEntrySalesPage.gotoBudgetEntrySales();
    
    // Verify all 12 tabs are displayed
    const tabs = await budgetEntrySalesPage.getAllTabs();
    expect(tabs.length).toBe(12);
    
    // Verify tabs are in correct order
    const expectedTabOrder = [
      'Instructions',
      'Target Revenue',
      'Target Expense',
      'Workforce',
      'Product Revenue',
      'Sensitivity Analysis',
      'Pipeline',
      'Travel',
      'Capital',
      'Expenses',
      'Variances',
      'Review'
    ];
    
    for (let i = 0; i < expectedTabOrder.length; i++) {
      await expect(tabs[i]).toContainText(expectedTabOrder[i]);
    }
  });

  test('[CAP1-1 TS-003 TC-001] Verify only one tab is highlighted at a time when switching between tabs', async ({ page }) => {
    await budgetEntrySalesPage.gotoBudgetEntrySales();
    
    // Verify Instructions tab is initially highlighted
    await expect(budgetEntrySalesPage.locators.instructionsTab).toHaveClass(/active|selected|highlighted/);
    await budgetEntrySalesPage.verifyOnlyOneTabIsActive('Instructions');
    
    // Click Target Revenue tab and verify
    await budgetEntrySalesPage.clickTab('Target Revenue');
    await expect(budgetEntrySalesPage.locators.targetRevenueTab).toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.instructionsTab).not.toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.targetRevenueContent).toBeVisible();
    await budgetEntrySalesPage.verifyOnlyOneTabIsActive('Target Revenue');
    
    // Click Target Expense tab and verify
    await budgetEntrySalesPage.clickTab('Target Expense');
    await expect(budgetEntrySalesPage.locators.targetExpenseTab).toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.targetRevenueTab).not.toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.targetExpenseContent).toBeVisible();
    await budgetEntrySalesPage.verifyOnlyOneTabIsActive('Target Expense');
    
    // Click Workforce tab and verify
    await budgetEntrySalesPage.clickTab('Workforce');
    await expect(budgetEntrySalesPage.locators.workforceTab).toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.targetExpenseTab).not.toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.workforceContent).toBeVisible();
    await budgetEntrySalesPage.verifyOnlyOneTabIsActive('Workforce');
    
    // Click Product Revenue tab and verify
    await budgetEntrySalesPage.clickTab('Product Revenue');
    await expect(budgetEntrySalesPage.locators.productRevenueTab).toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.workforceTab).not.toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.productRevenueContent).toBeVisible();
    await budgetEntrySalesPage.verifyOnlyOneTabIsActive('Product Revenue');
    
    // Click Sensitivity Analysis tab and verify
    await budgetEntrySalesPage.clickTab('Sensitivity Analysis');
    await expect(budgetEntrySalesPage.locators.sensitivityAnalysisTab).toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.productRevenueTab).not.toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.sensitivityAnalysisContent).toBeVisible();
    await budgetEntrySalesPage.verifyOnlyOneTabIsActive('Sensitivity Analysis');
    
    // Click Pipeline tab and verify
    await budgetEntrySalesPage.clickTab('Pipeline');
    await expect(budgetEntrySalesPage.locators.pipelineTab).toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.sensitivityAnalysisTab).not.toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.pipelineContent).toBeVisible();
    await budgetEntrySalesPage.verifyOnlyOneTabIsActive('Pipeline');
    
    // Click Travel tab and verify
    await budgetEntrySalesPage.clickTab('Travel');
    await expect(budgetEntrySalesPage.locators.travelTab).toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.pipelineTab).not.toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.travelContent).toBeVisible();
    await budgetEntrySalesPage.verifyOnlyOneTabIsActive('Travel');
    
    // Click Capital tab and verify
    await budgetEntrySalesPage.clickTab('Capital');
    await expect(budgetEntrySalesPage.locators.capitalTab).toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.travelTab).not.toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.capitalContent).toBeVisible();
    await budgetEntrySalesPage.verifyOnlyOneTabIsActive('Capital');
    
    // Click Expenses tab and verify
    await budgetEntrySalesPage.clickTab('Expenses');
    await expect(budgetEntrySalesPage.locators.expensesTab).toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.capitalTab).not.toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.expensesContent).toBeVisible();
    await budgetEntrySalesPage.verifyOnlyOneTabIsActive('Expenses');
    
    // Click Variances tab and verify
    await budgetEntrySalesPage.clickTab('Variances');
    await expect(budgetEntrySalesPage.locators.variancesTab).toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.expensesTab).not.toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.variancesContent).toBeVisible();
    await budgetEntrySalesPage.verifyOnlyOneTabIsActive('Variances');
    
    // Click Review tab and verify
    await budgetEntrySalesPage.clickTab('Review');
    await expect(budgetEntrySalesPage.locators.reviewTab).toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.variancesTab).not.toHaveClass(/active|selected|highlighted/);
    await expect(budgetEntrySalesPage.locators.reviewContent).toBeVisible();
    await budgetEntrySalesPage.verifyOnlyOneTabIsActive('Review');
  });

  test('[CAP1-1 TS-004 TC-001] Verify tab scrolling arrows work correctly in narrow viewport', async ({ page }) => {
    // Resize browser to narrow width
    await page.setViewportSize({ width: 800, height: 600 });
    
    await budgetEntrySalesPage.gotoBudgetEntrySales();
    
    // Verify scroll arrows are visible
    await expect(budgetEntrySalesPage.locators.leftScrollArrow).toBeVisible();
    await expect(budgetEntrySalesPage.locators.rightScrollArrow).toBeVisible();
    
    // Verify left arrow is disabled initially
    await expect(budgetEntrySalesPage.locators.leftScrollArrow).toBeDisabled();
    
    // Click right arrow and verify it scrolls
    await budgetEntrySalesPage.locators.rightScrollArrow.click();
    await page.waitForTimeout(500); // Wait for scroll animation
    await expect(budgetEntrySalesPage.locators.leftScrollArrow).toBeEnabled();
    
    // Continue scrolling right until last tab is visible
    let rightArrowEnabled = await budgetEntrySalesPage.locators.rightScrollArrow.isEnabled();
    while (rightArrowEnabled) {
      await budgetEntrySalesPage.locators.rightScrollArrow.click();
      await page.waitForTimeout(500);
      rightArrowEnabled = await budgetEntrySalesPage.locators.rightScrollArrow.isEnabled();
    }
    
    // Verify right arrow is now disabled
    await expect(budgetEntrySalesPage.locators.rightScrollArrow).toBeDisabled();
    
    // Click left arrow and verify it scrolls back
    await budgetEntrySalesPage.locators.leftScrollArrow.click();
    await page.waitForTimeout(500);
    await expect(budgetEntrySalesPage.locators.rightScrollArrow).toBeEnabled();
    
    // Continue scrolling left until first tab is visible
    let leftArrowEnabled = await budgetEntrySalesPage.locators.leftScrollArrow.isEnabled();
    while (leftArrowEnabled) {
      await budgetEntrySalesPage.locators.leftScrollArrow.click();
      await page.waitForTimeout(500);
      leftArrowEnabled = await budgetEntrySalesPage.locators.leftScrollArrow.isEnabled();
    }
    
    // Verify left arrow is disabled again
    await expect(budgetEntrySalesPage.locators.leftScrollArrow).toBeDisabled();
  });

  test('[CAP1-1 TS-005 TC-001] Verify Target Revenue tab displays budget input sheet with department context', async ({ page }) => {
    await budgetEntrySalesPage.gotoBudgetEntrySales(TD.budgetContext.sales);
    
    // Click Target Revenue tab
    await budgetEntrySalesPage.clickTab('Target Revenue');
    await expect(budgetEntrySalesPage.locators.targetRevenueTab).toHaveClass(/active|selected|highlighted/);
    
    // Verify budget input sheet loads
    await expect(budgetEntrySalesPage.locators.targetRevenueContent).toBeVisible();
    
    // Verify department context is displayed
    await budgetEntrySalesPage.verifyDepartmentContext('Sales', 'Q1 2024', 'USD', 'V1');
    
    // Verify revenue entry fields are present
    await expect(budgetEntrySalesPage.locators.budgetInputSheet).toBeVisible();
  });

  test('[CAP1-1 TS-005 TC-002] Verify Target Expense tab displays budget input sheet with department context', async ({ page }) => {
    await budgetEntrySalesPage.gotoBudgetEntrySales(TD.budgetContext.sales);
    
    // Click Target Expense tab
    await budgetEntrySalesPage.clickTab('Target Expense');
    await expect(budgetEntrySalesPage.locators.targetExpenseTab).toHaveClass(/active|selected|highlighted/);
    
    // Verify budget input sheet loads
    await expect(budgetEntrySalesPage.locators.targetExpenseContent).toBeVisible();
    
    // Verify department context is displayed
    await budgetEntrySalesPage.verifyDepartmentContext('Sales', 'Q1 2024', 'USD', 'V1');
    
    // Verify expense entry fields are present
    await expect(budgetEntrySalesPage.locators.budgetInputSheet).toBeVisible();
  });

  test('[CAP1-1 TS-005 TC-003] Verify Workforce tab displays budget input sheet with department context', async ({ page }) => {
    await budgetEntrySalesPage.gotoBudgetEntrySales(TD.budgetContext.sales);
    
    // Click Workforce tab
    await budgetEntrySalesPage.clickTab('Workforce');
    await expect(budgetEntrySalesPage.locators.workforceTab).toHaveClass(/active|selected|highlighted/);
    
    // Verify budget input sheet loads
    await expect(budgetEntrySalesPage.locators.workforceContent).toBeVisible();
    
    // Verify department context is displayed
    await budgetEntrySalesPage.verifyDepartmentContext('Sales', 'Q1 2024', 'USD', 'V1');
    
    // Verify workforce entry fields are present (headcount, salaries, etc.)
    await expect(budgetEntrySalesPage.locators.budgetInputSheet).toBeVisible();
  });

  test('[CAP1-1 TS-005 TC-004] Verify Product Revenue tab displays budget input sheet with department context', async ({ page }) => {
    await budgetEntrySalesPage.gotoBudgetEntrySales(TD.budgetContext.sales);
    
    // Click Product Revenue tab
    await budgetEntrySalesPage.clickTab('Product Revenue');
    await expect(budgetEntrySalesPage.locators.productRevenueTab).toHaveClass(/active|selected|highlighted/);
    
    // Verify budget input sheet loads
    await expect(budgetEntrySalesPage.locators.productRevenueContent).toBeVisible();
    
    // Verify department context is displayed
    await budgetEntrySalesPage.verifyDepartmentContext('Sales', 'Q1 2024', 'USD', 'V1');
    
    // Verify product revenue entry fields are present
    await expect(budgetEntrySalesPage.locators.budgetInputSheet).toBeVisible();
  });

  test('[CAP1-1 TS-006 TC-001] Verify Sensitivity Analysis tab displays planning view with modeling tools', async ({ page }) => {
    await budgetEntrySalesPage.gotoBudgetEntrySales(TD.budgetContext.sales);
    
    // Click Sensitivity Analysis tab
    await budgetEntrySalesPage.clickTab('Sensitivity Analysis');
    await expect(budgetEntrySalesPage.locators.sensitivityAnalysisTab).toHaveClass(/active|selected|highlighted/);
    
    // Verify planning view loads
    await expect(budgetEntrySalesPage.locators.sensitivityAnalysisContent).toBeVisible();
    
    // Verify modeling tools and assumptions are displayed
    await expect(budgetEntrySalesPage.locators.planningView).toBeVisible();
  });

  test('[CAP1-1 TS-006 TC-002] Verify Pipeline tab displays planning view with sales pipeline data', async ({ page }) => {
    await budgetEntrySalesPage.gotoBudgetEntrySales(TD.budgetContext.sales);
    
    // Click Pipeline tab
    await budgetEntrySalesPage.clickTab('Pipeline');
    await expect(budgetEntrySalesPage.locators.pipelineTab).toHaveClass(/active|selected|highlighted/);
    
    // Verify planning view loads
    await expect(budgetEntrySalesPage.locators.pipelineContent).toBeVisible();
    
    // Verify sales pipeline data is displayed
    await expect(budgetEntrySalesPage.locators.planningView).toBeVisible();
  });

  test('[CAP1-1 TS-007 TC-001] Verify Travel tab displays cost planning sheet with travel expense fields', async ({ page }) => {
    await budgetEntrySalesPage.gotoBudgetEntrySales(TD.budgetContext.sales);
    
    // Click Travel tab
    await budgetEntrySalesPage.clickTab('Travel');
    await expect(budgetEntrySalesPage.locators.travelTab).toHaveClass(/active|selected|highlighted/);
    
    // Verify cost planning sheet loads
    await expect(budgetEntrySalesPage.locators.travelContent).toBeVisible();
    
    // Verify travel expense fields are displayed
    await expect(budgetEntrySalesPage.locators.costPlanningSheet).toBeVisible();
  });

  test('[CAP1-1 TS-007 TC-002] Verify Capital tab displays cost planning sheet with capital expense fields', async ({ page }) => {
    await budgetEntrySalesPage.gotoBudgetEntrySales(TD.budgetContext.sales);
    
    // Click Capital tab
    await budgetEntrySalesPage.clickTab('Capital');
    await expect(budgetEntrySalesPage.locators.capitalTab).toHaveClass(/active|selected|highlighted/);
    
    // Verify cost planning sheet loads
    await expect(budgetEntrySalesPage.locators.capitalContent).toBeVisible();
    
    // Verify capital expense fields are displayed
    await expect(budgetEntrySalesPage.locators.costPlanningSheet).toBeVisible();
  });

  test('[CAP1-1 TS-007 TC-003] Verify Expenses tab displays cost planning sheet with general expense fields', async ({ page }) => {
    await budgetEntrySalesPage.gotoBudgetEntrySales(TD.budgetContext.sales);
    
    // Click Expenses tab
    await budgetEntrySalesPage.clickTab('Expenses');
    await expect(budgetEntrySalesPage.locators.expensesTab).toHaveClass(/active|selected|highlighted/);
    
    // Verify cost planning sheet loads
    await expect(budgetEntrySalesPage.locators.expensesContent).toBeVisible();
    
    // Verify general expense fields are displayed
    await expect(budgetEntrySalesPage.locators.costPlanningSheet).toBeVisible();
  });

  test('[CAP1-1 TS-008 TC-001] Verify Variances tab displays summary view with budget performance data', async ({ page }) => {
    await budgetEntrySalesPage.gotoBudgetEntrySales(TD.budgetContext.sales);
    
    // Click Variances tab
    await budgetEntrySalesPage.clickTab('Variances');
    await expect(budgetEntrySalesPage.locators.variancesTab).toHaveClass(/active|selected|highlighted/);
    
    // Verify summary view loads
    await expect(budgetEntrySalesPage.locators.variancesContent).toBeVisible();
    
    // Verify variance analysis is displayed
    await expect(budgetEntrySalesPage.locators.summaryView).toBeVisible();
    
    // Verify user can review variance data
    await expect(budgetEntrySalesPage.locators.varianceData).toBeVisible();
  });

  test('[CAP1-1 TS-008 TC-002] Verify Review tab displays summary view with comprehensive budget data', async ({ page }) => {
    await budgetEntrySalesPage.gotoBudgetEntrySales(TD.budgetContext.sales);
    
    // Click Review tab
    await budgetEntrySalesPage.clickTab('Review');
    await expect(budgetEntrySalesPage.locators.reviewTab).toHaveClass(/active|selected|highlighted/);
    
    // Verify summary view loads
    await expect(budgetEntrySalesPage.locators.reviewContent).toBeVisible();
    
    // Verify consolidated budget information is displayed
    await expect(budgetEntrySalesPage.locators.summaryView).toBeVisible();
    
    // Verify user can perform final review
    await expect(budgetEntrySalesPage.locators.budgetSummary).toBeVisible();
  });

  test('[CAP1-1 TS-009 TC-001] Verify context is retained when switching between tabs', async ({ page }) => {
    const context = {
      department: 'Sales',
      timePeriod: 'Q2 2024',
      currency: 'EUR',
      planVersion: 'V2'
    };
    
    await budgetEntrySalesPage.gotoBudgetEntrySales(context);
    
    // Verify initial context
    await budgetEntrySalesPage.verifyDepartmentContext(context.department, context.timePeriod, context.currency, context.planVersion);
    
    // Switch to Target Revenue tab and verify context
    await budgetEntrySalesPage.clickTab('Target Revenue');
    await budgetEntrySalesPage.verifyDepartmentContext(context.department, context.timePeriod, context.currency, context.planVersion);
    
    // Switch to Workforce tab and verify context
    await budgetEntrySalesPage.clickTab('Workforce');
    await budgetEntrySalesPage.verifyDepartmentContext(context.department, context.timePeriod, context.currency, context.planVersion);
    
    // Switch to Sensitivity Analysis tab and verify context
    await budgetEntrySalesPage.clickTab('Sensitivity Analysis');
    await budgetEntrySalesPage.verifyDepartmentContext(context.department, context.timePeriod, context.currency, context.planVersion);
    
    // Switch to Travel tab and verify context
    await budgetEntrySalesPage.clickTab('Travel');
    await budgetEntrySalesPage.verifyDepartmentContext(context.department, context.timePeriod, context.currency, context.planVersion);
    
    // Switch to Variances tab and verify context
    await budgetEntrySalesPage.clickTab('Variances');
    await budgetEntrySalesPage.verifyDepartmentContext(context.department, context.timePeriod, context.currency, context.planVersion);
    
    // Switch to Review tab and verify context
    await budgetEntrySalesPage.clickTab('Review');
    await budgetEntrySalesPage.verifyDepartmentContext(context.department, context.timePeriod, context.currency, context.planVersion);
  });

  test('[CAP1-1 TS-010 TC-001] Verify Back button navigates to previous page', async ({ page }) => {
    // Note current page (Home/Dashboard)
    const previousUrl = page.url();
    
    // Navigate to Budget Entry - Sales page
    await budgetEntrySalesPage.gotoBudgetEntrySales();
    await expect(page).toHaveURL(TD.urlPatterns.budgetEntrySalesPage);
    
    // Verify Budget Entry - Sales page is displayed
    await expect(budgetEntrySalesPage.locators.instructionsTab).toBeVisible();
    
    // Click Back button
    await budgetEntrySalesPage.clickBackButton();
    
    // Verify navigation to previous page
    await expect(page).toHaveURL(previousUrl);
    
    // Verify previous page is fully loaded
    await page.waitForLoadState('networkidle');
  });
});