# 🏗️ MCP Architecture

## Model Context Protocol Integration Architecture

This document explains the technical architecture of MCP integration in the Playwright AI Framework.

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Test Files   │  │ Page Objects │  │ Test Helpers │      │
│  │ (*.spec.js)  │  │              │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
└─────────────────────────────────────────┬───────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   TEST AGENTS LAYER                          │
│                  (src/core/test-agents-mcp.js)               │
│                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │ Planner       │  │ Generator     │  │ Healer        │   │
│  │ Agent         │  │ Agent         │  │ Agent         │   │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘   │
│          │                   │                   │           │
│          └───────────────────┴───────────────────┘           │
│                              │                               │
│                    ┌─────────▼─────────┐                    │
│                    │  useMCP?          │                    │
│                    │  (env variable)    │                    │
│                    └────┬──────────┬────┘                    │
│                         │ Yes      │ No                      │
└─────────────────────────┼──────────┼────────────────────────┘
                          │          │
                 ┌────────▼──┐   ┌──▼────────┐
                 │    MCP    │   │   Direct  │
                 │   Path    │   │  AI Path  │
                 └────┬──────┘   └──┬────────┘
                      │             │
                      ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                    MCP PROTOCOL LAYER                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              MCP Client                              │   │
│  │       (src/mcp/playwright-mcp-client.js)            │   │
│  │                                                      │   │
│  │  • connect()          • callTool()                  │   │
│  │  • disconnect()       • listTools()                 │   │
│  │  • ensureConnected()  • analyzePageContext()       │   │
│  └───────────────────┬─────────────────────────────────┘   │
│                      │                                      │
│                      ▼                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              MCP Server                              │   │
│  │       (src/mcp/playwright-mcp-server.js)            │   │
│  │                                                      │   │
│  │  Tools:                                             │   │
│  │  ├─ generate_test_plan                              │   │
│  │  ├─ generate_playwright_code                        │   │
│  │  ├─ analyze_test_failure                            │   │
│  │  └─ analyze_page_context                            │   │
│  │                                                      │   │
│  │  Resources:                                          │   │
│  │  ├─ playwright://page/current                       │   │
│  │  ├─ playwright://browser/context                    │   │
│  │  └─ playwright://test/results                       │   │
│  │                                                      │   │
│  │  Prompts:                                            │   │
│  │  ├─ test-planner                                    │   │
│  │  ├─ code-generator                                  │   │
│  │  └─ failure-analyst                                 │   │
│  └───────────────────┬─────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     AI ENGINE LAYER                          │
│                  (src/core/ai-engine.js)                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Provider Abstraction                       │  │
│  │                                                       │  │
│  │  if (ANTHROPIC_API_KEY)                              │  │
│  │    → Anthropic Client                                │  │
│  │  else                                                 │  │
│  │    → Ollama Client (local)                           │  │
│  └───────────────────┬──────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌──────────────┐              ┌──────────────┐
│   Ollama     │              │  Anthropic   │
│   (Local)    │              │   (Cloud)    │
│              │              │              │
│ llama3.2:3b  │              │ Claude 3.5   │
│ FREE         │              │ Paid API     │
└──────────────┘              └──────────────┘
```

---

## 🔄 Data Flow

### Test Generation Flow

```
User Request
    │
    ▼
Test Agent.generateTest(description)
    │
    ├─ Check: useMCP === true?
    │
    ├─ YES → MCP Path:
    │   │
    │   ├─ mcpClient.connect()
    │   ├─ mcpClient.callTool('generate_playwright_code', args)
    │   ├─ mcpServer.handleGenerateCode()
    │   ├─ aiEngine.query(prompt)
    │   ├─ LLM generates code
    │   └─ Return formatted code
    │
    └─ NO → Direct Path:
        │
        ├─ aiEngine.query(prompt)
        ├─ LLM generates code
        └─ Return code

Result: Generated test code
```

### Page Context Analysis Flow (MCP-Only)

```
User Request
    │
    ▼
Test Agent.analyzePageContext(page, question)
    │
    ├─ Check: MCP enabled?
    │   └─ NO → Error: "MCP required"
    │
    ├─ Gather page context:
    │   ├─ page.url()
    │   ├─ page.content() → HTML
    │   ├─ page.screenshot() → Image
    │   └─ page.viewportSize() → Dimensions
    │
    ├─ mcpClient.callTool('analyze_page_context', {
    │     url, html, screenshot, viewport, question
    │   })
    │
    ├─ mcpServer.handleAnalyzePageContext()
    │   └─ Sends full context to LLM
    │
    ├─ LLM analyzes page structure
    │
    └─ Return insights

