# AI-Assisted Test Automation Framework

A multi-platform, agent-driven test automation framework controlled entirely through **GitHub Copilot**. Every automation task — from writing a new test to fixing a failure — is handled by selecting the right agent in Copilot Chat and describing the requirement in plain English.

The framework covers **Web (Playwright), API, iOS/Android (MobileWright), macOS (WDIO + mac2), and Windows (WDIO + WinAppDriver)** — all from a single repository with a unified agent layer and shared CI/CD pipeline.

---

## How to Use This Framework

All automation is driven through **GitHub Copilot Chat** — select the agent for the platform you want to automate and describe the requirement in plain English:

```
@medtronic-automation-agent  Create smoke tests for the Medtronic India Patients page
@mac-app-agent  Generate smoke tests for HP Smart that verify all navigation items are visible
@windows-app-agent  Extend the myHP tests to verify the battery status section
@starhub-automation-agent  Automate AC1 from JIRA-123: user opens Products dropdown and clicks "UD Save"
@mobile-brownfield-automation-agent  Add a test to verify the Golf Galaxy cart total updates on item add
```

No manual scripts, no UI to navigate — the agent reads context, discovers real locators from the live app or device, generates production-ready code, and posts results to TestRail automatically.

---

## Available Agents

| Agent | Platform | Purpose |
|---|---|---|
| `medtronic-automation-agent` | Web (Playwright) | Brownfield web tests for Medtronic India (medtronic.com/in-en/) |
| `starhub-automation-agent` | Web + API (Playwright) | Brownfield web/API test generation with TestRail traceability |
| `ud-automation-agent` | Web + API (UnionDigital Bank) | Brownfield web/API tests for UnionDigital Bank Philippines |
| `mobile-brownfield-automation-agent` | iOS + Android (MobileWright) | Native mobile app test generation |
| `mac-app-agent` | macOS (WDIO + appium-mac2-driver) | macOS desktop app automation via XCTest |
| `windows-app-agent` | Windows (WDIO + WinAppDriver) | Windows desktop app automation via UIAutomation |
| `playwright-test-planner` | Web | Test plan generation from requirements |
| `playwright-test-generator` | Web | Playwright spec generation from a test plan |
| `playwright-test-healer` | Web | Diagnose and fix failing Playwright tests |

Each agent operates in automatic phases:

1. Load the relevant `context/` files for the platform
2. Audit existing POM assets to avoid duplication
3. Discover real locators from the live app (browser / device / Accessibility Inspector)
4. Create TestRail cases and embed case IDs in every test title
5. Generate three files — locators → screen/page object → spec
6. Run tests and post results to TestRail

The traceability chain produced:

```
Plain English AC  →  TestRail Case ID  →  spec title [TC-xxx]  →  CI run posts pass/fail to TestRail
```

---

## Platform Coverage

### Web & API — Playwright

**Config:** `playwright.config.js` / `config/playwright.config.js`
**Context:** `context/ui&api/`
**Tests:** `src/web/tests/` | `src/tests/`
**Pages:** `src/web/pages/` | `src/pages/`

```bash
npx playwright test src/tests/nav/ --config=config/playwright.config.js --grep "@smoke"
npx playwright test src/tests/ --config=config/playwright.config.js --grep "@regression"
```

> **PowerShell note:** quote the grep value — unquoted `@smoke` is treated as a PowerShell splat variable.

CI: `.github/workflows/playwright.yml`

#### Medtronic India — Web Test Suite

**Target:** https://www.medtronic.com/in-en/index.html
**Agent:** `medtronic-automation-agent`
**Context:** `context/ui&api/medtronic-application.md`, `medtronic-domain.md`, `medtronic-framework.md`
**Test Data:** `src/shared/data/medtronic-test-data.js`
**TestRail:** Cases C47–C67 (Project 2, Suite 6, Section 42)

| Spec File | Tests | Tags | Coverage |
|---|---|---|---|
| `medtronic-homepage.spec.js` | 9 (C47–C55) | `@smoke`, `@regression`, `@medtronic` | Hero, MEIC, HCP, Impact, Careers, Footer, Navigation |
| `medtronic-patients.spec.js` | 7 (C56–C62) | `@smoke`, `@regression`, `@medtronic` | CTAs, Response Care, Heart Safe, Conditions/Treatments nav |
| `medtronic-our-company.spec.js` | 5 (C63–C67) | `@smoke`, `@regression`, `@medtronic` | Page load, Mission, Key Facts, History, India page nav |

