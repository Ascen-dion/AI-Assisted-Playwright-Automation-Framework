# Test Plan: Ascendion SharePoint Hub - "HUB Intranet" Title Verification

**Target URL:** https://ascendionhub.sharepoint.com/  
**Generated:** February 17, 2026  
**Objective:** Verify that the "HUB Intranet" title exists and is visible on the page

---

## Test Scope

### In Scope
- Homepage title verification
- SharePoint authentication handling
- Page accessibility after login
- Title visibility and styling
- Basic navigation validation

### Out of Scope
- Deep SharePoint functionality testing
- Document library operations
- User permission testing
- Complex workflow testing

---

## Pre-requisites

### Authentication Requirements
- Valid Ascendion SharePoint credentials
- Access to ascendionhub.sharepoint.com
- Network access to SharePoint Online
- Multi-factor authentication capability (if enabled)

### Environment Setup
- Browser: Chrome/Edge (recommended for SharePoint)
- Network: Corporate network or VPN
- Cookies: Enable cookies for authentication
- JavaScript: Must be enabled

---

## Test Cases

### TC-001: SharePoint Login Flow
**Priority:** Critical  
**Description:** Verify user can successfully authenticate to SharePoint

**Pre-conditions:**
- User has valid credentials
- Browser is open
- No active SharePoint session

**Steps:**
1. Navigate to https://ascendionhub.sharepoint.com/
2. If redirected to Microsoft login, enter credentials
3. Complete MFA if prompted
4. Wait for SharePoint homepage to load

**Expected Results:**
- Login successful
- Redirected to SharePoint homepage
- No authentication errors
- Session established

---

### TC-002: "HUB Intranet" Title Verification
**Priority:** Critical  
**Description:** Verify the main "HUB Intranet" title is present on the SharePoint homepage

**Pre-conditions:**
- User is logged into SharePoint (TC-001 passed)
- Homepage is fully loaded

**Steps:**
1. Wait for SharePoint page to fully render
2. Search for text containing "HUB Intranet"
3. Verify the title element is present in the DOM
4. Verify the title is visible to users
5. Take screenshot for evidence

**Expected Results:**
- Text "HUB Intranet" is found on the page
- Element is visible (not hidden by CSS)
- Element is within viewport or scrollable area
- Text matches exactly or contains the phrase

**Test Selectors (SharePoint-specific):**
- Text selector: `text=HUB Intranet`
- Title selectors: `[role="heading"]`, `.ms-siteLogo-siteName`, `.o365cs-nav-brandingText`
- SharePoint containers: `#O365_MainLink_NavMenu`, `.ms-HubNav`

---

### TC-003: Page Load Performance
**Priority:** High  
**Description:** Verify SharePoint page loads within acceptable time

**Pre-conditions:**
- Authentication completed

**Steps:**
1. Record page load start time
2. Navigate to SharePoint homepage
3. Wait for network idle state
4. Record page load complete time
5. Calculate total load time

**Expected Results:**
- Page loads within 10 seconds (on good network)
- No timeout errors
- All critical resources loaded
- Page is interactive

---

### TC-004: SharePoint UI Elements Visibility
**Priority:** Medium  
**Description:** Verify key SharePoint UI components are visible

**Pre-conditions:**
- Logged into SharePoint
- Homepage loaded

**Steps:**
1. Verify Office 365 suite bar is present
2. Verify navigation menu is accessible
3. Verify search box is visible
4. Verify "HUB Intranet" title is prominent
5. Verify quick launch/side navigation

**Expected Results:**
- All core SharePoint UI elements visible
- Navigation is accessible
- Search functionality available
- Branding elements displayed correctly

---

### TC-005: Authentication Session Persistence
**Priority:** Medium  
**Description:** Verify session remains active during test execution

**Pre-conditions:**
- Initial login completed

**Steps:**
1. Navigate to SharePoint homepage
2. Wait 30 seconds
3. Refresh the page
4. Verify no re-authentication required
5. Verify "HUB Intranet" title still visible

**Expected Results:**
- Session persists across page refreshes
- No unexpected logouts
- Content remains accessible

---

### TC-006: Cross-Browser Compatibility
**Priority:** Medium  
**Description:** Verify title displays correctly across different browsers

**Browsers to Test:**
- Chrome (latest)
- Edge (latest)
- Firefox (latest)

**Steps:**
1. Login to SharePoint in each browser
2. Verify "HUB Intranet" title appears
3. Check styling consistency
4. Verify no browser-specific errors

