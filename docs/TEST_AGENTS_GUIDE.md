# 🎭 Playwright Test Agents - Complete Guide

AI-powered test planning, generation, and healing for your Playwright tests using local LLM (FREE!) or Anthropic Claude.

## 🌟 What are Test Agents?

Playwright Test Agents are AI-powered assistants that help you:

- **🎭 Planner Agent**: Create detailed test plans from high-level descriptions
- **🎭 Generator Agent**: Generate executable test code automatically
- **🎭 Healer Agent**: Analyze failures and suggest/apply fixes

All three agents work with your **local LLM (Ollama)** - completely free!

---

## 🚀 Quick Start

### Installation

Test agents are already included in your framework! Just make sure you have:

```bash
# 1. Local LLM running (FREE)
ollama serve

# 2. Model downloaded
ollama pull llama3.2:3b

# 3. Environment configured
# .env file:
AI_PROVIDER=local
LOCAL_LLM_URL=http://localhost:11434/v1
LOCAL_LLM_MODEL=llama3.2:3b
```

### Basic Usage

```javascript
const { test } = require('./core/ai-test-runner');
const testAgents = require('./core/test-agents');

test('Use test agents', async ({ aiPage, page }) => {
  // 1. Plan a test
  const plan = await testAgents.planTest('Login to saucedemo');
  
  // 2. Execute the plan
  const results = await testAgents.executePlan(plan, page, aiPage);
  
  // 3. If failed, heal it
  if (results.failed > 0) {
    await testAgents.healTest(failureContext, { autoApply: true });
  }
});
```

---

## 📋 Planner Agent

The Planner Agent creates detailed test plans from natural language descriptions.

### Basic Planning

```javascript
const plan = await testAgents.planTest('Login with valid credentials');

console.log(plan);
// {
//   "testName": "Login with valid credentials",
//   "description": "Validates user login functionality",
//   "steps": [
//     {
//       "action": "navigate",
//       "target": "https://example.com/login",
//       "description": "Open login page"
//     },
//     {
//       "action": "fill",
//       "target": "username field",
//       "value": "standard_user",
//       "description": "Enter username"
//     },
//     ...
//   ],
//   "assertions": [...],
//   "estimatedTime": "10-15 seconds"
// }
```

### Advanced Planning Options

```javascript
const plan = await testAgents.planTest(
  'Complete e-commerce checkout flow',
  {
    includeSetup: true,        // Add setup steps
    includeTeardown: true,     // Add cleanup steps
    detailLevel: 'granular'    // 'high-level' | 'detailed' | 'granular'
  }
);
```

### Detail Levels

| Level | Description | Use Case |
|-------|-------------|----------|
| `high-level` | 3-5 main steps | Quick overview, manual execution |
| `detailed` | 10-20 specific steps | Standard automation |
| `granular` | Every micro-interaction | Complex flows, debugging |

### Execute a Plan

```javascript
test('Execute AI-generated plan', async ({ aiPage, page }) => {
  const plan = await testAgents.planTest('Add product to cart');
  
  const results = await testAgents.executePlan(plan, page, aiPage);
  
  console.log(results);
  // {
  //   "testName": "Add product to cart",
  //   "passed": 5,
  //   "failed": 0,
  //   "duration": 3421,
  //   "success": true,
  //   "steps": [...]
  // }
});
```

---

## 💻 Generator Agent

The Generator Agent creates executable Playwright test code.

### Generate from Description

```javascript
const generated = await testAgents.generateTest(
  'Test user registration with email validation',
  {
    useAIPage: true,           // Use AI-powered methods
    includeComments: true,     // Add helpful comments
    language: 'javascript',    // 'javascript' | 'typescript'
    filename: 'registration.spec.js',
    saveToFile: true           // Save to test-results/agents/generated/
  }
);

console.log(generated.code);
// Full executable test code
```

### Generate from Plan

```javascript
// First create a detailed plan
const plan = await testAgents.planTest('Login flow with error handling');

// Then generate code from the plan
const generated = await testAgents.generateTest(plan, {
  useAIPage: true,
  framework: 'playwright-test'
});

console.log(generated);
// {
//   "code": "const { test, expect } = require(...)",
//   "filename": "login-flow.spec.js",
//   "dependencies": ["@playwright/test", ...],
//   "setup": "Instructions for running the test",
//   "description": "Test validates login with error scenarios"
// }
```

### AI vs Standard Generation

