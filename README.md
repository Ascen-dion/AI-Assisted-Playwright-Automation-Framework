# AI-Assisted Playwright Automation Framework

This repository is an AI-assisted Playwright automation framework that combines a browser UI, workflow API, agent-driven test planning and generation, self-healing, MCP support, and enterprise integrations.

The current branch is focused on a brownfield e-commerce implementation, but the framework itself is designed to be reused for other applications, environments, and delivery pipelines.

Hosted UI:
- https://ascen-dion.github.io/AI-Assisted-Playwright-Automation-Framework/

Current brownfield target:
- https://uniondigitalbank.io/en (homepage / entry point)
- https://uniondigitalbank.io/en/products-savings (UD Save product page)

## Preferred Agent — `ud-automation-agent`

To generate, extend, or fix any test in this repository, use the **`ud-automation-agent`** defined in `.github/agents/ud-automation.agent.md`.

Invoke it in GitHub Copilot Chat by selecting the agent from the agent picker, then describe the acceptance criteria in plain English:

```
Automate AC1: Given user is on the homepage, When user opens Products dropdown and clicks "UD Save", Then user is navigated to https://uniondigitalbank.io/en/products-savings
```

The agent operates in 8 phases automatically — no manual steps required:

| Phase | What happens |
|---|---|
| **1 — Load Context** | Reads all four `context/` files to understand the app, framework conventions, domain rules, and guardrails |
| **2 — Audit Assets** | Scans `src/pages/`, `src/pages/locators/`, and `src/tests/` to reuse existing locators, page objects, and specs before creating anything new |
| **2.2 — Check TestRail** | Reads `testrail-case-map.json` and existing spec titles for `[Cxxx]` IDs — skips TestRail push if already covered |
| **3 — TestRail Cases** | Parses ACs into structured test case objects and pushes them to TestRail via `push-to-testrail.js`; embeds the assigned `[Cxxx]` ID into every test title |
| **4 — Live Inspection** | Navigates the live application in a browser, inspects the real DOM, and confirms every selector before writing any code |
| **5 — Decide Test Type** | Chooses UI test, API test, or both based on the AC |
| **6 — Generate Code** | Produces three POM-structured files: `<name>.locators.js`, `<name>.page.js`, and `<name>-automated.spec.js` |
| **7 — Quality Gates** | Verifies no raw selectors in specs, no duplication, correct timeouts, `TD.*` values, and `[Cxxx]` prefix on every test title |
| **8 — Run & Verify** | Executes the new spec, fixes failures, and confirms TestRail results are posted |

The traceability chain the agent produces:

```
Plain English AC  →  TestRail Case (Cxxx)  →  Playwright spec title [Cxxx]  →  TestRail Run (pass/fail auto-posted)
```

All TestRail credentials are pre-configured in `.env`. The only value to supply per story is the Jira reference (e.g. `AU-11`).

---

## What This Framework Can Do

- Run an end-to-end workflow from requirements or Jira story to generated Playwright automation.
- Create Jira stories from plain English requirements.
- Fetch Jira stories and acceptance criteria.
- Generate test cases with an AI Planner Agent.
- Sync generated test cases into TestRail.
- Generate Playwright test scripts with an AI Generator Agent.
- Execute tests and collect runtime results.
- Update Jira with execution results.
- Self-heal failing tests with an AI Healer Agent.
- Use Model Context Protocol (MCP) for planning, code generation, failure analysis, and page inspection.
- Support brownfield test generation with reusable POM assets and project-specific context.
- Run through a browser-based UI, local backend, or cloud backend.
- Automate native mobile apps on Android using the MobileWright test driver.

## Core Capabilities

### 1. Workflow UI

The React UI in `ui/` is not just a launcher. It is a workflow control surface for:

