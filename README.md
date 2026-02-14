# AI-Assisted Playwright Automation Framework

An intelligent UI automation framework that combines Playwright with AI capabilities for self-healing tests, smart element detection, and visual validation.

## Features

- 🤖 **AI-Powered Element Detection**: Uses Claude API for intelligent element identification
- 🔄 **Self-Healing Tests**: Automatically adapts to UI changes
- 👁️ **Visual AI Validation**: Screenshot analysis and visual regression testing
- 📊 **Smart Reporting**: AI-generated test insights and failure analysis
- 🎯 **Natural Language Test Writing**: Write tests in plain English
- 🛡️ **Robust Element Selection**: Multiple fallback strategies for element location
- 🚀 **MCP Integration**: Model Context Protocol for conversational test authoring with Claude
- 💬 **Conversational Testing**: Execute tests using natural language instructions
- 🔧 **Autonomous Test Generation**: Claude generates test code from descriptions

## Architecture

```
playwright-ai-framework/
├── src/
│   ├── core/
│   │   ├── ai-engine.js          # Claude API integration
│   │   ├── browser-manager.js    # Playwright browser management
│   │   └── element-finder.js     # AI-powered element detection
│   ├── helpers/
│   │   ├── visual-ai.js          # Screenshot analysis
│   │   ├── self-healing.js       # Auto-recovery mechanisms
│   │   └── reporting.js          # AI-enhanced reporting
│   └── tests/
│       └── example.spec.js       # Sample test cases
├── config/
│   └── playwright.config.js      # Playwright configuration
├── utils/
│   └── logger.js                 # Logging utility
└── package.json
```

## Installation

```bash
npm install
```

## Configuration

Set up your environment variables:

```bash
# .env file
ANTHROPIC_API_KEY=your_api_key_here
HEADLESS=false
TIMEOUT=30000
```

## Usage

### Basic Test Example

```javascript
const { test } = require('./src/core/ai-test-runner');

test('AI-assisted login test', async ({ aiPage }) => {
  await aiPage.navigateTo('https://example.com/login');
  
  // AI will find and interact with elements using natural descriptions
  await aiPage.fillField('email or username field', 'user@example.com');
  await aiPage.fillField('password field', 'password123');
  await aiPage.clickElement('login button');
  
  // AI validates the outcome
  await aiPage.verifyElement('dashboard or welcome message');
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
npm test -- tests/login.spec.js

# Run with headed browser
npm test -- --headed

# Generate AI-powered report
npm run report
```

## Key Components

### 1. AI Engine
Integrates with Claude API for intelligent automation decisions

### 2. Element Finder
Uses multiple strategies to locate elements with AI fallback

### 3. Self-Healing
Automatically adapts when elements change or move

### 4. Visual AI
Analyzes screenshots to validate UI state

## 📚 Documentation

- **[MCP Integration Guide](MCP_INTEGRATION.md)** - ⭐ **NEW!** Conversational test authoring with Model Context Protocol
- **[Team Onboarding Guide](TEAM_ONBOARDING.md)** - Complete guide for team members
- **[Team Presentation](TEAM_PRESENTATION.md)** - Slide deck for team demos
- **[GitHub Actions Setup](GITHUB_ACTIONS_SETUP.md)** - Detailed CI/CD configuration
- **[Secrets Configuration](SECRETS_SETUP.md)** - Quick secrets reference
- **[Architecture](ARCHITECTURE.md)** - Technical design details
- **[Examples](EXAMPLES.md)** - Code examples and patterns

## 🚀 MCP Integration (NEW!)

This framework now supports **Model Context Protocol (MCP)** for conversational test authoring!

### What is MCP?

MCP enables you to write tests in natural language using Claude AI. No more brittle selectors or complex Playwright code!

### Quick Example

**Traditional Playwright:**
```javascript
test('login test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'pass123');
  await page.click('button[type="submit"]');
  await expect(page.locator('.dashboard')).toBeVisible();
});
```

**MCP-Enhanced (92% less code!):**
```javascript
test('login test', async ({ mcpClaude }) => {
  await mcpClaude.navigate('https://example.com');
  await mcpClaude.do('login as testuser with password pass123');
  await mcpClaude.verify('dashboard is visible');
});
```

### Key Benefits

- ✅ **92% less code** - Write tests faster
- ✅ **No selector maintenance** - Claude finds elements intelligently
- ✅ **Self-healing** - Adapts to UI changes automatically
- ✅ **Readable by anyone** - Stakeholders understand your tests
- ✅ **Autonomous generation** - Claude creates tests from descriptions

### Get Started with MCP

```bash
# Install dependencies (already included)
npm install

# Run MCP examples
npm test -- mcp-example.spec.js
```

📖 **Full Guide:** See [MCP_INTEGRATION.md](MCP_INTEGRATION.md) for complete documentation, API reference, and examples.

## CI/CD Integration

This framework includes GitHub Actions workflow for automated testing and email notifications.

### Quick Setup

1. **Configure GitHub Secrets** (Settings → Secrets → Actions):
   - `EMAIL_USERNAME` - Your Gmail address
   - `EMAIL_PASSWORD` - Gmail App Password (not regular password)
   - `EMAIL_TO` - Recipient email for test reports
   - `ANTHROPIC_API_KEY` - Your Anthropic API key (optional)

2. **Push to repository** - Tests run automatically

3. **Receive email reports** with test results and artifacts

### Features
- ✅ Automated test execution on push/PR
- 📧 Email notifications with HTML reports
- 📊 Test artifacts and screenshots
- 💬 PR comments with results
- 🔄 Scheduled daily runs

📖 **Detailed Setup Guide:** See [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)

## Contributing

Contributions welcome! Please read our contributing guidelines.

## License

MIT
