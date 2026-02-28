# Foot Locker US - Store Finder End-to-End Test Plan

## Overview
**Application Under Test:** Foot Locker US (https://www.footlocker.com/)  
**Feature:** Store Finder — Full Search Flow  
**Created:** 2026-02-24  
**Browser:** Chromium (Desktop Chrome, 1280x720 viewport, headed mode)

---

## User Story
As a customer on footlocker.com, I want to find the nearest Foot Locker store by entering a location ("USA") and searching so that I can visit a nearby store.

---

## Preconditions
- Browser is open with network connectivity
- footlocker.com is accessible
- No prior store preference saved in session
- Headed mode enabled (footlocker.com may block headless browsers)

---

## Test Scenario: Store Finder Search — Enter "USA" and Search

### Single End-to-End Flow

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to https://www.footlocker.com/ | Homepage loads successfully; title contains "Foot Locker" |
| 2 | Dismiss any marketing/cookie overlays | Overlays are dismissed or hidden |
| 3 | Click the **"Find a Store"** button in the header | A dropdown menu appears with store options |
| 4 | Click the **"Select my store"** button in the dropdown | A dialog titled **"Find a Store"** opens |
| 5 | Verify the dialog contains a **Location** search input and a **"Search for Stores"** button | Both elements are visible inside the dialog |
| 6 | Enter **"USA"** in the Location search box | Text "USA" is typed into the input field |
| 7 | Click the **"Search for Stores"** button | Search is executed; store results or a response is displayed within the dialog |
| 8 | Verify that the dialog remains open and some content/result is shown | Dialog is still visible; page did not crash |

---

## DOM Selectors (Role-Based — Discovered from Browser Exploration)

| Element | Selector Strategy | Selector |
|---------|-------------------|----------|
| Find a Store button | Role | `button { name: "Find a Store" }` |
| Select my store button | Role | `button { name: "Select my store" }` |
| Store Locator Dialog | Role | `dialog { name: "Find a Store" }` |
| Location search input | Role | `searchbox { name: "Location" }` |
| Search for Stores button | Role | `button { name: "Search for Stores" }` |
| Close dialog button | Role | `button { name: "Close Find a Store" }` |

---

## Self-Healing Strategy

If any role-based selector fails (e.g., site redesign), the framework will:
1. **Retry** the selector up to 3 times with increasing timeouts
2. **Fallback** to text-based / CSS / XPath selectors
3. **AI-powered healing** — send the current page HTML to the AI engine and ask it to locate the element by description
4. **Cache** the healed selector for subsequent runs

---

## Risks & Considerations

1. **Headed Mode Required** — footlocker.com may block headless browsers; tests run in headed mode
2. **Popup Overlays** — Cookie consent, newsletter signups, or marketing overlays may intercept clicks; tests dismiss them proactively
3. **Dropdown Timing** — "Find a Store" dropdown may be slow to render; retry logic included
4. **Network Latency** — External site; generous timeouts (90s per test, 30s per action)
5. **Geo-Restrictions** — Search results for "USA" may vary by IP location
6. **Dynamic DOM** — Element refs change on load; use role/text-based selectors only

---

## Environment
- **Playwright Version:** Latest (via project config)
- **Browser:** Chromium (Desktop Chrome)
- **Viewport:** 1280 × 720
- **Mode:** Headed
- **Test Timeout:** 90 seconds
- **Action Timeout:** 30 seconds