- Jira-ID mode and plain-English mode.
- Cloud backend or local backend switching.
- Target URL selection.
- Application knowledge input.
- Framework knowledge input.
- Domain knowledge input.
- Project-specific prompt input.
- Related Jira story references.
- Wiki/documentation links.
- Text document upload for extra context.
- Live workflow progress, logs, timing, and results.

The UI drives these workflow stages:

1. Fetch or create story
2. Generate test cases
3. Push to TestRail
4. Generate test scripts
5. Execute tests
6. Update results

## 2. Workflow API

The backend API in `server/workflow-api.js` orchestrates the full pipeline:

- `POST /api/workflow/create-story`
- `POST /api/workflow/fetch-jira`
- `POST /api/workflow/generate-tests`
- `POST /api/workflow/push-testrail`
- `POST /api/workflow/generate-scripts`
- `POST /api/workflow/execute-tests`
- `POST /api/workflow/update-results`
- `POST /api/workflow/self-heal`
- `GET /api/health`

This makes the framework usable beyond the UI as a service layer that can be called from scripts, jobs, or external orchestration pipelines.

## 3. AI Agents

The framework includes three core automation agents:

- Planner Agent: generates structured test plans and scenarios.
- Generator Agent: produces executable Playwright test code.
- Healer Agent: analyzes failures and regenerates or repairs unstable tests.

There are two agent layers in the repo:

- Direct agent implementation in `src/core/test-agents.js`
- MCP-enhanced agent implementation in `src/core/test-agents-mcp.js`

These agents support:

- Plan-first workflows.
- Generate-and-run workflows.
- Failure analysis workflows.
- Heal-and-retry workflows.
- Validation of generated code before execution.

## 4. MCP Support

The framework has built-in MCP support in `src/mcp/`.

Implemented MCP components include:

- MCP manager
- Playwright MCP client
- Microsoft Playwright MCP client
- Playwright MCP server

MCP is used for:

- Test plan generation.
- Test code generation.
- Failure analysis.
- Live page inspection.
- Hybrid AI plus browser-automation workflows.

The framework can operate with MCP enabled or disabled using environment configuration.

## 5. AI Provider Flexibility

The AI engine supports multiple provider strategies.

Supported modes in `src/core/ai-engine.js`:

- OpenRouter for cloud-hosted multi-model access.
- Anthropic Claude.
- Local LLM through OpenAI-compatible endpoints.
- Disabled mode for selector-only or non-AI fallback scenarios.

Local LLM support includes:

- Ollama
- LM Studio
- Other OpenAI-compatible local endpoints

The local setup script in `scripts/setup-local-llm.ps1` configures the project to run with a local model such as `llama3.2:3b`.

This means the framework can run with:

- Cloud-hosted AI
- Local/self-hosted AI
- Direct OpenAI-compatible model endpoints
- Mixed fallback behavior

## 6. Brownfield Context Awareness

This branch is built around deterministic brownfield automation rather than generic test generation.

The framework can inject project context through:

- Target application URL
- Application knowledge
- Framework knowledge
- Domain knowledge
- Related Jira stories
- Wiki links
- Uploaded documents
- Additional prompt context

That context is normalized and merged into prompts through `src/helpers/project-context.js` so generated plans and scripts stay aligned with the real application.

## 7. Page Object Model and Reusable Assets

The repository includes production-grade POM assets for the UnionDigital Bank Philippines brownfield implementation:

**Page objects** (`src/pages/`):
- `ud-homepage-nav.page.js`
- `ud-products-nav.page.js`
- `ud-save-nav.page.js`

**Locator files** (`src/pages/locators/`):
- `ud-homepage-nav.locators.js`
- `ud-products-nav.locators.js`
- `ud-save-nav.locators.js`

All locators are derived from live DOM inspection. No hardcoded CSS or XPath. The framework is structured so these assets act as seeds and can be extended test-by-test without duplication.

## 8. Enterprise Integrations

Built-in integrations include:

- Jira integration
- TestRail integration
- Jira-to-automation workflow support
- Jira result updates after execution

The framework can:

- Pull requirements from Jira
- Convert requirements into test cases
- Push or update cases in TestRail
- Execute generated tests
- Push outcomes back into Jira

## 9. GitHub Copilot, Agents, and Skills

This repository also includes assets for agent-based development workflows inside tools like GitHub Copilot and similar coding-agent environments.

Included assets:

- Custom agent definitions in `.github/agents/`
  - `ud-automation-agent` (`ud-automation.agent.md`) — end-to-end brownfield agent covering context loading, TestRail traceability, live DOM inspection, POM code generation, and test execution
  - `playwright-test-planner`
  - `playwright-test-generator`
  - `playwright-test-healer`
- Copilot setup workflow in `.github/workflows/copilot-setup-steps.yml`
- Skill assets in `.claude/skills/` — `playwright-cli`, `api-testing`, `brownfield-context`

The `ud-automation-agent` implements a full AC → TestRail → Playwright → TestRail results traceability chain automatically. Every generated test title carries a `[Cxxx]` TestRail case ID that is parsed by the reporter after each run.

That makes the framework usable not only as a test runtime, but also as an agent-enabled automation workspace.

## 11. Mobile Automation

The framework includes a native mobile automation layer powered by **MobileWright** (`mobilewright.config.mjs`) that lets you drive real Android apps using the same POM patterns as the web layer.

### Current mobile target

- **App:** Golf Galaxy Android (`com.dcsg.golfgalaxy.qa`)
- **Platform:** Android (emulator or physical device)

### Mobile directory layout

```text
src/mobile/
  tests/              Spec files (golfgalaxy-smoke.spec.mjs)
  screens/            Mobile POM page objects
    golfgalaxy-base.page.js
    golfgalaxy-home.page.js
    locators/         Mobile locator files
      golfgalaxy-home.locators.js
src/shared/data/
  golfgalaxy-test-data.js   Centralised mobile test data (TD.*)
src/mobile/reports/html/    HTML report output
```

### MobileWright configuration

Defined in `mobilewright.config.mjs` at the repo root:

- `platform: 'android'`
- `testDir: './src/mobile/tests'`
- `retries: 0`
- HTML report output to `src/mobile/reports/html/`

### Prerequisites

- Android emulator booted (or physical device connected via ADB)
- `com.dcsg.golfgalaxy.qa` installed on the device
- MobileWright installed (`npm install`)

### Run mobile tests

```bash
# All mobile tests
npx mobilewright test golfgalaxy-smoke.spec.mjs

# Smoke only
npx mobilewright test golfgalaxy-smoke.spec.mjs --grep "@smoke"
```

### Mobile test coverage (Golf Galaxy)

| Tag | Area | What is tested |
|---|---|---|
| `@smoke` | Home Screen | App launches, Welcome text visible |
| `@smoke` | Home Screen | Shop tab visible below Welcome text |
| `@smoke` | Home Screen | Hot Deals tab visible below Welcome text |

All assertion strings and timeouts are centralised in `mobile/data/youtube-test-data.js`. No values are hardcoded in spec files.

---

## 10. CI/CD and Pipeline Readiness

This framework is structured so it can plug into delivery pipelines instead of being limited to local execution.

Current pipeline and hosting signals in the repo include:

- GitHub Actions workflow for UI deployment
- GitHub Actions workflow for Playwright execution (`.github/workflows/playwright.yml`)
  - `smoke` job: runs `@smoke` tests on every push — fast nav checks
  - `test` job: runs `@regression` tests with full suite
  - Automatic TestRail run created and results posted after every execution via `testrail-reporter.js`
  - Modern dark-theme HTML email report generated by `scripts/generate-email.js` and sent via `dawidd6/action-send-mail`
  - GitHub Actions step summary with pass/fail counts
  - PR comment with run link on pull request events
