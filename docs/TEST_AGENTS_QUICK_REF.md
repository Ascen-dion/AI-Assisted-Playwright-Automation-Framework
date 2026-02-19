# 🎭 Test Agents Quick Reference

Quick guide to using Playwright Test Agents (Planner, Generator, Healer)

## Setup (One-time)

```bash
# 1. Ensure Ollama is running
ollama serve

# 2. Have model downloaded
ollama pull llama3.2:3b

# 3. Configure .env
AI_PROVIDER=local
LOCAL_LLM_URL=http://localhost:11434/v1
LOCAL_LLM_MODEL=llama3.2:3b
```

## Import

```javascript
const { test } = require('./core/ai-test-runner');
const testAgents = require('./core/test-agents');
```

---

## 📋 Planner Agent - Create Test Plans

### Basic Usage
```javascript
const plan = await testAgents.planTest('Login to saucedemo');
```

### With Options
```javascript
const plan = await testAgents.planTest(
  'Complete checkout flow',
  {
    includeSetup: true,
    includeTeardown: true,
    detailLevel: 'detailed'  // 'high-level' | 'detailed' | 'granular'
  }
);
```

### Execute Plan
```javascript
const results = await testAgents.executePlan(plan, page, aiPage);
console.log(`Passed: ${results.passed}, Failed: ${results.failed}`);
```

---

## 💻 Generator Agent - Generate Test Code

### From Description
```javascript
const generated = await testAgents.generateTest(
  'Test user login with valid credentials',
  {
    useAIPage: true,
    saveToFile: true,
    filename: 'login-test.spec.js'
  }
);
console.log(generated.code);
```

### From Plan
```javascript
const plan = await testAgents.planTest('Add to cart');
const generated = await testAgents.generateTest(plan, {
  useAIPage: true,
  includeComments: true
});
```

---

## 🏥 Healer Agent - Fix Broken Tests

### Basic Healing
```javascript
const healing = await testAgents.healTest({
  testName: 'Login Test',
  errorMessage: 'Element not found',
  pageHTML: await page.content(),
  elementDescription: 'login button'
});

console.log(healing.fixes);
```

### Auto-Heal
```javascript
const healing = await testAgents.healTest(failureContext, {
  autoApply: true,           // Auto-apply if confidence > 70%
  healingLevel: 'moderate',  // 'conservative' | 'moderate' | 'aggressive'
  maxAttempts: 3
});

if (healing.applied) {
  console.log('✅ Fix applied:', healing.appliedFix);
}
```

---

## 🔄 Complete Workflow

```javascript
test('AI workflow', async ({ aiPage, page }) => {
  // 1. Plan
  const plan = await testAgents.planTest('Login and add item to cart');
  
  // 2. Generate code
  const generated = await testAgents.generateTest(plan, {
    saveToFile: true,
    filename: 'ai-test.spec.js'
  });
  
  // 3. Execute
  const results = await testAgents.executePlan(plan, page, aiPage);
  
  // 4. Heal if needed
  if (results.failed > 0) {
    const failedStep = results.steps.find(s => s.status === 'failed');
    await testAgents.healTest({
      testName: plan.testName,
      errorMessage: failedStep.error,
      failedStep: failedStep
    }, { autoApply: true });
  }
});
```

---

## 📊 Statistics & Management

```javascript
// Get stats
const stats = testAgents.getStatistics();
console.log(stats);

// Clear history
testAgents.clearHistory('all');  // or 'planner', 'generator', 'healer'
```

---

## 📁 Saved Files

```
test-results/agents/
├── plans/plan-*.json
├── generated/*.spec.js
└── healing/healing-*.json
```

---

## 🎯 Common Patterns

### Pattern 1: Rapid Test Creation
```javascript
const scenarios = ['Login', 'Logout', 'Add to cart'];
for (const scenario of scenarios) {
  await testAgents.generateTest(scenario, {
    saveToFile: true,
    filename: `${scenario.toLowerCase()}.spec.js`
  });
}
```

### Pattern 2: Self-Healing Assistant
```javascript
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    await testAgents.healTest({
      testName: testInfo.title,
      errorMessage: testInfo.error?.message,
      pageHTML: await page.content()
    }, { autoApply: true });
  }
});
```

### Pattern 3: Plan-Execute-Verify
```javascript
const plan = await testAgents.planTest('My test');
console.log('Plan:', plan);  // Review before execution
const results = await testAgents.executePlan(plan, page, aiPage);
expect(results.success).toBe(true);
```

---

## 🧪 Run Examples

```bash
# All examples
npx playwright test test-agents.spec.js --headed

# Specific agent
npx playwright test test-agents.spec.js -g "Planner"
npx playwright test test-agents.spec.js -g "Generator"
npx playwright test test-agents.spec.js -g "Healer"
```

---

## 💡 Tips

1. **Review plans before execution** - Console.log the plan to verify
2. **Save generated tests** - Always use `saveToFile: true`
3. **Use appropriate healing levels**:
   - `conservative`: Production/CI
   - `moderate`: Development
   - `aggressive`: Debugging/exploration
4. **Monitor statistics** - Check `getStatistics()` regularly
5. **Combine with existing tests** - Test agents work alongside standard tests

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Plans too generic | Use `detailLevel: 'granular'` |
| Generated code fails | Review and refine plan first |
| Healing not working | Provide full `pageHTML` and `elementDescription` |
| Slow responses | Use smaller model: `llama3.2:1b` |

---

**Full Documentation:** [TEST_AGENTS_GUIDE.md](TEST_AGENTS_GUIDE.md)

**Happy Automating! 🎭**