```bash
# Run all Medtronic tests
npx playwright test --grep "@medtronic" --config=config/playwright.config.js

# Smoke only
npx playwright test --grep "@medtronic" --grep "@smoke" --config=config/playwright.config.js

# Single spec
npx playwright test src/web/tests/nav/medtronic-homepage.spec.js --config=config/playwright.config.js

# Push test cases to TestRail
node src/shared/traceability/push-medtronic-to-testrail.js
```

**POM structure:**
```
src/web/locators/medtronic-homepage.locators.js      → selectors
src/web/locators/medtronic-patients.locators.js
src/web/locators/medtronic-our-company.locators.js
src/web/pages/medtronic-homepage.page.js             → page objects
src/web/pages/medtronic-patients.page.js
src/web/pages/medtronic-our-company.page.js
src/web/tests/nav/medtronic-homepage.spec.js          → specs
src/web/tests/nav/medtronic-patients.spec.js
src/web/tests/nav/medtronic-our-company.spec.js
```

---

### iOS & Android — MobileWright

**Config:** `mobilewright.config.mjs`
**Context:** `context/mobile/`
**Tests:** `src/mobile/tests/`
**Screens:** `src/mobile/screens/`

```bash
npx mobilewright test golfgalaxy-smoke.spec.mjs
npx mobilewright test golfgalaxy-smoke.spec.mjs --grep "@smoke"
```

**Current target:** Golf Galaxy Android (`com.dcsg.golfgalaxy.qa`)
**Prerequisites:** Android emulator running (or device connected via ADB), app installed

---

### macOS Desktop — WDIO + appium-mac2-driver

**Config:** `wdio.mac.config.js`
**Context:** `context/mac/`
**Tests:** `src/mac/tests/`
**Screens:** `src/mac/screens/`
**Locators:** `src/mac/locators/`

```bash
npm run appium:install:mac        # one-time driver install
npm run appium:mac:start          # start Appium on port 4724 (separate terminal)
npm run test:mac:hp               # run HP Smart smoke tests
npm run mac:show-report           # open HTML report
```

**Current target:** HP Smart (`com.hp.SmartForDesktop`)
**Prerequisites:** HP Smart installed from Mac App Store, Accessibility permission granted to Terminal in System Settings, Appium running on port 4724

CI: `.github/workflows/mac-hp-app-tests.yml` — runs on `macos-latest`, installs HP Smart via `mas`

---

### Windows Desktop — WDIO + WinAppDriver

**Config:** `wdio.windows.config.js`
**Context:** `context/windows/`
**Tests:** `src/windows/tests/`
**Screens:** `src/windows/screens/`
**Locators:** `src/windows/locators/`

```bash
npm run appium:install:windows    # one-time driver install
npm run appium:start              # start Appium on port 4723 (separate terminal)
npm run test:windows:hp           # run HP myHP smoke tests
npm run windows:show-report       # open HTML report
```

**Current target:** HP myHP (`AD2F1837.myHP_v10z8vjag6ke6!App`)
**Prerequisites:** Developer Mode ON, WinAppDriver installed at `C:\Program Files (x86)\Windows Application Driver\`, app installed from Microsoft Store

CI: `.github/workflows/windows-hp-app-tests.yml` — runs on `windows-latest`

---

## CI/CD Workflows

| Workflow | Platform | Runner | Schedule |
|---|---|---|---|
| `playwright.yml` | Web + API | `ubuntu-latest` | push / PR / schedule |
| `mac-hp-app-tests.yml` | macOS | `macos-latest` | weekdays 06:30 UTC |
| `windows-hp-app-tests.yml` | Windows | `windows-latest` | weekdays 06:00 UTC |

Every workflow produces:
- HTML test report artifact (30-day retention)
- Dark-theme HTML email via `dawidd6/action-send-mail`
- TestRail run with per-test pass/fail results posted automatically
- PR comment with run summary and artifact links
- GitHub Actions step summary with pass/fail metrics

**Required GitHub Secrets:**

| Secret | Used by |
|---|---|
| `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `EMAIL_TO` | All workflows |
| `TESTRAIL_HOST`, `TESTRAIL_USER`, `TESTRAIL_API_KEY`, `TESTRAIL_PROJECT_ID`, `TESTRAIL_SUITE_ID` | All workflows |
| `APPLE_ID`, `APPLE_PASSWORD` | macOS workflow (App Store install via `mas`) |