```javascript
// AI-powered (uses aiPage methods)
const aiTest = await testAgents.generateTest(plan, {
  useAIPage: true
});
// Generated code:
// await aiPage.clickElement('login button');
// await aiPage.fillField('username', 'user@test.com');

// Standard Playwright
const standardTest = await testAgents.generateTest(plan, {
  useAIPage: false
});
// Generated code:
// await page.click('#login-btn');
// await page.fill('#username', 'user@test.com');
```

### Save Generated Tests

```javascript
const generated = await testAgents.generateTest('My test', {
  saveToFile: true,
  filename: 'my-test.spec.js'
});

// Saved to: test-results/agents/generated/my-test.spec.js
// Metadata: test-results/agents/generated/my-test.spec.js.meta.json
```

---

## 🏥 Healer Agent

The Healer Agent analyzes test failures and suggests/applies fixes automatically.

### Basic Healing

```javascript
const failureContext = {
  testName: 'Login Test',
  errorMessage: 'Element not found: #username',
  stackTrace: error.stack,
  failedStep: 'Fill username field',
  pageHTML: await page.content(),
  lastKnownGoodSelector: '#username',
  elementDescription: 'username input field'
};

const healing = await testAgents.healTest(failureContext);

console.log(healing);
// {
//   "rootCause": "Element ID changed from #username to #user-name",
//   "confidence": "high",
//   "fixes": [
//     {
//       "type": "selector",
//       "description": "Update selector to use new ID",
//       "code": "await page.fill('#user-name', 'value')",
//       "confidence": 0.95,
//       "risk": "low",
//       "reasoning": "New selector matches the current DOM structure"
//     }
//   ],
//   "alternativeSelectors": ["#user-name", "[name='username']"],
//   "recommendations": [...]
// }
```

### Healing Levels

```javascript
// Conservative - Only safe, low-risk fixes
const conservative = await testAgents.healTest(failureContext, {
  healingLevel: 'conservative'
});

// Moderate - Common fixes and alternatives
const moderate = await testAgents.healTest(failureContext, {
  healingLevel: 'moderate'
});

// Aggressive - Multiple alternatives and workarounds
const aggressive = await testAgents.healTest(failureContext, {
  healingLevel: 'aggressive'
});
```

### Auto-Apply Healing

```javascript
const healing = await testAgents.healTest(failureContext, {
  autoApply: true,      // Automatically apply fix if confidence > 70%
  healingLevel: 'moderate',
  maxAttempts: 3
});

if (healing.applied) {
  console.log('✅ Fix applied:', healing.appliedFix.description);
}
```

### Healing in Test Execution

```javascript
test('Self-healing test', async ({ aiPage, page }) => {
  try {
    await aiPage.clickElement('submit button');
  } catch (error) {
    // Auto-heal the failure
    const healing = await testAgents.healTest({
      testName: 'Click Submit',
      errorMessage: error.message,
      pageHTML: await page.content(),
      elementDescription: 'submit button'
    }, { autoApply: true });
    
    if (healing.applied) {
      // Retry with healed selector
      console.log('🔄 Retrying with healed selector...');
    }
  }
});
```

---

## 🔄 Complete Workflow Example

Combine all three agents for a fully AI-powered test workflow:

```javascript
test('Complete AI workflow', async ({ aiPage, page }) => {
  // 📋 Step 1: Plan
  console.log('📋 Planning test...');
  const plan = await testAgents.planTest(
    'Login, add product to cart, and checkout',
    { detailLevel: 'detailed' }
  );
  console.log(`✅ Plan created: ${plan.steps.length} steps`);

  // 💻 Step 2: Generate
  console.log('💻 Generating code...');
  const generated = await testAgents.generateTest(plan, {
    useAIPage: true,
    saveToFile: true,
    filename: 'ai-generated-checkout.spec.js'
  });
  console.log(`✅ Code generated: ${generated.code.split('\n').length} lines`);

  // 🎬 Step 3: Execute
  console.log('🎬 Executing plan...');
  const results = await testAgents.executePlan(plan, page, aiPage);
  console.log(`✅ Execution: ${results.passed} passed, ${results.failed} failed`);

  // 🏥 Step 4: Heal (if needed)
  if (results.failed > 0) {
    console.log('🏥 Healing failures...');
    const failedStep = results.steps.find(s => s.status === 'failed');
    
    const healing = await testAgents.healTest({
      testName: plan.testName,
      errorMessage: failedStep.error,
      pageHTML: await page.content(),
      failedStep: failedStep
    }, { autoApply: true });
    
    console.log(`✅ Healing: ${healing.fixes.length} fixes suggested`);
  }

  // ✅ Verify workflow
  expect(results.passed).toBeGreaterThan(0);
});
```

