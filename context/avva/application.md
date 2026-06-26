# AVVA Console Application Context

## Application Overview

**AVVA** is an enterprise AI-powered platform for complete test activities (QA & QE). This document
describes the structure, routes, and known characteristics of the AVVA Console web application for
test automation purposes.

---

## Base URL

**Production:** https://int-ai.aava.ai/  
**Launchpad/Build Section:** https://int-ai.aava.ai/launchpad/build/agent

---

## Authentication

### Microsoft SSO (Single Sign-On)

AVVA uses Microsoft Azure AD for authentication.

**Login Flow:**
1. Navigate to https://int-ai.aava.ai/
2. If not authenticated, redirect to Microsoft login page
3. Enter Microsoft credentials (mohan.r@ascendion.com)
4. Microsoft consent screen (if first time)
5. Redirect back to AVVA Console with JWT token
6. Token stored in localStorage as `authToken`

**Test Strategy:**
- Use Playwright's `storageState` to save authenticated session
- Store in `playwright/.auth/avva-storageState.json`
- Reuse across tests to avoid repeated login
- Refresh token if expired (JWT expiry: check token payload)

**Auth Token:**
- Stored in: `localStorage.getItem('authToken')`
- Format: JWT Bearer token
- Configured in `.env` as `AVVA_TOKEN`

---

## Application Structure

### Main Navigation Sections

| Section | URL Pattern | Description |
|---------|-------------|-------------|
| Dashboard | `/dashboard` | Overview, metrics, recent activity |
| Launchpad | `/launchpad/*` | Agent builder, test generation tools |
| Test Cases | `/testcases` | Test case management, CRUD operations |
| Results | `/results` | Test execution results, reports |
| Settings | `/settings` | User settings, project config |

### Launchpad Subsections

| Feature | URL | Purpose |
|---------|-----|---------|
| Build Agent | `/launchpad/build/agent` | **Primary test target** — Drag-drop AI agent builder |
| Build Workflow | `/launchpad/build/workflow` | Workflow automation builder |
| Test Generator | `/launchpad/generate` | AI-powered test script generation |

---

## Known Selectors & Patterns

### Global Elements

```javascript
// Main navigation
const mainNav = page.locator('[data-testid="main-nav"]');
const dashboardLink = page.locator('[data-testid="nav-dashboard"]');
const launchpadLink = page.locator('[data-testid="nav-launchpad"]');

// User menu (top-right)
const userMenu = page.locator('[data-testid="user-menu"]');
const logoutButton = page.locator('[data-testid="logout-btn"]');

// Loading states
const spinner = page.locator('[data-testid="loading-spinner"]');
const pageLoader = page.locator('.page-loader');
```

### Agent Builder Page (/launchpad/build/agent)

```javascript
// Canvas area
const agentCanvas = page.locator('[data-testid="agent-canvas"]');
const toolPalette = page.locator('[data-testid="tool-palette"]');

// Common buttons
const saveAgentBtn = page.locator('[data-testid="save-agent"]');
const runAgentBtn = page.locator('[data-testid="run-agent"]');
const exportAgentBtn = page.locator('[data-testid="export-agent"]');

// Agent properties panel
const propertiesPanel = page.locator('[data-testid="properties-panel"]');
const agentNameInput = page.locator('[data-testid="agent-name-input"]');
```

**Note:** These are placeholder selectors based on common patterns. Phase 4 live inspection will
confirm actual selectors from the DOM.

---

## Page Load Characteristics

### Technology Stack
- **Frontend:** React SPA (Single Page Application)
- **State Management:** Redux or similar
- **Routing:** React Router (client-side)
- **API:** REST API at `/api/*` endpoints

### Load Strategy

```javascript
// For initial page load
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForLoadState('networkidle', { timeout: 30000 });

// For SPA navigation (no full page reload)
await page.click('[data-testid="nav-link"]');
await page.waitForLoadState('networkidle', { timeout: 15000 });
```

### Common Wait Patterns

```javascript
// Wait for spinner to disappear
await page.locator('[data-testid="loading-spinner"]').waitFor({ state: 'hidden', timeout: 15000 });

// Wait for specific element to appear
await page.locator('[data-testid="agent-canvas"]').waitFor({ state: 'visible', timeout: 15000 });

// Wait for API response (network idle)
await page.waitForLoadState('networkidle');
```

---

## API Endpoints (Backend)

Captured via `browser_network_requests` during live inspection:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | Microsoft SSO token exchange |
| `/api/agents` | GET | List all agents |
| `/api/agents` | POST | Create new agent |
| `/api/agents/{id}` | PUT | Update agent |
| `/api/agents/{id}` | DELETE | Delete agent |
| `/api/testcases` | GET | List test cases |
| `/api/testcases` | POST | Create test case |
| `/api/results` | POST | Post test result |

**Note:** Actual endpoints to be confirmed via Phase 4 network inspection.

---

## Known Issues & Workarounds

### Issue 1: SSO Redirect Loop
**Symptom:** Microsoft login redirects back to AVVA but session not established  
**Workaround:** Clear localStorage, delete cookies, retry login

### Issue 2: Canvas Load Delay
**Symptom:** Agent builder canvas elements not immediately visible after navigation  
**Workaround:** Wait for `networkidle` + explicit wait for canvas element

### Issue 3: Token Expiry
**Symptom:** 401 Unauthorized errors mid-session  
**Workaround:** Check token expiry from JWT payload, re-authenticate if expired

---

## Test Data Locations

- **Test users:** Stored in `.env` (AVVA_EMAILID, AVVA_TOKEN)
- **Sample agents:** `src/shared/data/avva-sample-agents.json`
- **API payloads:** `src/shared/data/avva-api-payloads.json`

---

## Environment Variables

Required in `.env`:

```env
AVVA_HOST=https://int-ai.aava.ai/console/
AVVA_EMAILID=mohan.r@ascendion.com
AVVA_TOKEN=<JWT Bearer token>
```

---

## Browser Support

- **Primary:** Chromium (Playwright default)
- **Tested:** Firefox, WebKit
- **Mobile:** Responsive design, but primarily desktop-focused

---

## Accessibility Notes

- ARIA labels generally present on interactive elements
- Keyboard navigation supported
- Screen reader compatible (WCAG 2.1 AA compliant)

---

## Performance Characteristics

- **Initial load:** ~2-3 seconds (with auth)
- **SPA navigation:** < 1 second
- **Agent builder canvas render:** ~1-2 seconds
- **API response time:** < 500ms (typical)

---

## Version & Updates

- **Current version:** Check footer for version number
- **Release cadence:** Bi-weekly deployments
- **Breaking changes:** Monitor release notes at `/docs/changelog`

---

## Contact & Support

- **Support email:** support@aava.ai
- **Docs:** https://int-ai.aava.ai/docs
- **Status page:** https://status.aava.ai