Result: AI-powered page analysis
```

---

## 🧩 Component Responsibilities

### Test Agents (test-agents-mcp.js)

**Role:** High-level AI operations interface

**Responsibilities:**
- Decide between MCP path vs direct path
- Provide backward compatibility
- Implement retry logic
- Save results to files
- Batch operations (plan + generate)

**Key Methods:**
```javascript
planTest(description, options)
generateTest(description, options)
healTest(context, options)
analyzePageContext(page, question)  // MCP-only
getMCPInfo()
listMCPTools()
```

---

### MCP Client (playwright-mcp-client.js)

**Role:** MCP protocol client implementation

**Responsibilities:**
- Establish connection to MCP server
- Send tool calls to server
- Handle responses
- Provide simplified API
- Extract text from MCP responses

**Key Methods:**
```javascript
connect()
disconnect()
callTool(name, args)
listTools()
generateTestPlan(requirements, options)
generateCode(description, options)
analyzeFailure(error, context)
analyzePageContext(page, question)
```

---

### MCP Server (playwright-mcp-server.js)

**Role:** MCP protocol server implementation

**Responsibilities:**
- Define MCP tools, resources, prompts
- Handle tool calls
- Communicate with AI Engine
- Format responses per MCP spec

**MCP Tools:**
1. `generate_test_plan` - Test planning
2. `generate_playwright_code` - Code generation
3. `analyze_test_failure` - Failure analysis
4. `analyze_page_context` - Page analysis

**MCP Resources:**
- `playwright://page/current` - Current page state
- `playwright://browser/context` - Browser context
- `playwright://test/results` - Test results

**MCP Prompts:**
- `test-planner` - Test planning persona
- `code-generator` - Code generation persona
- `failure-analyst` - Failure analysis persona

---

### AI Engine (ai-engine.js)

**Role:** Abstract AI provider communication

**Responsibilities:**
- Select appropriate AI provider
- Send prompts to LLM
- Handle API keys and authentication
- Provider-specific formatting
- Error handling and retries

**Supported Providers:**
- Ollama (local, FREE)
- Anthropic Claude (cloud, paid)
- OpenAI GPT (cloud, paid) - future

---

## 🔀 Decision Tree

```
Test Agents Method Called
    │
    ▼
Check: USE_MCP === 'true'?
    │
    ├─ NO ────────────────────────────────┐
    │                                     │
    ├─ YES                                │
    │   │                                 │
    │   ▼                                 │
    │ MCP Available?                      │
    │   │                                 │
    │   ├─ NO ─────────────────────────┐  │
    │   │                              │  │
    │   ├─ YES                         │  │
    │   │   │                          │  │
    │   │   ▼                          │  │
    │   │ MCP Path                     │  │
    │   │   │                          │  │
    │   │   ├─ Connect to MCP server   │  │
    │   │   ├─ Call MCP tool           │  │
    │   │   ├─ Server calls AI Engine  │  │
    │   │   └─ Return result           │  │
    │   │                              │  │
    │   └──────────────────────────────┘  │
    │                                     │
    └─────────────────────────────────────┘
                    │
                    ▼
              Direct AI Path
                    │
                    ├─ Build prompt
                    ├─ Call AI Engine
                    └─ Return result
```

---

## 📊 Sequence Diagrams

### MCP Test Generation Sequence

```
User Test    Test Agents    MCP Client    MCP Server    AI Engine    LLM
     │             │              │            │             │          │
     ├─generateTest→              │            │             │          │
     │             │              │            │             │          │
     │             ├─isMCPAvailable()          │             │          │
     │             ├─────────────────────→     │             │          │
     │             │◄─────────────────────     │             │          │
     │             │  true                     │             │          │
     │             │                           │             │          │
     │             ├─generateCode()            │             │          │
     │             ├─────────────────────→     │             │          │
     │             │                           │             │          │
     │             │              ├─callTool('generate_playwright_code')
     │             │              ├──────────→ │             │          │
     │             │              │            │             │          │
     │             │              │            ├─handleGenerateCode()   │
     │             │              │            ├─────────────→          │
     │             │              │            │             │          │
     │             │              │            │             ├─query()  │
     │             │              │            │             ├─────────→│
     │             │              │            │             │          │
     │             │              │            │             │    Generate
     │             │              │            │             │    code...
     │             │              │            │             │          │
     │             │              │            │             │◄─────────│
     │             │              │            │             code       │
     │             │              │            │◄────────────┤          │
     │             │              │            code           │          │
     │             │              │◄──────────┤             │          │
     │             │◄────────────────────────┤             │          │
     │             code                       │             │          │
     │◄────────────┤                          │             │          │
     code          │                          │             │          │
```

---

## 🎯 Design Patterns

### 1. Strategy Pattern (MCP vs Direct)