---

## 📊 Agent Statistics & Management

### View Statistics

```javascript
const stats = testAgents.getStatistics();

console.log(stats);
// {
//   "planner": {
//     "totalPlans": 15,
//     "recentPlans": [...]
//   },
//   "generator": {
//     "totalGenerated": 10,
//     "recentGenerations": [...]
//   },
//   "healer": {
//     "totalHealings": 5,
//     "autoApplied": 3,
//     "recentHealings": [...]
//   }
// }
```

### Clear History

```javascript
// Clear all agents
testAgents.clearHistory('all');

// Clear specific agent
testAgents.clearHistory('planner');
testAgents.clearHistory('generator');
testAgents.clearHistory('healer');
```

---

## 📁 Saved Files & Reports

Test agents automatically save their outputs:

```
test-results/agents/
├── plans/
│   └── plan-1234567890.json          # Generated test plans
├── generated/
│   ├── my-test.spec.js                # Generated test code
│   └── my-test.spec.js.meta.json      # Generation metadata
└── healing/
    └── healing-1234567890.json        # Healing reports
```

### Access Saved Plans

```javascript
const fs = require('fs');
const path = require('path');

// Read latest plan
const plansDir = path.join(process.cwd(), 'test-results/agents/plans');
const files = fs.readdirSync(plansDir);
const latestPlan = JSON.parse(
  fs.readFileSync(path.join(plansDir, files[files.length - 1]))
);
```

---

## 🎯 Real-World Use Cases

### 1. Rapid Test Creation

```javascript
// Create 10 tests in minutes
const scenarios = [
  'Login with valid credentials',
  'Login with invalid password',
  'Reset password flow',
  'Register new user',
  'Add item to cart',
  'Remove item from cart',
  'Apply discount code',
  'Complete checkout',
  'View order history',
  'Update profile settings'
];

for (const scenario of scenarios) {
  const generated = await testAgents.generateTest(scenario, {
    useAIPage: true,
    saveToFile: true,
    filename: `${scenario.toLowerCase().replace(/\s+/g, '-')}.spec.js`
  });
  console.log(`✅ Generated: ${generated.filename}`);
}
```

### 2. Self-Healing Test Suite

```javascript
test.afterEach(async ({ aiPage, page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    // Auto-heal failed tests
    const healing = await testAgents.healTest({
      testName: testInfo.title,
      errorMessage: testInfo.error?.message,
      stackTrace: testInfo.error?.stack,
      pageHTML: await page.content()
    }, { 
      autoApply: true,
      healingLevel: 'moderate'
    });
    
    // Save healing report
    console.log(`🏥 Healing report saved for: ${testInfo.title}`);
  }
});
```

### 3. Dynamic Test Generation from Requirements

```javascript
// Read requirements from file/API
const requirements = [
  'User can login with email and password',
  'Invalid login shows error message',
  'User can reset forgotten password'
];

for (const req of requirements) {
  // Plan the test
  const plan = await testAgents.planTest(req);
  
  // Generate executable code
  const generated = await testAgents.generateTest(plan, {
    saveToFile: true
  });
  
  console.log(`✅ Test created for: ${req}`);
}
```

---

## ⚙️ Configuration

### Environment Variables

```env
# AI Provider (use 'local' for free local LLM)
AI_PROVIDER=local

# Local LLM Settings (FREE!)
LOCAL_LLM_URL=http://localhost:11434/v1
LOCAL_LLM_MODEL=llama3.2:3b

# Or use Anthropic Claude (requires credits)
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Custom Options

```javascript
// Customize test agent behavior
const plan = await testAgents.planTest('My test', {
  includeSetup: true,
  includeTeardown: true,
  detailLevel: 'detailed'
});

const generated = await testAgents.generateTest(plan, {
  framework: 'playwright-test',
  language: 'javascript',
  useAIPage: true,
  includeComments: true,
  saveToFile: true
});

const healing = await testAgents.healTest(context, {
  autoApply: true,
  healingLevel: 'moderate',
  maxAttempts: 3
});
```

---

## 🧪 Running Test Agent Examples

```bash
# Run all test agent examples
npx playwright test test-agents.spec.js --headed

# Run specific agent examples
npx playwright test test-agents.spec.js -g "Planner"
npx playwright test test-agents.spec.js -g "Generator"
npx playwright test test-agents.spec.js -g "Healer"

