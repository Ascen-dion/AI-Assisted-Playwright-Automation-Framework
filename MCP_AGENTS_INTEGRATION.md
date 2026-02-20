# MCP Test Agents Integration Guide

## Overview

The Playwright AI Framework now uses **MCP-Enhanced Test Agents** for intelligent test planning, generation, and healing. These agents leverage the Model Context Protocol (MCP) for enhanced AI capabilities.

## Available Agents

### 🎭 **1. Planner Agent**
**Purpose**: Creates comprehensive test plans from user stories and requirements

**Features**:
- Converts user stories into detailed test scenarios
- Generates structured test steps with actions, targets, and expectations
- Creates assertions and validation criteria
- Supports multiple planning detail levels (high-level, detailed, granular)
- MCP-enabled for enhanced context understanding

**Used In Workflow**: Step 2 (Generate Test Cases)

**Example**:
```javascript
const plan = await testAgents.planTest(testDescription, {
  testType: 'e2e',
  priority: 'medium',
  detailLevel: 'detailed'
});
```

---

### 💻 **2. Generator Agent**
**Purpose**: Generates executable Playwright test code from test plans or descriptions

**Features**:
- Creates production-ready Playwright test scripts
- Supports multiple frameworks (standard Playwright, Playwright Test, AI-Page)
- Generates proper imports, describe blocks, and assertions
- Includes error handling and best practices
- MCP-enabled for advanced code generation

**Used In Workflow**: Step 4 (Generate Test Scripts)

**Example**:
```javascript
const testCode = await testAgents.generateTest(testDescription, {
  url: 'https://www.endpointclinical.com',
  framework: 'playwright',
  useAIPage: false,
  includeComments: true
});
```

---

### 🔧 **3. Healer Agent**
**Purpose**: Analyzes test failures and automatically fixes broken tests

**Features**:
- Intelligent error pattern recognition
  - Strict mode violations (multiple elements matched)
  - Navigation timeouts
  - Selector issues
  - CSS assertion failures
  - Text matching problems
- Root cause analysis
- Automated code fixes
- Prevention strategies
- MCP-enabled for context-aware healing

**Used In Workflow**: Step 5 (Execute Tests - Self-Healing on Failure)

**Example**:
```javascript
const healedCode = await testAgents.healTest({
  testCode: failingTestCode,
  error: errorOutput,
  testCases: testCases,
  url: targetUrl
}, {
  autoFix: true,
  returnCode: true
});
```

---

## MCP Integration

### What is MCP?

**Model Context Protocol (MCP)** is a standardized way to provide rich context to AI models, enabling better understanding and more accurate outputs.

### Enabling MCP

Set the environment variable:
```bash
USE_MCP=true
```

When enabled:
- Agents use MCP for enhanced context sharing
- Better understanding of page structure and test requirements
- More accurate test generation and healing
- Supports multiple AI providers through MCP protocol

When disabled:
- Falls back to direct AI engine calls
- Still functional but with less context awareness
- No dependency on MCP server

### MCP Benefits

✅ **Enhanced Context**: AI has better understanding of page structure
✅ **More Accurate**: Generates more reliable selectors and assertions
✅ **Faster Healing**: Better error diagnosis and fixes
✅ **Multi-Provider**: Supports various AI backends (OpenRouter, Anthropic, OpenAI)

---

## Workflow Integration

### Current Workflow with Agents

```
1. Create Jira Story (AI-Powered)
   ↓
2. Generate Test Cases (🎭 Planner Agent)
   ↓
3. Push to TestRail
   ↓
4. Generate Test Scripts (💻 Generator Agent)
   ↓
5. Execute Tests (with 🔧 Healer Agent on failure)
   ↓
6. Update Results in Jira
```

### Agent Usage in API

**Health Check** (`GET /api/health`)
```json
{
  "status": "ok",
  "agents": {
    "mcp": true,
    "planner": true,
    "generator": true,
    "healer": true
  }
}
```

**Generate Tests** (`POST /api/workflow/generate-tests`)
- Uses **Planner Agent** to create test plan
- Converts to TestRail format
- Response includes agent metadata

**Generate Scripts** (`POST /api/workflow/generate-scripts`)
- Uses **Generator Agent** to create Playwright code
- Saves to `src/tests/` directory
- Response indicates which agent was used

**Execute Tests** (`POST /api/workflow/execute-tests`)
- Runs Playwright tests
- On failure: **Healer Agent** analyzes and fixes
- Retries with healed code (max 2 attempts)
- Response includes healing details

---

## Configuration

### Environment Variables

```bash
# Enable MCP for enhanced agent capabilities
USE_MCP=true

# AI Provider (for non-MCP fallback)
AI_PROVIDER=openrouter

# OpenRouter API Key
OPENROUTER_API_KEY=your-api-key

# Jira Configuration
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@domain.com
JIRA_API_TOKEN=your-jira-token
JIRA_PROJECT_KEY=ED

# TestRail Configuration
TESTRAIL_HOST=https://your-domain.testrail.io
TESTRAIL_USERNAME=your-email@domain.com
TESTRAIL_API_KEY=your-testrail-key
TESTRAIL_PROJECT_ID=1
```

---

