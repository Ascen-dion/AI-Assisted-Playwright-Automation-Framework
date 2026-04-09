# Brownfield Playwright POM Framework

This branch is focused only on the brownfield e-commerce project:
- Target app: https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net/
- Architecture: Playwright + POM + AI-assisted workflow
- Goal: deterministic test generation using project context

## Kept Scope
- UI workflow app: ui/
- Workflow backend API: server/
- Reusable framework code: src/core/, src/helpers/, src/integrations/
- Brownfield POM assets:
  - src/pages/ecomm-brownfield.page.js
  - src/pages/locators/ecomm-brownfield.locators.js
  - src/tests/ecomm-brownfield-smoke.spec.js
- Brownfield project context doc:
  - docs/BROWNFIELD_POM_CONTEXT.md

## Run

### Backend
```bash
cd server
npm install
node workflow-api.js
```

### UI
```bash
cd ui
npm install
npm start
```

### Smoke test
```bash
npx playwright test src/tests/ecomm-brownfield-smoke.spec.js --config=config/playwright.config.js --reporter=list
```
