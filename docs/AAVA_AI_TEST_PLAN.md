# Test Plan: Aava AI Website - "Future of Engineering" Title Verification

**Target URL:** https://int-ai.aava.ai/  
**Generated:** February 17, 2026  
**Objective:** Verify that the "Future of Engineering" title exists and is visible on the page

---

## Test Scope

### In Scope
- Homepage title verification
- Page accessibility
- Page load validation
- Responsive design check
- Basic functionality validation

### Out of Scope
- Deep navigation testing
- Form submissions
- Backend API testing
- Performance benchmarking

---

## Test Cases

### TC-001: Homepage Navigation
**Priority:** High  
**Description:** Verify the Aava AI homepage loads successfully

**Pre-conditions:**
- Browser is open
- Internet connection is available

**Steps:**
1. Navigate to https://int-ai.aava.ai/
2. Wait for page to load completely
3. Verify page status code is 200

**Expected Results:**
- Page loads within 5 seconds
- No console errors
- Page is fully rendered

---

### TC-002: "Future of Engineering" Title Exists
**Priority:** Critical  
**Description:** Verify the main title "Future of Engineering" is present on the page

**Pre-conditions:**
- Homepage is loaded (TC-001 passed)

**Steps:**
1. Wait for page content to be visible
2. Search for text containing "Future of Engineering"
3. Verify the element is present in the DOM
4. Verify the element is visible to users

**Expected Results:**
- Text "Future of Engineering" is found on the page
- Element is visible (not hidden by CSS)
- Element is within viewport or scrollable area
- Text matches exactly or contains the phrase

**Test Selectors (to try):**
- `text=Future of Engineering` (Playwright text selector)
- `//h1[contains(text(), 'Future of Engineering')]` (XPath)
- `//h2[contains(text(), 'Future of Engineering')]` (XPath)
- `[class*="title"]` or `[class*="heading"]` (CSS class patterns)

---

### TC-003: Title Visibility and Styling
**Priority:** Medium  
**Description:** Verify the title is visible and properly styled

**Pre-conditions:**
- TC-002 passed

**Steps:**
1. Locate the "Future of Engineering" element
2. Check element visibility (`isVisible()`)
3. Verify element has meaningful styling (font-size, color)
4. Take a screenshot for visual verification

**Expected Results:**
- Element is visible without scrolling
- Font size is prominent (heading style)
- Color contrasts well with background
- No CSS errors affecting display

---

### TC-004: Page Accessibility
**Priority:** Medium  
**Description:** Verify basic accessibility of the title element

**Pre-conditions:**
- TC-002 passed

**Steps:**
1. Check if title uses semantic HTML (h1, h2, etc.)
2. Verify text contrast ratio meets WCAG standards
3. Check if title is readable by screen readers

**Expected Results:**
- Title uses proper heading tag
- Contrast ratio ≥ 4.5:1 (WCAG AA)
- No accessibility violations for title element

---

### TC-005: Responsive Design Verification
**Priority:** Low  
**Description:** Verify title is visible on different screen sizes

**Pre-conditions:**
- TC-002 passed

**Steps:**
1. Test on Desktop viewport (1920x1080)
2. Test on Tablet viewport (768x1024)
3. Test on Mobile viewport (375x667)
4. Verify title is visible and readable on all viewports

**Expected Results:**
- Title is visible on all screen sizes
- Text does not overflow or get cut off
- Responsive design maintains readability

---

## Test Data

### Valid Test Data
- URL: https://int-ai.aava.ai/
- Expected text: "Future of Engineering"
- Supported browsers: Chrome, Firefox, Edge, Safari
- Supported devices: Desktop, Tablet, Mobile

---

## Test Environment

### Hardware
- Desktop: Windows 11, macOS, Linux
- Mobile: iOS 15+, Android 12+

### Software
- Browsers: Chrome (latest), Firefox (latest), Edge (latest)
- Test Framework: Playwright
- Node.js: v18+

---

## Risk Assessment

### High Risk Areas
1. **Dynamic Content Loading:** Title might load asynchronously via JavaScript
2. **Internationalization:** Title might change based on locale/language
3. **A/B Testing:** Different users might see different titles

### Mitigation Strategies
- Use explicit waits for dynamic content
- Test with multiple locales if applicable
- Clear cookies/cache before testing

---

## Exit Criteria

### All tests must pass:
- ✅ Page loads successfully (TC-001)
- ✅ "Future of Engineering" title exists (TC-002)
- ✅ Title is visible to users (TC-003)

### Optional (if time permits):
- ✅ Accessibility checks pass (TC-004)
- ✅ Responsive design verified (TC-005)

---

## Test Execution Summary

**Total Test Cases:** 5  
**Critical:** 1 (TC-002)  
**High Priority:** 1 (TC-001)  
**Medium Priority:** 2 (TC-003, TC-004)  
**Low Priority:** 1 (TC-005)

**Estimated Execution Time:** 5-10 minutes

---

## Next Steps

1. **Review** this test plan with stakeholders
2. **Generate** Playwright test code from this plan
3. **Execute** tests in CI/CD pipeline
4. **Report** results to team

---

## Playwright Test Code Preview

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Aava AI - Future of Engineering Title', () => {
  
  test('TC-002: Verify "Future of Engineering" title exists', async ({ page }) => {
    // Navigate to Aava AI website
    await page.goto('https://int-ai.aava.ai/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Search for "Future of Engineering" text
    const titleElement = page.locator('text=Future of Engineering');
    
    // Verify element exists
    await expect(titleElement).toBeVisible({ timeout: 10000 });
    
    // Take screenshot for evidence
    await page.screenshot({ path: 'aava-title-verification.png', fullPage: true });
    
    console.log('✅ "Future of Engineering" title found and visible!');
  });
});
```

---

**Generated by:** MCP Planner Agent (AI-Assisted Playwright Framework)  
**Framework Version:** 1.0.0  
**MCP Protocol:** Enabled