## Agent Capabilities

### Planner Agent Capabilities

- ✅ Analyze user stories and acceptance criteria
- ✅ Generate comprehensive test scenarios
- ✅ Create detailed test steps
- ✅ Define assertions and expected results
- ✅ Identify test data requirements
- ✅ Determine prerequisites
- ✅ Suggest edge cases
- ✅ Estimate execution time
- ✅ MCP-enhanced context awareness

### Generator Agent Capabilities

- ✅ Generate executable Playwright code
- ✅ Support multiple testing frameworks
- ✅ Create proper test structure (imports, describe blocks)
- ✅ Generate reliable selectors
- ✅ Add assertions and validations
- ✅ Include error handling
- ✅ Add helpful comments
- ✅ Follow best practices
- ✅ MCP-enhanced code generation

### Healer Agent Capabilities

- ✅ Analyze test failure patterns
- ✅ Identify root causes:
  - Strict mode violations
  - Timeout issues
  - Selector problems
  - CSS assertion failures
  - Text matching issues
- ✅ Generate fixes automatically
- ✅ Apply healing strategies:
  - Add `.first()` for multi-match selectors
  - Increase timeouts appropriately
  - Remove brittle CSS assertions
  - Use flexible text matching
  - Improve selector reliability
- ✅ Provide prevention strategies
- ✅ MCP-enhanced error analysis

---

## Best Practices

### Using Planner Agent

1. **Provide detailed requirements**: More context = better test plans
2. **Include acceptance criteria**: Helps generate comprehensive scenarios
3. **Specify priority and type**: Helps agent optimize testing strategy
4. **Review generated plans**: Agents are smart, but human review ensures accuracy

### Using Generator Agent

1. **Start with a good plan**: Better plans = better code
2. **Specify target URL**: Helps generate appropriate navigation
3. **Choose framework wisely**: Use standard Playwright for compatibility
4. **Review generated code**: Always review before committing

### Using Healer Agent

1. **Let it run automatically**: Self-healing is automatic in workflow
2. **Review healing attempts**: Check what was fixed
3. **Learn from patterns**: Repeated issues may indicate design problems
4. **Monitor healing success rate**: Track effectiveness over time

---

## Troubleshooting

### Agent Not Working

**Problem**: Agents not generating expected output

**Solutions**:
1. Check API credentials (OpenRouter, Jira, TestRail)
2. Verify environment variables are set
3. Check logs for error messages
4. Try disabling MCP if issues persist: `USE_MCP=false`

### MCP Connection Issues

**Problem**: MCP not connecting or timing out

**Solutions**:
1. Verify MCP server is running
2. Check MCP configuration
3. Fall back to non-MCP mode: `USE_MCP=false`
4. Agents work without MCP, just with less context

### Healing Not Fixing Tests

**Problem**: Healer Agent not successfully fixing failures

**Solutions**:
1. Check error output is being captured
2. Verify test cases are being passed to healer
3. Review healing logic for specific error type
4. Some issues may require manual intervention
5. Check max retries setting (default: 2)

### Generated Code Issues

**Problem**: Generated code has syntax errors or doesn't run

**Solutions**:
1. Check AI provider is responding correctly
2. Verify prompt instructions are clear
3. Review generated code before execution
4. Report specific issues for prompt improvement
5. Use more detailed test descriptions

---

## API Response Examples

### With Agents Enabled

**Generate Tests Response**:
```json
{
  "success": true,
  "testCases": [...],
  "plan": {...},
  "agentUsed": "planner",
  "mcpEnabled": true,
  "message": "Generated 3 test cases using Planner Agent"
}
```

**Generate Scripts Response**:
```json
{
  "success": true,
  "filename": "ed-2-automated.spec.js",
  "agentUsed": "generator",
  "mcpEnabled": true,
  "message": "Generated test script using Generator Agent"
}
```

**Execute Tests Response (with healing)**:
```json
{
  "success": true,
  "passed": 8,
  "failed": 0,
  "total": 8,
  "healingApplied": true,
  "attempts": 2,
  "agentUsed": "healer",
  "mcpEnabled": true,
  "message": "Tests passed after healing"
}
```

---

## Future Enhancements

- 🔮 **Validator Agent**: Pre-execution validation of generated tests
- 🔮 **Optimizer Agent**: Performance optimization suggestions
- 🔮 **Reporter Agent**: Intelligent test result analysis and reporting
- 🔮 **Data Generator Agent**: Smart test data generation
- 🔮 **Visual Agent**: Visual testing and screenshot comparison

---

## Related Documentation

- [TEST_AGENTS_GUIDE.md](TEST_AGENTS_GUIDE.md) - Detailed agent usage guide
- [MCP_INTEGRATION_GUIDE.md](MCP_INTEGRATION_GUIDE.md) - MCP setup and configuration
- [SELF_HEALING_FEATURE.md](SELF_HEALING_FEATURE.md) - Self-healing system documentation
- [GITHUB_PAGES_DEPLOYMENT.md](GITHUB_PAGES_DEPLOYMENT.md) - Deployment instructions

---

**Note**: Agents are enabled by default in the workflow API. MCP enhancement is optional but recommended for best results. The system works with or without MCP enabled.