# Run complete workflow
npx playwright test test-agents.spec.js -g "Complete AI Test Workflow"
```

---

## 💡 Best Practices

### 1. Plan First, Execute Later
```javascript
// ✅ Good: Plan, review, then execute
const plan = await testAgents.planTest('Complex flow');
console.log('Review plan:', plan); // Inspect before execution
const results = await testAgents.executePlan(plan, page, aiPage);
```

### 2. Use Appropriate Healing Levels
```javascript
// Conservative for production, aggressive for debugging
const healing = await testAgents.healTest(context, {
  healingLevel: process.env.CI ? 'conservative' : 'aggressive'
});
```

### 3. Save Generated Tests
```javascript
// Always save for review and version control
const generated = await testAgents.generateTest(plan, {
  saveToFile: true,
  filename: 'descriptive-name.spec.js'
});
```

### 4. Monitor Agent Statistics
```javascript
test.afterAll(() => {
  const stats = testAgents.getStatistics();
  console.log('Session Stats:', stats);
});
```

---

## 🔍 Troubleshooting

### Issue: Plans are too generic

```javascript
// Solution: Increase detail level
const plan = await testAgents.planTest('My test', {
  detailLevel: 'granular'  // More specific steps
});
```

### Issue: Generated code doesn't work

```javascript
// Solution: Review and refine the plan first
const plan = await testAgents.planTest('Test description');
console.log('Review:', plan);
// Adjust description if needed, then generate
```

### Issue: Healing not working

```javascript
// Solution: Provide more context
const healing = await testAgents.healTest({
  ...failureContext,
  pageHTML: await page.content(),  // Include full HTML
  screenshot: await page.screenshot(), // Include screenshot
  lastKnownGoodSelector: '#old-selector'
});
```

### Issue: Local LLM responses are slow

```javascript
// Solution: Use smaller model or switch to Anthropic
// .env
LOCAL_LLM_MODEL=llama3.2:1b  # Faster, less accurate
# or
AI_PROVIDER=anthropic  # Faster, requires credits
```

---

## 📚 API Reference

### testAgents.planTest(description, options)

Creates a test plan from description.

**Parameters:**
- `description` (string): Natural language test description
- `options` (object):
  - `includeSetup` (boolean): Include setup steps
  - `includeTeardown` (boolean): Include cleanup steps
  - `detailLevel` (string): 'high-level' | 'detailed' | 'granular'

**Returns:** Promise<Object> - Test plan

---

### testAgents.generateTest(planOrDescription, options)

Generates executable test code.

**Parameters:**
- `planOrDescription` (Object|string): Test plan or description
- `options` (object):
  - `framework` (string): 'playwright' | 'playwright-test'
  - `language` (string): 'javascript' | 'typescript'
  - `useAIPage` (boolean): Use AI methods
  - `includeComments` (boolean): Add comments
  - `saveToFile` (boolean): Save to file
  - `filename` (string): Output filename

**Returns:** Promise<Object> - Generated test with code

---

### testAgents.healTest(failureContext, options)

Analyzes failures and suggests fixes.

**Parameters:**
- `failureContext` (object):
  - `testName` (string): Test name
  - `errorMessage` (string): Error message
  - `stackTrace` (string): Stack trace
  - `pageHTML` (string): Page HTML
  - `lastKnownGoodSelector` (string): Previous selector
  - `elementDescription` (string): Element description
- `options` (object):
  - `autoApply` (boolean): Auto-apply fixes
  - `healingLevel` (string): 'conservative' | 'moderate' | 'aggressive'
  - `maxAttempts` (number): Max healing attempts

**Returns:** Promise<Object> - Healing analysis with fixes

---

### testAgents.executePlan(plan, page, aiPage)

Executes a test plan.

**Parameters:**
- `plan` (Object): Test plan from planner
- `page` (Page): Playwright page object
- `aiPage` (AIPage): AI-enhanced page object

**Returns:** Promise<Object> - Execution results

---

## 🎉 Summary

Playwright Test Agents provide:

✅ **Automated Test Planning** - Describe what to test, get a detailed plan
✅ **Code Generation** - Turn plans into executable tests instantly  
✅ **Self-Healing** - Automatically fix broken tests
✅ **FREE Local LLM** - Works with Ollama (no API costs!)
✅ **Production-Ready** - Save, version control, and deploy generated tests

Start using Test Agents today and **boost your test automation productivity by 10x**! 🚀

---

**Need Help?**

- Check logs: `logs/combined.log`
- View saved files: `test-results/agents/`
- Run examples: `npx playwright test test-agents.spec.js --headed`
- Enable debug: `LOG_LEVEL=debug`

Happy Testing! 🎭✨
