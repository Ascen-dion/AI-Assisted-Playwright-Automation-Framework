---
name: api-testing
description: >
  Generate and validate Playwright API tests against REST endpoints discovered during browser
  automation. Use this skill when a user story involves data creation, retrieval, payload
  validation, or response code verification — or when browser_network_requests reveals backend
  API calls worth testing directly. Produces self-contained Playwright request context tests
  that complement UI tests without depending on browser state.
allowed-tools: read_file create_file replace_string_in_file Bash(npx:*) Bash(node:*)
---

# API Testing with Playwright Request Context

## When to use this skill

- User story mentions API endpoints, payloads, or HTTP response codes
- `browser_network_requests` during live inspection reveals XHR/fetch calls to a backend
- Story requires verifying data integrity behind a UI action (e.g. cart total, order creation)
- You need to test CRUD operations independent of browser rendering

---

## Step 1 — Discover API endpoints

Before writing any API test, capture real network traffic from the live application:

```
# Use browser_navigate + browser_network_requests to discover endpoints
# Navigate to each relevant page and perform key actions
# Record: method, URL pattern, request payload shape, response payload shape, status codes
```

Look for:
- REST endpoints: `/api/products`, `/api/cart`, `/api/orders`
- Auth headers: Bearer tokens, cookies, CSRF tokens
- Response shape: top-level keys, nested objects, arrays
- Error responses: 400/404/422 shapes for negative tests

---

## Step 2 — File naming and structure

```
src/tests/<jira-id>-api.spec.js          Single story API spec
src/tests/<feature>-api-regression.spec.js  Multi-endpoint regression suite
```

---

## Step 3 — Standard API test template

```js
// === FILE: src/tests/<jira-id>-api.spec.js ===
const { test, expect, request } = require('@playwright/test');

// Base URL from context/application.md or discovered from network inspection
const API_BASE = process.env.API_BASE_URL || '<discovered-api-base>';

test.describe('[API] <Story Title>', () => {
  let api;

  test.beforeAll(async () => {
    api = await request.newContext({
      baseURL: API_BASE,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Add auth headers if required: 'Authorization': `Bearer ${token}`
      }
    });
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  // --- GET tests ---
  test('GET <endpoint> returns 200 with valid structure', async () => {
    const res = await api.get('<endpoint>');
    expect(res.status()).toBe(200);
    const body = await res.json();
    // Assert structure — use exact fields from network inspection
    expect(Array.isArray(body) || typeof body === 'object').toBe(true);
    expect(body).toHaveProperty('<known-field>');
  });

  // --- POST tests ---
  test('POST <endpoint> creates resource and returns 201', async () => {
    const payload = {
      // Use minimal valid payload discovered from network inspection
    };
    const res = await api.post('<endpoint>', { data: payload });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('id');
  });

  // --- Negative tests ---
  test('POST <endpoint> with missing required field returns 400', async () => {
    const res = await api.post('<endpoint>', { data: {} });
    expect([400, 422]).toContain(res.status());
  });

  test('GET <endpoint>/<invalid-id> returns 404', async () => {
    const res = await api.get('<endpoint>/nonexistent-id-99999');
    expect(res.status()).toBe(404);
  });
});
```

---

## Step 4 — Combined UI + API test pattern

Use this when a UI action must be verified at both the presentation and data layer:

```js
// === FILE: src/tests/<jira-id>-e2e.spec.js ===
const { test, expect, request } = require('@playwright/test');
const <Name>Page = require('../pages/<name>.page');

const API_BASE = process.env.API_BASE_URL || '<discovered-api-base>';

test.describe('[E2E] <Story Title>', () => {
  let api;

  test.beforeAll(async () => {
    api = await request.newContext({ baseURL: API_BASE });
  });

  test.afterAll(async () => { await api.dispose(); });

  test('UI action reflects correct API state', async ({ page }) => {
    // 1. Drive the UI action
    const uiPage = new <Name>Page(page);
    await uiPage.goto();
    await uiPage.addItemToCart('product-name');

    // 2. Verify UI outcome
    const cartCount = await uiPage.getCartCount();
    expect(cartCount).toBe(1);

    // 3. Verify API state matches UI
    const res = await api.get('/api/cart');
    expect(res.status()).toBe(200);
    const cart = await res.json();
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].name).toBe('product-name');
  });
});
```

---

## Step 5 — Quality rules for API tests

- [ ] `api` context created in `beforeAll`, disposed in `afterAll` — never per-test
- [ ] Assert `res.status()` before parsing body — gives clearer failure messages
- [ ] Assert specific payload fields from network inspection — not just `toBeTruthy()`
- [ ] Include at least one negative test (missing field → 400/422, bad ID → 404)
- [ ] Never hardcode auth tokens — use `process.env` variables
- [ ] If the API requires auth, document the required env variable in a comment at the top of the file
- [ ] Test data created in a test must not affect other tests — use unique identifiers or cleanup in `afterEach`

---

## Step 6 — Chaining with the brownfield-context skill

Always load `brownfield-context` skill before this one to ensure:
- API base URL comes from `context/application.md`
- Request payload shapes align with `context/domain.md` business rules
- File naming follows `context/framework.md` conventions