- Railway deployment configuration
- Procfile and Nixpacks support
- Static UI hosting via GitHub Pages

The backend can be deployed independently to platforms such as:

- Railway
- Azure
- AWS
- Heroku
- Other Node.js hosting targets

Because the backend exposes workflow endpoints, you can also wire it into your own internal pipeline, orchestrator, or release process.

## Architecture

Client-facing architecture diagram:

- [docs/client-framework-diagram.md](docs/client-framework-diagram.md)

High-level flow:

1. User enters a Jira ID or plain-English requirement in the UI
2. UI sends context to the workflow API
3. API fetches or creates a Jira story
4. Planner Agent generates test cases
5. TestRail integration syncs those cases
6. Generator Agent creates Playwright scripts
7. Execution step runs tests and stores artifacts
8. Healer Agent can repair failures
9. Jira can be updated with results

## Repository Structure

```text
ui/                         React workflow UI
server/                     Express workflow API
src/core/                   AI engine, AI page layer, agents, runner
src/helpers/                Context handling, inspection, reporting, healing helpers
src/integrations/           Jira, TestRail integrations, logging reporter, self-healing queue
src/mcp/                    MCP manager, clients, and server
src/pages/                  UnionDigital Bank POM page objects (one per feature area)
src/pages/locators/         UnionDigital Bank locator files (one per feature area)
src/tests/nav/              Navigation smoke + regression specs (Homepage, Products, UD Save)
src/tests/application/      Application journey specs
src/data/                   Centralised test data module (TD.*)
src/fixtures/               Extended Playwright fixture with self-healing queue
src/mobile/tests/           Mobile spec files (Android — Golf Galaxy smoke)
src/mobile/screens/         Mobile POM page objects and locator files
src/shared/data/            Centralised test data (web + mobile, TD.*)
src/mobile/reports/         Mobile HTML report output
mobilewright.config.mjs     MobileWright configuration (platform, testDir, retries, reporter)
context/                    Live project context files (application, framework, domain, prompt)
docs/                       Architecture diagrams and brownfield context documentation
scripts/                    Local setup, startup, and email generation scripts
.github/agents/             Custom agent definitions (ud-automation-agent, planner, generator, healer)
.github/workflows/          CI/CD pipeline (Playwright smoke + regression, TestRail reporting, email notification)
```

## Run Locally

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

### Smoke Tests (navigation — fast)

```bash
# PowerShell
npx playwright test src/tests/nav/ --config=config/playwright.config.js --grep "@smoke" --reporter=list

# bash / CI
npx playwright test src/tests/ --config=config/playwright.config.js --project=chromium --grep @smoke
```

### Regression Tests (full suite)

```bash
# PowerShell
npx playwright test src/tests/ --config=config/playwright.config.js --grep "@regression" --reporter=list

# bash / CI
npx playwright test src/tests/ --config=config/playwright.config.js --project=chromium --grep @regression
```

> **PowerShell note:** always quote the grep value (`"@smoke"`) — unquoted `@smoke` is treated as a PowerShell splat variable and will error.

## Deployment Options

### Frontend

- GitHub Pages

### Backend

- Local Node.js server
- Railway
- Any Node-compatible cloud host

## Branch Context

This branch is centred on the UnionDigital Bank Philippines website (`uniondigitalbank.io`) as the brownfield target. It demonstrates deterministic POM-oriented test generation with full AC → TestRail → Playwright traceability.

Target coverage for this branch:

| Category | Description |
|---|---|
| Homepage Navigation | Hero banner visibility, Download CTA, page title |
| Products Dropdown | UD Save, UD Time Deposit navigation via dropdown |
| UD Save Page | Hero heading, Taglish feature text, Download section |
| About Us Nav | Footer and top nav about-us link navigation |

That focus does not remove the broader framework capabilities listed above. It simply provides a concrete, fully-traced implementation and seed project for the wider platform.
