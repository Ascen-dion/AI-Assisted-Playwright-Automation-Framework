# Test Plan: Aava AI - "Experienced Today" Text Verification

**Target URL:** https://int-ai.aava.ai/  
**Generated:** February 17, 2026  
**Objective:** Verify that the "Experienced Today" text exists and is visible on the Aava AI homepage

---

## Test Scope

### In Scope
- Homepage navigation and loading
- "Experienced Today" text verification
- Text visibility and positioning
- Page accessibility validation
- Responsive design testing

### Out of Scope
- Deep functionality testing
- API testing
- Performance benchmarking
- Database validations

---

## Test Environment

### Browser Support
- Chrome (latest)
- Edge (latest)
- Firefox (latest)

### Viewports
- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667

---

## Test Cases

### TC-001: Homepage Load Verification
**Priority:** Critical  
**Description:** Verify the Aava AI homepage loads successfully

**Pre-conditions:**
- Browser is open
- Internet connection is stable

**Steps:**
1. Navigate to https://int-ai.aava.ai/
2. Wait for page to fully load
3. Verify page title contains "AAVA"
4. Verify no error messages displayed

**Expected Results:**
- Page loads within 10 seconds
- Page title is correct
- No 404 or error pages
- Main content is visible

---

### TC-002: "Experienced Today" Text Verification
**Priority:** Critical  
**Description:** Verify the "Experienced Today" text exists on the homepage

**Pre-conditions:**
- Homepage is loaded (TC-001 passed)

**Steps:**
1. Wait for page content to fully render
2. Search for text containing "Experienced Today"
3. Verify the text element is present in the DOM
4. Verify the text is visible to users
5. Take screenshot for evidence

**Expected Results:**
- Text "Experienced Today" is found on the page
- Element is visible (not hidden by CSS)
- Element is within viewport or accessible by scroll
- Text matches exactly or contains the phrase

**Test Selectors:**
- Primary: `text=Experienced Today`
- Fallback: `:has-text("Experienced Today")`
- Alternative: `h1, h2, h3, p, div, span` (scan all text elements)

---

### TC-003: Text Visibility and Styling
**Priority:** High  
**Description:** Verify "Experienced Today" text is properly styled and visible

**Pre-conditions:**
- "Experienced Today" text is found (TC-002 passed)

**Steps:**
1. Get the text element
2. Verify element is visible
3. Check element position (x, y coordinates)
4. Verify element is within viewport or accessible
5. Check font styling (optional)

**Expected Results:**
- Element has positive dimensions (width > 0, height > 0)
- Element is not hidden by CSS (opacity > 0, display != none)
- Text is readable and properly positioned
- Proper contrast and styling applied

---

### TC-004: Responsive Design Verification
**Priority:** Medium  
**Description:** Verify "Experienced Today" text is visible on different viewport sizes

**Viewports to Test:**
- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667

**Steps:**
1. For each viewport size:
   - Set viewport dimensions
   - Navigate to homepage
   - Verify "Experienced Today" text is visible
   - Take screenshot

**Expected Results:**
- Text is visible on all viewport sizes
- Text is properly positioned for each device type
- No layout breaks or overlapping elements
- Text remains readable on mobile devices

---

### TC-005: Page Accessibility Check
**Priority:** Medium  
**Description:** Verify basic accessibility requirements

**Steps:**
1. Navigate to homepage
2. Check for proper heading structure (H1, H2, etc.)
3. Verify HTML lang attribute is set
4. Check for alt text on images (if applicable)
5. Verify page is keyboard navigable

**Expected Results:**
- Page has proper heading hierarchy
- HTML lang attribute is present
- Images have alt text
- Page is accessible via keyboard
- No critical accessibility violations

---

## Test Execution Strategy

### Manual Testing
- Run tests in headed mode for initial validation
- Verify visual appearance
- Document any visual defects

### Automated Testing
- Use Playwright for automated execution
- Run in headless mode for CI/CD
- Generate screenshots for evidence
- Log all test steps and results

---

## Test Data

### Required URLs
- Homepage: https://int-ai.aava.ai/

### Expected Text Content
- Target text: "Experienced Today"
- Variations to consider:
  - "Experienced Today"
  - "experienced today" (case-insensitive)
  - Text with special characters or formatting

---

## Risk Assessment

### Potential Risks
1. **Dynamic Content Loading:** Content may load asynchronously
2. **Network Issues:** Slow connection may cause timeouts
3. **Browser Compatibility:** Different browsers may render differently
4. **Content Changes:** Website content may change over time

### Mitigation Strategies
- Use explicit waits for dynamic content
- Implement retry logic for network issues
- Test across multiple browsers
- Use flexible text matching (contains vs exact)
- Implement multiple selector strategies

---

## Exit Criteria

### Critical Tests (Must Pass):
- ✅ Homepage loads successfully (TC-001)
- ✅ "Experienced Today" text exists and is visible (TC-002)

### Optional Tests:
- ✅ Text styling is appropriate (TC-003)
- ✅ Responsive design works (TC-004)
- ✅ Basic accessibility requirements met (TC-005)

---

## Test Deliverables

1. **Test Plan Document:** This document
2. **Automated Test Script:** Playwright test file
3. **Test Execution Report:** Console output and logs
4. **Screenshots:** Visual evidence of test execution
5. **Bug Reports:** If any defects are found

---

## Success Criteria

The test suite is considered successful when:
- All critical test cases (TC-001, TC-002) pass
- "Experienced Today" text is found and verified
- Test execution completes without errors
- Evidence (screenshots) is captured

---

## Playwright Test Code Preview

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Aava AI - Experienced Today Text Verification', () => {
  
  test('TC-002: Verify "Experienced Today" text exists', async ({ page }) => {
    // Navigate to Aava AI homepage
    await page.goto('https://int-ai.aava.ai/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Search for "Experienced Today" text
    const textElement = page.locator('text=Experienced Today');
    
    // Verify element exists and is visible
    await expect(textElement).toBeVisible({ timeout: 15000 });
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/aava-experienced-today.png' 
    });
    
    console.log('✅ "Experienced Today" text found and visible!');
  });
});
```

---

## Notes

- This test plan focuses on verification of a specific text element
- Tests are designed to be maintainable and reliable
- Multiple selector strategies provide resilience to page changes
- Framework includes AI-powered self-healing capabilities

---

**Test Plan Version:** 1.0  
**Created By:** Playwright AI Framework  
**Last Updated:** February 17, 2026
