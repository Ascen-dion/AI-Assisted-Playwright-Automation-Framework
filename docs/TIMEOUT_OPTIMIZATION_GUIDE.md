# ⚙️ Timeout and Retry Optimization Guide

## 📋 Overview

This guide provides best practices for optimizing timeouts and retry logic in Salesforce test automation to handle slow Lightning UI and network latency.

---

## 🎯 Current Issues & Solutions

### Issue 1: Salesforce Lightning UI Slow Loading

**Problem:**
```
TimeoutError: page.waitForSelector: Timeout 5000ms exceeded
- waiting for nav.slds-context-bar to be visible
```

**Solution:**
Increase navigation timeouts and add fallback logic:

```javascript
// In playwright config
use: {
  navigationTimeout: 60000, // 60 seconds (was 30s)
  actionTimeout: 15000,      // 15 seconds (was 10s)
}
```

### Issue 2: Save Button Not Clickable

**Problem:**
```
Element is not visible
- Save button found but covered by other elements
```

**Solution:**
Add wait strategies and force click as fallback:

```javascript
// Wait for overlays to disappear
await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
await page.waitForTimeout(1000);

// Try normal click, fallback to force click
try {
  await saveButton.click({ timeout: 5000 });
} catch (e) {
  await saveButton.click({ force: true });
}
```

### Issue 3: Test Timeouts During Setup

**Problem:**
```
Test timeout of 60000ms exceeded during beforeEach
```

**Solution:**
Increase per-test timeout:

```javascript
// In test file
test.describe.configure({ timeout: 120000 }); // 2 minutes

// Or per test
test('[C010] Test name', async ({ page }) => {
  test.setTimeout(180000); // 3 minutes for this test
  // ... test code
});
```

---

## 🔧 Recommended Configuration

### 1. Playwright Config (Salesforce-Optimized)

Create `config/salesforce-optimized.config.js`:

```javascript
module.exports = defineConfig({
  timeout: 90000, // Global test timeout: 90 seconds
  
  expect: {
    timeout: 10000, // Assertion timeout: 10 seconds
  },

  retries: process.env.CI ? 2 : 1, // Retry failed tests
  
  workers: 1, // Single worker to avoid rate limiting
  
  use: {
    navigationTimeout: 60000, // Page navigation: 60s
    actionTimeout: 15000,      // Actions: 15s
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    launchOptions: {
      slowMo: 100, // Slow down by 100ms for stability
    }
  },

  projects: [
    {
      name: 'salesforce',
      timeout: 120000, // 2 minutes per test
      retries: 2,       // Retry up to 2 times
      testMatch: '**/salesforce/**/*.spec.js',
    }
  ],
});
```

### 2. Page Object Wait Strategies

**Before (Problematic):**
```javascript
// Too aggressive
await this.page.waitForSelector('.save-button', { timeout: 5000 });
await this.page.click('.save-button');
```

**After (Optimized):**
```javascript
// Wait for element + extra stability time
const saveButton = this.page.locator('.save-button');
await saveButton.waitFor({ state: 'visible', timeout: 10000 });
await this.page.waitForTimeout(500); // Extra stability

// Try click with fallback
try {
  await saveButton.click({ timeout: 5000 });
} catch (e) {
  console.log('Normal click failed, trying force click...');
  await saveButton.click({ force: true, timeout: 5000 });
}

// Wait for action to complete
await this.page.waitForLoadState('networkidle', { timeout: 10000 })
  .catch(() => console.log('Network not idle, continuing...'));
```

### 3. Test-Level Timeouts

```javascript
test.describe('[DZ-2] Quote Validation', () => {
  // Configure entire describe block
  test.describe.configure({
    timeout: 120000,  // 2 minutes per test
    retries: 2        // Retry failed tests twice
  });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(180000); // 3 minutes for setup
    // ... setup code
  });

  test('[C005] Create Quote', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes for this test
    test.slow(); // Mark as slow (multiplies timeout by 3x)
    // ... test code
  });
});
```

---

## 📊 Timeout Hierarchy

Playwright uses the **smallest applicable timeout**:

```
1. expect() assertion     timeout: 10s  ←  Most specific
2. page.click() action    timeout: 15s
3. page.goto() navigation timeout: 60s
4. Test timeout          timeout: 90s
5. Global timeout        timeout: 3600s  ←  Least specific
```

---

## 🎓 Best Practices

### 1. Use Appropriate Timeouts by Context

| Action | Recommended Timeout | Reason |
|--------|---------------------|--------|
| **Fast actions** (click, fill) | 5-10s | Should be quick |
| **Slow actions** (save, submit) | 10-15s | May trigger validations |
| **Page navigation** | 30-60s | Lightning UI loads slowly |
| **API calls** | 5-10s | Should be fast |
| **Test overall** | 90-120s | Allows for retries |

### 2. Add Stability Waits

```javascript
// After major actions, wait for stability
await page.click('.save-button');
await page.waitForLoadState('networkidle').catch(() => {});
await page.waitForTimeout(1000); // Extra buffer
```

### 3. Use Soft Waits for Optional Elements

```javascript
// Don't fail if element doesn't exist
const toast = await page.locator('.toast')
  .waitFor({ state: 'visible', timeout: 3000 })
  .catch(() => null);

if (toast) {
  console.log('✓ Success toast appeared');
}
```

