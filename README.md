# AI-Assisted Playwright Automation Framework

This repository is an AI-assisted Playwright automation framework that combines a browser UI, workflow API, agent-driven test planning and generation, self-healing, MCP support, and enterprise integrations.

The current branch is focused on a brownfield e-commerce implementation, but the framework itself is designed to be reused for other applications, environments, and delivery pipelines.

Hosted UI:
- https://ascen-dion.github.io/AI-Assisted-Playwright-Automation-Framework/

Current brownfield target:
- https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net/

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

The repository includes reusable POM assets for the brownfield sample implementation:

- `src/pages/ecomm-brownfield.page.js`
- `src/pages/locators/ecomm-brownfield.locators.js`
- `src/tests/ecomm-brownfield-smoke.spec.js`

The framework is structured so these assets can act as seeds for future generated tests.

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
- `playwright-test-planner`
- `playwright-test-generator`
- `playwright-test-healer`
- Copilot setup workflow in `.github/workflows/copilot-setup-steps.yml`
- Local skill asset in `.claude/skills/playwright-cli/SKILL.md`

That makes the framework usable not only as a test runtime, but also as an agent-enabled automation workspace.

## 10. CI/CD and Pipeline Readiness

This framework is structured so it can plug into delivery pipelines instead of being limited to local execution.

Current pipeline and hosting signals in the repo include:

- GitHub Actions workflow for UI deployment
- GitHub Actions workflow for Playwright execution
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
ui/                     React workflow UI
server/                 Express workflow API
src/core/               AI engine, AI page layer, agents, runner
src/helpers/            Context handling, inspection, reporting, healing helpers
src/integrations/       Jira and TestRail integrations
src/mcp/                MCP manager, clients, and server
src/pages/              Brownfield POM page objects and locators
src/tests/              Brownfield Playwright tests
docs/                   Brownfield context documentation
scripts/                Local setup and startup scripts
.github/agents/         Custom planner/generator/healer agent definitions
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

### Smoke Test

```bash
npx playwright test src/tests/ecomm-brownfield-smoke.spec.js --config=config/playwright.config.js --reporter=list
```

## Deployment Options

### Frontend

- GitHub Pages

### Backend

- Local Node.js server
- Railway
- Any Node-compatible cloud host

## Branch Context

This branch is currently centered on the brownfield e-commerce project and deterministic POM-oriented generation. That focus does not remove the broader framework capabilities listed above. It simply provides a concrete implementation and seed project for the wider platform.