**Expected Results:**
- Title visible in all supported browsers
- Consistent appearance across browsers
- No browser-specific rendering issues

---

### TC-007: Mobile Responsive View (Optional)
**Priority:** Low  
**Description:** Verify title is visible on mobile viewports

**Viewports:**
- Mobile: 375x667 (iPhone)
- Tablet: 768x1024 (iPad)

**Steps:**
1. Set viewport to mobile size
2. Login to SharePoint
3. Verify "HUB Intranet" title is visible
4. Check if title is appropriately sized

**Expected Results:**
- Title visible on mobile viewports
- Text is readable (not too small)
- No horizontal scrolling required

---

## Test Data

### Required Credentials
- Username: [Corporate Email]
- Password: [Secure Password - not stored in code]
- MFA Token: [If applicable]

**Note:** Credentials should be stored in environment variables or secure vault, never in test code.

---

## Risk Assessment

### High Risk Areas
1. **Authentication Flow:** SharePoint/Microsoft authentication is complex with MFA, redirects, and session management
2. **Dynamic Content:** SharePoint content loads dynamically via JavaScript
3. **Network Dependencies:** Requires active internet and network access
4. **Session Timeouts:** Long-running tests may encounter session expiration
5. **Permissions:** User must have access to view the intranet

### Mitigation Strategies
- Use explicit waits for authentication elements
- Implement retry logic for network issues
- Handle authentication state carefully
- Use headless mode with authentication persistence
- Mock authentication for CI/CD if possible

---

## SharePoint-Specific Considerations

### Common SharePoint Selectors
```javascript
// Office 365 suite bar
'#O365_MainLink_NavMenu'

// SharePoint page content
'.ms-webpart-zone'

// Site logo/title
'.ms-siteLogo-siteName'

// Navigation
'.ms-HubNav-link'

// Search box
'input[placeholder*="Search"]'
```

### Authentication Handling
SharePoint uses Microsoft OAuth, which may require:
- Playwright persistent context for cookies
- Handling of OAuth redirects
- MFA token handling
- Session storage management

---

## Exit Criteria

### Critical Tests (Must Pass):
- ✅ User can authenticate to SharePoint (TC-001)
- ✅ "HUB Intranet" title exists and is visible (TC-002)

### Optional Tests:
- ✅ Page load within acceptable time (TC-003)
- ✅ UI elements visible (TC-004)
- ✅ Session persistence (TC-005)

---

## Known Limitations

1. **Authentication:** Tests require valid credentials (cannot be fully automated in CI without secure credential storage)
2. **MFA:** Multi-factor authentication may require manual intervention
3. **Network:** Tests require corporate network or VPN access
4. **Dynamic Content:** SharePoint loads content asynchronously, requiring robust wait strategies

---

## Playwright Test Code Preview

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Ascendion SharePoint Hub - HUB Intranet Title', () => {
  
  test.use({
    // Use persistent context if you have saved auth
    // storageState: 'auth/sharepoint-auth.json'
  });

  test('TC-002: Verify "HUB Intranet" title exists', async ({ page }) => {
    // Navigate to SharePoint (will redirect to login if not authenticated)
    await page.goto('https://ascendionhub.sharepoint.com/');
    
    // Handle authentication if needed
    // await page.fill('input[type="email"]', process.env.SHAREPOINT_USER);
    // await page.click('input[type="submit"]');
    // await page.fill('input[type="password"]', process.env.SHAREPOINT_PASS);
    // await page.click('input[type="submit"]');
    
    // Wait for SharePoint to load
    await page.waitForLoadState('networkidle');
    
    // Search for "HUB Intranet" title
    const titleElement = page.locator('text=HUB Intranet');
    
    // Verify element exists and is visible
    await expect(titleElement).toBeVisible({ timeout: 15000 });
    
    // Take screenshot
    await page.screenshot({ path: 'sharepoint-hub-intranet.png' });
    
    console.log('✅ "HUB Intranet" title found and visible!');
  });
});
```

---

## Next Steps

1. **Setup Authentication:** Configure secure credential storage
2. **Review Test Plan:** Get stakeholder approval
3. **Implement Tests:** Create Playwright test file
4. **Execute Tests:** Run in dev environment first
5. **CI/CD Integration:** Add to pipeline with secure credentials

---

**Generated by:** Playwright AI Framework  
**Test Plan Version:** 1.0  
**Last Updated:** February 17, 2026
