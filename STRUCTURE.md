# Framework Structure

This document explains the organization of the Playwright AI Framework.

## 📁 Folder Structure

```
playwright-ai-framework/
├── config/                      # Configuration files
│   └── playwright.config.js     # Playwright test configuration
│
├── docs/                        # Documentation
│   ├── QUICKSTART.md           # Getting started guide
│   ├── ARCHITECTURE.md         # Framework architecture
│   ├── PLAN_TO_CODE_GUIDE.md   # Jira to test automation guide
│   ├── EXAMPLES.md             # Usage examples
│   ├── INTEGRATION_*.md        # Integration guides
│   ├── MCP_*.md                # MCP protocol documentation
│   ├── TEST_AGENTS_*.md        # Test agents documentation
│   ├── *_TEST_PLAN.md          # Test plan documents
│   ├── PRESENTATION_*.md       # Presentation materials
│   ├── GITHUB_ACTIONS_SETUP.md # CI/CD setup
│   └── SECRETS_SETUP.md        # Environment setup
│
├── examples/                    # Example usage patterns
│   └── mcp-usage-examples.js   # MCP integration examples
│
├── logs/                        # Application logs
│
├── scripts/                     # Utility scripts
│   ├── demo-integration.js     # Integration demo script
│   ├── generate-aava-plan.js   # AAVA test plan generator
│   ├── generate-framework-ppt.js # Presentation generator
│   └── setup-local-llm.ps1     # Local LLM setup script
│
├── src/                         # Source code
│   ├── core/                   # Core framework components
│   │   ├── ai-engine.js        # Multi-provider AI engine
│   │   ├── ai-page.js          # AI-enhanced page object
│   │   ├── ai-test-runner.js   # AI-powered test runner
│   │   ├── element-finder.js   # Intelligent element finder
│   │   └── test-agents-*.js    # Test agents implementation
│   │
│   ├── helpers/                # Helper utilities
│   │   ├── reporting.js        # Test reporting utilities
│   │   ├── self-healing.js     # Self-healing test logic
│   │   └── visual-ai.js        # Visual comparison utilities
│   │
│   ├── integrations/           # External integrations
│   │   ├── jira-integration.js           # Jira API integration
│   │   ├── jira-to-automation.js         # Jira → Test workflow
│   │   ├── testrail-integration.js       # TestRail API integration
│   │   ├── get-testrail-sections.js      # TestRail helper script
│   │   ├── test-jira-connection.js       # Jira connection test
│   │   └── update-jira-results.js        # Jira results updater
│   │
│   ├── mcp/                    # Model Context Protocol
│   │   ├── playwright-mcp-client.js # MCP client
│   │   └── playwright-mcp-server.js # MCP server
│   │
│   └── tests/                  # Test files
│       ├── example.spec.js     # Basic examples
│       ├── saucedemo.spec.js   # Demo tests
│       ├── aava-*.spec.js      # AAVA application tests
│       ├── endpoint-*.spec.js  # Endpoint Clinical tests
│       ├── test-agents-*.spec.js # Test agents verification
│       └── mcp-demo.spec.js    # MCP integration tests
│
├── test-results/               # Test execution results
│
├── tools/                      # Development tools
│   ├── test-anthropic.js       # Anthropic AI provider test
│   └── test-openrouter.js      # OpenRouter AI provider test
│
├── utils/                      # Shared utilities
│   └── logger.js               # Logging utility
│
├── .env                        # Environment variables (not in git)
├── .gitignore                  # Git ignore rules
├── package.json                # Node.js dependencies
└── README.md                   # Main documentation
```

## 🎯 Folder Purposes

### `/config`
Playwright and framework configuration files. Modify these to adjust test behavior.

### `/docs`
All documentation including guides, architecture, test plans, and setup instructions. Start with [docs/QUICKSTART.md](docs/QUICKSTART.md).

### `/examples`
Working code examples demonstrating framework features and patterns.

### `/scripts`
Utility scripts for setup, demo, and code generation. Not part of the test framework itself.

### `/src/core`
Heart of the framework:
- **ai-engine.js**: Multi-provider AI engine (OpenRouter, Anthropic, Local LLM)
- **ai-page.js**: AI-enhanced page object with natural language commands
- **element-finder.js**: Intelligent element locator with fallback strategies
- **test-agents-*.js**: Test agents for MCP integration

### `/src/helpers`
Supporting utilities for reporting, self-healing, and visual comparisons.

### `/src/integrations`
External system integrations:
- **jira-to-automation.js**: Main workflow orchestrator
- **jira-integration.js**: Jira API client
- **testrail-integration.js**: TestRail API client
- **Helper scripts**: Connection testing and utilities

### `/src/mcp`
Model Context Protocol implementation for Claude Desktop integration.

### `/src/tests`
Playwright test specifications. Generated tests go here.

### `/test-results`
Playwright test output including screenshots, videos, and reports.

### `/tools`
Development tools for testing AI providers and debugging.

### `/utils`
Shared utilities used across the framework.

## 🚀 Common Workflows

### Running the Jira → Test Automation Workflow
```powershell
node src/integrations/jira-to-automation.js ED-2
```

### Testing Jira Connection
```powershell
node src/integrations/test-jira-connection.js
```

### Finding TestRail Sections
```powershell
node src/integrations/get-testrail-sections.js
```

### Updating Jira with Results
```powershell
node src/integrations/update-jira-results.js ED-2
```

### Testing AI Providers
```powershell
node tools/test-anthropic.js
node tools/test-openrouter.js
```

### Running Tests
```powershell
npx playwright test src/tests/example.spec.js
npx playwright test src/tests/example.spec.js --headed
```

## 📝 Adding New Components

### New Test File
Place in `src/tests/` with `.spec.js` extension.

### New Integration
Place in `src/integrations/` and follow existing patterns.

### New Documentation
Place in `docs/` with descriptive `.md` filename.

### New Utility Script
Place in `scripts/` for setup/demo scripts, or `tools/` for development tools.

## 🔍 Finding Things

- **Setup Guide**: [docs/QUICKSTART.md](docs/QUICKSTART.md)
- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Jira Integration**: [docs/PLAN_TO_CODE_GUIDE.md](docs/PLAN_TO_CODE_GUIDE.md)
- **Examples**: [docs/EXAMPLES.md](docs/EXAMPLES.md) or `/examples`
- **Test Agents**: [docs/TEST_AGENTS_GUIDE.md](docs/TEST_AGENTS_GUIDE.md)
- **MCP Integration**: [docs/MCP_QUICK_START.md](docs/MCP_QUICK_START.md)

## 🛠️ Maintenance

### Keep It Clean
- Tests in `/src/tests`
- Documentation in `/docs`
- Scripts in `/scripts` or `/tools`
- Core code in `/src/core`
- Integrations in `/src/integrations`

### Don't Commit
- `.env` (secrets)
- `node_modules/` (dependencies)
- `test-results/` (test output)
- `logs/` (runtime logs)

These are in `.gitignore` already.

---

**Last Updated**: Framework reorganization completed