---

## Context Files

Each platform has a `context/` folder that agents read before writing any code:

```
context/
  ui&api/       Web + API  (application.md, framework.md, domain.md, project-prompt.md)
  mobile/       iOS + Android
  windows/      Windows app  (AUMID, UIAutomation locator rules, WinAppDriver conventions)
  mac/          macOS app  (bundle ID, XCTest locators, Accessibility Inspector workflow)
```

---

## Agents Directory

```
.github/agents/
  medtronic-automation.agent.md               Medtronic India web automation agent
  mac-app-agent.agent.md                      macOS automation (WDIO + mac2 driver)
  windows-app-agent.agent.md                  Windows automation (WDIO + WinAppDriver)
  starhub-automation-agent.agent.md           Web/API brownfield agent
  ud-automation-agent.agent.md                UnionDigital Bank web/API agent
  mobile-brownfield-automation-agent.agent.md iOS/Android MobileWright agent
  playwright-test-planner.agent.md            Test plan generation
  playwright-test-generator.agent.md          Playwright spec generation
  playwright-test-healer.agent.md             Test failure diagnosis and repair
```

---

## Repository Structure

```text
src/
  web/                    Playwright web tests and page objects
  tests/                  UnionDigital Bank Playwright specs
  pages/                  UnionDigital Bank POM page objects + locators
  mobile/                 MobileWright tests, screens, locators (Android/iOS)
  mac/                    macOS WDIO tests, screens, locators
  windows/                Windows WDIO tests, screens, locators
  shared/
    core/                 AI engine, agents, MCP, test runner
    data/                 Shared test data (TD.*)
    fixtures/             Extended test fixtures
    integrations/         Jira, TestRail, logging
    mcp/                  MCP clients and server
    traceability/         TestRail case map JSON files

config/
  playwright.config.js    Playwright config
  platform/
    mac.config.js         macOS Appium platform config (port 4724)
    windows.config.js     Windows Appium platform config (port 4723)

context/
  ui&api/                 Web + API context files
  mobile/                 Mobile context files
  mac/                    macOS context files
  windows/                Windows context files

.claude/agents/           GitHub Copilot agent definitions (all platforms)
.github/workflows/        CI/CD pipelines (web, macOS, Windows)
docs/                     Architecture diagrams and brownfield context

scripts/
  generate-email.js               Playwright HTML email generator
  generate-email-mac.js           macOS HTML email generator
  generate-email-windows.js       Windows HTML email generator
  report-mac-to-testrail.js       macOS TestRail reporter
  report-windows-to-testrail.js   Windows TestRail reporter

wdio.mac.config.js        macOS WDIO config (mac2 driver, port 4724)
wdio.windows.config.js    Windows WDIO config (WinAppDriver, port 4723)
mobilewright.config.mjs   MobileWright config (Android/iOS)
playwright.config.js      Root Playwright config (web/API)
```

---

## npm Scripts Reference

```bash
# ─── Web (Playwright) ──────────────────────────────────────────────────────
npx playwright test                              # all web tests
npx playwright test --grep "@smoke"              # smoke only

# ─── Mobile (MobileWright) ─────────────────────────────────────────────────
npx mobilewright test golfgalaxy-smoke.spec.mjs

# ─── macOS (WDIO + mac2) ───────────────────────────────────────────────────
npm run appium:install:mac                       # one-time driver install
npm run appium:mac:start                         # start Appium on port 4724
npm run test:mac:hp                              # HP Smart smoke tests
npm run mac:show-report                          # open HTML report

# ─── Windows (WDIO + WinAppDriver) ─────────────────────────────────────────
npm run appium:install:windows                   # one-time driver install
npm run appium:start                             # start Appium on port 4723
npm run test:windows:hp                          # HP myHP smoke tests
npm run windows:show-report                      # open HTML report

# ─── Reporting ─────────────────────────────────────────────────────────────
node scripts/generate-email-mac.js
node scripts/generate-email-windows.js
node scripts/report-mac-to-testrail.js
node scripts/report-windows-to-testrail.js
```

---

## Architecture

See [docs/architectural_digram/client-framework-diagram.md](docs/architectural_digram/client-framework-diagram.md) for the full multi-platform architecture diagram.
