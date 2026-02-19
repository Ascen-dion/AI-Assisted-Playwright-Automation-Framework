# 🎯 Plan to Code Conversion Guide

## Quick Start

### Option 1: Convert Existing Plan to Code

```javascript
const testAgents = require('../core/test-agents');
const fs = require('fs');

// Load saved plan
const plan = JSON.parse(fs.readFileSync('path/to/plan.json', 'utf8'));

// Generate executable code
const generated = await testAgents.generateTest(plan, {
  framework: 'playwright',
  language: 'javascript',
  useAIPage: true,
  includeComments: true,
  filename: 'my-test.spec.js'
});

// Use the generated code
console.log(generated.code);
fs.writeFileSync(`src/tests/${generated.filename}`, generated.code);
```

### Option 2: Create Plan and Generate Code in One Go

```javascript
// Create plan and generate code automatically
const generated = await testAgents.generateTest(
  'Login to saucedemo with valid credentials',
  { 
    useAIPage: true,
    filename: 'login-test.spec.js'
  }
);
```

### Option 3: Two-Step Process

```javascript
// Step 1: Create detailed plan
const plan = await testAgents.planTest(
  'Verify search functionality',
  { detailLevel: 'detailed' }
);

// Step 2: Generate code from plan
const generated = await testAgents.generateTest(plan, {
  useAIPage: true,
  filename: 'search-test.spec.js'
});
```

## Generator Options

```javascript
{
  framework: 'playwright',          // 'playwright' or 'playwright-test'
  language: 'javascript',           // 'javascript' or 'typescript'
  useAIPage: true,                  // Use AI-powered aiPage methods
  includeComments: true,            // Add helpful comments
  filename: 'test.spec.js',         // Output filename
  saveToFile: false                 // Auto-save to file
}
```

## Usage Examples

### Example 1: Convert Your Saved Plan

```bash
# Run the conversion script
npx playwright test src/tests/plan-to-code.spec.js --headed

# This will:
# 1. Load your saved plan from test-results/agents/plans/
# 2. Generate executable Playwright code
# 3. Save to test-results/agents/generated/
```

### Example 2: Standard Playwright Methods

```javascript
const generated = await testAgents.generateTest(plan, {
  useAIPage: false,  // Use standard Playwright syntax
  filename: 'standard-test.spec.js'
});

// Output will use:
// - await page.goto()
// - await page.click()
// - await page.fill()
```

### Example 3: AI-Powered Methods

```javascript
const generated = await testAgents.generateTest(plan, {
  useAIPage: true,   // Use AI-powered syntax
  filename: 'ai-test.spec.js'
});

// Output will use:
// - await aiPage.navigateTo('description')
// - await aiPage.clickElement('button description')
// - await aiPage.fillField('field description', 'value')
```

### Example 4: TypeScript Output

```javascript
const generated = await testAgents.generateTest(plan, {
  language: 'typescript',
  filename: 'test.spec.ts'
});
```

## What You Get

The generated code includes:

1. **Import Statements**
   ```javascript
   const { test, expect } = require('@playwright/test');
   const { AIPage } = require('../core/ai-page');
   ```

2. **Test Structure**
   ```javascript
   test.describe('Test Suite', () => {
     test('Test Case', async ({ page }) => {
       // Your generated test steps
     });
   });
   ```

3. **All Your Steps**
   - Navigation
   - Clicks
   - Form fills
   - Verifications
   - Assertions

4. **Comments & Documentation**
   - What each step does
   - Why it's needed
   - Expected outcomes

## Saved Plans Location

Your plans are saved at:
```
test-results/agents/plans/plan-<timestamp>.json
```

Generated code will be saved at:
```
test-results/agents/generated/<filename>.spec.js
```

## Quick Commands

```bash
# Convert saved plan to code
npx playwright test src/tests/plan-to-code.spec.js --grep "Load existing plan"

# Create plan → Generate code workflow
npx playwright test src/tests/plan-to-code.spec.js --grep "Create new plan"

# Batch convert all saved plans
npx playwright test src/tests/plan-to-code.spec.js --grep "Batch convert"

# Run all conversions
npx playwright test src/tests/plan-to-code.spec.js
```

## Output Example

When you run the converter, you'll see:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ GENERATED EXECUTABLE CODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Filename: saucedemo-title-verification.spec.js
📦 Dependencies: playwright, ai-page
📝 Description: Test to verify page title

━━━━ GENERATED CODE ━━━━━

const { test, expect } = require('@playwright/test');
const { AIPage } = require('../core/ai-page');

test.describe('Verify Page Title on Saucedemo.com', () => {
  test('should verify page title', async ({ page }) => {
    const aiPage = new AIPage(page);
    
    // Navigate to saucedemo.com
    await aiPage.navigateTo('https://www.saucedemo.com');
    
    // Verify page title
    await expect(page).toHaveTitle(/Products/);
  });
});

━━━━━━━━━━━━━━━━━━━━━━━━━

💾 Code saved to: test-results/agents/generated/saucedemo-title-verification.spec.js

✅ Plan successfully converted to executable automation script!
```

## Next Steps

1. **Run the conversion**:
   ```bash
   npx playwright test src/tests/plan-to-code.spec.js
   ```

2. **Review generated code**:
   ```bash
   code test-results/agents/generated/
   ```

3. **Copy to your tests folder**:
   ```bash
   cp test-results/agents/generated/*.spec.js src/tests/
   ```

4. **Run your generated tests**:
   ```bash
   npx playwright test src/tests/<generated-file>.spec.js --headed
   ```

## Tips

- ✅ Generated code is production-ready
- ✅ Includes proper error handling
- ✅ Well-commented and documented
- ✅ Follows Playwright best practices
- ✅ Can use AI-powered or standard methods
- ✅ Supports JavaScript and TypeScript
