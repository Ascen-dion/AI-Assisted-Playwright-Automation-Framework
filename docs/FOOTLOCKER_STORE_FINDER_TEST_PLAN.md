# Foot Locker US - Store Finder Test Plan

## Overview
**Application Under Test:** Foot Locker US (https://www.footlocker.com/)  
**Feature:** Store Finder / Find a Store  
**Created:** Auto-generated from browser exploration  
**Browser:** Chromium (Desktop Chrome, 1280x720 viewport)

---

## Test Scenario: Store Finder Search Flow

### User Story
As a customer on footlocker.com, I want to find a Foot Locker store by entering a location so that I can visit a nearby store.

### Preconditions
- Browser is open and network connectivity is available
- footlocker.com is accessible and not under maintenance
- No prior store preference is saved in the browser session

---

## Test Cases

### TC-001: Verify Homepage Loads and "Find a Store" Button is Visible
**Priority:** High  
**Type:** Smoke  

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to https://www.footlocker.com/ | Homepage loads successfully |
| 2 | Verify page title | Title contains "Foot Locker" |
| 3 | Locate "Find a Store" button in the header | Button is visible and clickable |

---

### TC-002: Verify "Find a Store" Dropdown Opens on Click
**Priority:** High  
**Type:** Functional  

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to https://www.footlocker.com/ | Homepage loads |
| 2 | Click the "Find a Store" button | A dropdown menu appears |
| 3 | Verify dropdown content | Dropdown contains "Choose a preferred store..." text and "Select my store" button |

---

### TC-003: Verify "Select My Store" Opens Store Locator Dialog
**Priority:** High  
**Type:** Functional  

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to https://www.footlocker.com/ | Homepage loads |
| 2 | Click the "Find a Store" button | Dropdown menu appears |
| 3 | Click "Select my store" button | A dialog titled "Find a Store" opens |
| 4 | Verify dialog contents | Dialog contains a "Location" search input, a "Search for Stores" button, and a "Close" button |

---

### TC-004: Search for Stores by Entering "USA"
**Priority:** High  
**Type:** End-to-End  

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to https://www.footlocker.com/ | Homepage loads |
| 2 | Click the "Find a Store" button | Dropdown appears |
| 3 | Click "Select my store" | Store Locator dialog opens |
| 4 | Enter "USA" in the Location search box | Text "USA" is entered in the input field |
| 5 | Click "Search for Stores" button | Search is executed; store results or response is displayed |

---

### TC-005: Verify Store Locator Dialog Can Be Closed
**Priority:** Medium  
**Type:** Functional  

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Store Locator dialog (steps from TC-003) | Dialog is open |
| 2 | Click the "Close Find a Store" button | Dialog closes and homepage is visible again |

---

### TC-006: Verify Location Input Field Validation
**Priority:** Medium  
**Type:** Negative  

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Store Locator dialog | Dialog is open |
| 2 | Leave the Location field empty | Field is empty |
| 3 | Click "Search for Stores" | Appropriate validation message or no crash; graceful handling |

---

## DOM Selectors Discovered (from Browser Exploration)

| Element | Selector Strategy | Selector |
|---------|-------------------|----------|
| Find a Store button | Role-based | `button { name: "Find a Store" }` |
| Select my store button | Role-based | `button { name: "Select my store" }` |
| Store Locator Dialog | Role-based | `dialog { name: "Find a Store" }` |
| Location search input | Role-based | `searchbox { name: "Location" }` |
| Search for Stores button | Role-based | `button { name: "Search for Stores" }` |
| Close dialog button | Role-based | `button { name: "Close Find a Store" }` |
| Dialog heading | Role-based | `heading { name: "Find a Store", level: 3 }` |

---

## Risks & Considerations

1. **Headed Mode Required:** footlocker.com may block headless browsers (similar to footlocker.co.in). Tests should run in headed mode.
2. **Dynamic Refs:** Element references change on each page load; use role-based/text-based selectors instead of refs.
3. **Popup Overlays:** Cookie consent, newsletter signup, or marketing overlays may intercept clicks. Tests should handle dismissing them.
4. **Network Latency:** External site may be slow to load. Generous timeouts are required.
5. **Geo-restrictions:** Search results for "USA" may vary based on IP geolocation.
6. **Dropdown Timing:** The "Find a Store" dropdown may take a moment to render after clicking.

---

## Environment
- **Playwright Version:** Latest (via project config)
- **Browser:** Chromium (Desktop Chrome)
- **Viewport:** 1280 x 720
- **Mode:** Headed (headless may be blocked)
- **Timeout:** 90s per test