### 4. Implement Retry Logic in Helpers

```javascript
async function clickWithRetry(page, selector, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await page.click(selector, { timeout: 5000 });
      return; // Success
    } catch (e) {
      if (i === maxRetries - 1) throw e; // Last attempt
      console.log(`Click failed (attempt ${i + 1}/${maxRetries}), retrying...`);
      await page.waitForTimeout(1000);
    }
  }
}
```

### 5. Add Debug Logging

```javascript
test('[C010] Test', async ({ page }) => {
  console.log('1. Navigating to Opportunities...');
  await homePage.navigateToObject('Opportunities');
  
  console.log('2. Clicking New button...');
  await opportunityPage.clickNew();
  
  console.log('3. Filling form...');
  await opportunityPage.fillOpportunityForm(data);
  
  console.log('4. Saving...');
  await opportunityPage.clickSave();
});
```

---

## 🚀 Running with Optimized Config

### Option 1: Use Optimized Config

```bash
# Run with optimized config
npx playwright test --config=config/salesforce-optimized.config.js src/web/salesforce/tests/
```

### Option 2: Override Timeouts via CLI

```bash
# Increase timeout for specific run
npx playwright test src/web/salesforce/tests/ --timeout=120000

# Run with retries
npx playwright test src/web/salesforce/tests/ --retries=2

# Slow mode for debugging
npx playwright test src/web/salesforce/tests/ --headed --slow-mo=1000
```

### Option 3: Environment Variables

```bash
# Set timeout via environment
$env:PLAYWRIGHT_TIMEOUT="120000"
npx playwright test src/web/salesforce/tests/
```

---

## 🔍 Debugging Timeouts

### View Timeout Issues in Trace

```bash
# Run with trace
npx playwright test src/web/salesforce/tests/salesforce-s2-quote-validation.spec.js --trace=on

# Open trace viewer
npx playwright show-trace test-results/[...]/trace.zip
```

### Check Screenshots

```bash
# Screenshots saved automatically on failure
# Located in: test-results/artifacts/[test-name]/test-failed-1.png
```

### View Video

```bash
# Videos saved on failure
# Located in: test-results/artifacts/[test-name]/video.webm
```

---

## 📈 Monitoring Performance

### Add Performance Timing

```javascript
test('[C010] Performance Test', async ({ page }) => {
  const start = Date.now();
  
  await opportunityPage.createOpportunity(data);
  console.log(`Opportunity creation: ${Date.now() - start}ms`);
  
  const quoteStart = Date.now();
  await quotePage.createQuote(quoteData);
  console.log(`Quote creation: ${Date.now() - quoteStart}ms`);
  
  console.log(`Total test time: ${Date.now() - start}ms`);
});
```

---

## ✅ Quick Fixes Checklist

When tests timeout, try these in order:

- [ ] Increase `test.setTimeout()` to 120000 (2 minutes)
- [ ] Add `test.slow()` to mark test as expected to be slow
- [ ] Increase `navigationTimeout` in config to 60000
- [ ] Add stability waits: `await page.waitForTimeout(1000)`
- [ ] Use `waitForLoadState('networkidle')` before actions
- [ ] Implement force click fallback for click actions
- [ ] Add retry logic with 3 attempts
- [ ] Enable `slowMo: 100` in launch options
- [ ] Use single worker (`workers: 1`) to avoid rate limiting
- [ ] Run tests sequentially (`fullyParallel: false`)

---

## 🎯 Example: Fully Optimized Test

```javascript
test.describe('[DZ-2] Quote Validation', () => {
  // Configure timeouts
  test.describe.configure({ timeout: 120000, retries: 2 });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(180000); // 3 minutes for setup
    
    // ... setup with stability waits
    await loginPage.login(username, password);
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1000);
  });

  test('[C006] Discount validation', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes
    test.slow(); // Mark as potentially slow
    
    console.log('1. Creating Quote...');
    await opportunityPage.createQuote(quoteData);
    
    console.log('2. Getting Quote ID...');
    const quoteId = await getQuoteIdFromUrl(page);
    
    console.log('3. Testing validation...');
    const validationHelper = new QuoteValidationHelper();
    const result = await validationHelper.executeTestCase(
      page, quoteId, salesforceApi, 'C006'
    );
    
    expect(result.passed).toBe(true);
  });
});
```

---

## 📚 Additional Resources

- [Playwright Timeouts Documentation](https://playwright.dev/docs/test-timeouts)
- [Handling Flaky Tests](https://playwright.dev/docs/test-retries)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

## ✅ Summary

**Key Takeaways:**
1. Increase timeouts gradually (don't set too high immediately)
2. Use retry logic for transient failures
3. Add stability waits after major actions
4. Implement force click fallbacks
5. Use single worker to avoid rate limiting
6. Enable trace/video/screenshot on failures
7. Add debug logging for troubleshooting

**Recommended Settings:**
- Test timeout: 120 seconds
- Navigation timeout: 60 seconds
- Action timeout: 15 seconds
- Retries: 2
- Workers: 1
- Slow mode: 100ms

Apply these optimizations and your Salesforce tests will be much more stable! 🚀
