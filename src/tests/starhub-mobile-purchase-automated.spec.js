const { test, expect } = require('@playwright/test');
const StarHubMobilePurchasePage = require('../pages/starhub-mobile-purchase.page');

test.describe('[UI] StarHub Mobile Device Purchase Flow', () => {
  let pageObj;

  test.beforeEach(async ({ page }) => {
    pageObj = new StarHubMobilePurchasePage(page);
    await pageObj.goto();
    
    // Dismiss cookie consent dialogs safely
    try {
      await pageObj.dismissCookieConsent();
    } catch {
      // Cookie consent not present or already dismissed
    }
  });

  test('Test Case 1: Launch StarHub website successfully', async ({ page }) => {
    // Verify page loads correctly
    expect(page.url()).toContain('starhub.com');
    await expect(page).toHaveTitle(/StarHub/i);
  });

  test('Test Case 2: Navigate to All Phones section', async ({ page }) => {
    // Navigate through Mobile dropdown to All Phones
    await pageObj.navigateToMobileDropdown();
    await pageObj.clickAllPhones();
    
    // Verify navigation to phones listing page
    expect(page.url()).toContain('/mobile');
  });

  test('Test Case 3: Select Samsung Galaxy A57 5G device', async ({ page }) => {
    // Navigate to phones section
    await pageObj.navigateToMobileDropdown();
    await pageObj.clickAllPhones();
    
    // Select Galaxy A57 5G device
    await pageObj.selectGalaxyA57Device();
    
    // Verify product detail page loads
    const isDetailPageLoaded = await pageObj.isProductDetailPageLoaded();
    expect(isDetailPageLoaded).toBe(true);
    expect(page.url()).toContain('galaxy-a57-5g');
  });

  test('Test Case 4: Verify default product configurations', async ({ page }) => {
    // Navigate to Galaxy A57 5G product page
    await pageObj.navigateToMobileDropdown();
    await pageObj.clickAllPhones();
    await pageObj.selectGalaxyA57Device();
    
    // Wait for product page to load fully
    await pageObj.isProductDetailPageLoaded();
    
    // Verify default color selection (could be Awesome Navy or Black)
    const selectedColor = await pageObj.getSelectedColor();
    expect(selectedColor).toMatch(/Awesome Navy|Black/);
    
    // Verify default storage selection
    const selectedStorage = await pageObj.getSelectedStorage();
    expect(selectedStorage).toMatch(/256\s?GB/);
    
    // Verify default payment option
    const selectedPayment = await pageObj.getSelectedPaymentOption();
    expect(selectedPayment).toMatch(/24.?month/);
  });

  test('Test Case 5: Verify authentication popup after Next click', async ({ page }) => {
    // Navigate to Galaxy A57 5G product page
    await pageObj.navigateToMobileDropdown();
    await pageObj.clickAllPhones();
    await pageObj.selectGalaxyA57Device();
    await pageObj.isProductDetailPageLoaded();
    
    // Click Next button to trigger authentication
    await pageObj.clickNextButton();
    
    // Verify authentication popup appears
    const isAuthModalVisible = await pageObj.isAuthModalVisible();
    expect(isAuthModalVisible).toBe(true);
    
    // Verify authentication message
    const authMessage = await pageObj.getAuthMessage();
    expect(authMessage).toContain('Please log in or create an account to continue with your purchase');
    
    // Verify Hub ID login button is present
    const isHubIdButtonVisible = await pageObj.isHubIdLoginButtonVisible();
    expect(isHubIdButtonVisible).toBe(true);
    
    // Verify Sign up link is present
    const isSignUpLinkVisible = await pageObj.isSignUpLinkVisible();
    expect(isSignUpLinkVisible).toBe(true);
  });

  test('Test Case 6: Complete full purchase flow validation', async ({ page }) => {
    // Step 1: Launch StarHub website
    expect(page.url()).toContain('starhub.com');
    
    // Step 2: Navigate to All Phones
    await pageObj.navigateToMobileDropdown();
    await pageObj.clickAllPhones();
    
    // Step 3: Select Galaxy A57 5G
    await pageObj.selectGalaxyA57Device();
    await pageObj.isProductDetailPageLoaded();
    
    // Step 4: Verify all default selections with flexible matching
    const color = await pageObj.getSelectedColor();
    const storage = await pageObj.getSelectedStorage();
    const payment = await pageObj.getSelectedPaymentOption();
    
    expect(color).toMatch(/Awesome Navy|Black/);
    expect(storage).toMatch(/256\s?GB/);
    expect(payment).toMatch(/24.?month/);
    
    // Step 5: Click Next and verify authentication popup
    await pageObj.clickNextButton();
    
    const isAuthModalVisible = await pageObj.isAuthModalVisible();
    expect(isAuthModalVisible).toBe(true);
    
    const authMessage = await pageObj.getAuthMessage();
    expect(authMessage).toContain('Please log in or create an account to continue with your purchase');
    
    // Verify both authentication options are available
    expect(await pageObj.isHubIdLoginButtonVisible()).toBe(true);
    expect(await pageObj.isSignUpLinkVisible()).toBe(true);
  });
});