```javascript
class TestAgentsMCP {
  async generateTest(description) {
    if (await this.isMCPAvailable()) {
      // Strategy 1: MCP path
      return await this.mcpClient.generateCode(description);
    } else {
      // Strategy 2: Direct path
      return await this.aiEngine.query(prompt);
    }
  }
}
```

### 2. Singleton Pattern (Shared Instances)

```javascript
// test-agents-mcp.js
module.exports = new TestAgentsMCP();

// playwright-mcp-client.js
module.exports = new PlaywrightMCPClient();

// playwright-mcp-server.js
module.exports = new PlaywrightMCPServer();
```

### 3. Adapter Pattern (AI Engine)

```javascript
class AIEngine {
  async query(prompt) {
    if (this.anthropicClient) {
      // Adapt to Anthropic API
      return await this.callAnthropic(prompt);
    } else {
      // Adapt to Ollama API
      return await this.callOllama(prompt);
    }
  }
}
```

### 4. Facade Pattern (Test Agents)

```javascript
// Simple facade hiding complexity
const testAgents = require('./src/core/test-agents-mcp');

// User doesn't need to know about MCP, tools, prompts, etc.
const code = await testAgents.generateTest('Login test');
```

---

## 🔐 Security Considerations

### API Key Management

```javascript
// ✅ Good: From environment
const apiKey = process.env.ANTHROPIC_API_KEY;

// ❌ Bad: Hardcoded
const apiKey = 'sk-ant-...';  // NEVER DO THIS
```

### Input Validation

```javascript
async handleGenerateCode(args) {
  // Validate inputs
  if (!args.testDescription) {
    throw new Error('testDescription is required');
  }
  
  if (args.testDescription.length > 10000) {
    throw new Error('testDescription too long');
  }
  
  // Proceed with validated input
}
```

### Screenshot Handling

```javascript
// Screenshots are base64 encoded
const screenshot = await page.screenshot({ encoding: 'base64' });

// Never log full screenshots (too large, sensitive)
logger.info('Screenshot captured:', screenshot.substring(0, 50) + '...');
```

---

## 🚀 Performance Optimization

### Tool List Caching

```javascript
class PlaywrightMCPClient {
  constructor() {
    this.toolCache = null;  // Cache available tools
  }
  
  async listTools() {
    if (this.toolCache) {
      return { tools: this.toolCache };  // Use cache
    }
    return await this.server.listTools();  // Fetch fresh
  }
}
```

### Connection Reuse

```javascript
async ensureConnected() {
  if (!this.isConnected) {
    await this.connect();  // Connect once
  }
  // Reuse connection for subsequent calls
}
```

### Lazy Loading

```javascript
// AI Engine only initialized when needed
class TestAgentsMCP {
  constructor() {
    this.aiEngine = new AIEngine();  // Lazy loads provider
  }
}
```

---

## 📈 Scalability

### Horizontal Scaling

**Multiple Test Runners:**
```bash
# Run tests in parallel
npx playwright test --workers=4
```

Each worker has its own MCP client instance.

### Vertical Scaling

**Resource Management:**
- MCP server is embedded (no network overhead)
- AI Engine supports connection pooling
- Minimal memory footprint

---

## 🧪 Testing Strategy

### Unit Tests
- Test each component independently
- Mock MCP client in test agents
- Mock AI engine in MCP server

### Integration Tests
- Test MCP client ↔ MCP server communication
- Test test agents ↔ MCP client integration
- Test AI engine ↔ LLM provider

### End-to-End Tests
- `mcp-demo.spec.js` - Full MCP workflow
- Test all 4 MCP tools
- Test with/without MCP enabled

---

## 🔄 Future Enhancements

### 1. External MCP Server Support
```javascript
// Connect to remote MCP server
const transport = new HttpClientTransport({
  url: 'https://mcp-server.example.com'
});
```

### 2. More MCP Tools
```javascript
{
  name: 'optimize_selectors',
  description: 'Optimize existing selectors for reliability'
}
```

### 3. MCP Resources Implementation
```javascript
// Real-time page state sharing
await mcpClient.readResource('playwright://page/current');
```

### 4. Streaming Responses
```javascript
// Stream code generation in real-time
for await (const chunk of mcpClient.callToolStream(...)) {
  console.log(chunk);
}
```

---

## 📚 References

- **MCP Specification:** https://modelcontextprotocol.io/
- **MCP SDK:** https://github.com/modelcontextprotocol/typescript-sdk
- **Playwright Docs:** https://playwright.dev/
- **Our Framework:** [README.md](README.md)

---

**Questions?** See [MCP_INTEGRATION_GUIDE.md](MCP_INTEGRATION_GUIDE.md)
