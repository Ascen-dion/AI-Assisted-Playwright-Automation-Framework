# 🎯 Generated Automation Scripts - Quick Guide

## ✅ Your Generated Tests

I've created **executable automation scripts** from your plan:

### 📄 Generated Files

1. **test-results/agents/generated/saucedemo-title-verification.spec.js**
   - Basic title verification test
   - Ready to run

2. **src/tests/generated-saucedemo.spec.js**
   - Enhanced version with AI-powered element finding
   - 2 test cases included
   - Production-ready

## 🚀 How to Run Your Generated Tests

### Option 1: Run the Generated Test
```bash
npx playwright test src/tests/generated-saucedemo.spec.js --headed
```

### Option 2: Run Specific Test
```bash
npx playwright test src/tests/generated-saucedemo.spec.js --grep "verify page title"
```

### Option 3: Run with AI Element Verification
```bash
npx playwright test src/tests/generated-saucedemo.spec.js --grep "verify page elements"
```

## 📝 What's in the Generated Code?

The Generator Agent created:

```javascript
const { test, expect } = require('@playwright/test');
const { AIPage } = require('../../src/core/ai-page');

test.describe('Saucedemo - Page Title Verification', () => {
  test('should navigate and verify title', async ({ page }) => {
    const aiPage = new AIPage(page);
    
    // Step 1: Navigate
    await aiPage.navigateTo('https://www.saucedemo.com');
    
    // Step 2: Verify title
    await expect(page).toHaveTitle(/Swag Labs/);
    
    // Step 3: Verify elements using AI
    await aiPage.verifyElement('login container');
  });
});
```

## 🎨 Generate More Tests

### Quick Method: Description → Code
```javascript
const testAgents = require('./src/core/test-agents');

// Just describe what you want to test
const generated = await testAgents.generateTest(
  'Login to saucedemo with standard_user and verify products page',
  { 
    useAIPage: true,
    filename: 'login-test.spec.js'
  }
);

// Code is automatically generated!
```

### Advanced Method: Plan → Code
```javascript
// Step 1: Create detailed plan
const plan = await testAgents.planTest(
  'Add items to cart and verify checkout',
  { detailLevel: 'detailed' }
);

// Step 2: Generate code from plan
const generated = await testAgents.generateTest(plan, {
  useAIPage: true,
  includeComments: true,
  filename: 'checkout-test.spec.js'
});
```

## 💡 Common Use Cases

### 1. Generate Login Test
```bash
# Create a script or use Node REPL
node -e "
const testAgents = require('./src/core/test-agents');
testAgents.generateTest('Login with valid credentials', {
  useAIPage: true,
  filename: 'login.spec.js'
}).then(code => console.log(code.text));
"
```

### 2. Generate E2E Workflow
```bash
npx playwright test src/tests/plan-to-code.spec.js --grep "Create new plan"
# Customize the test description in the file
```

### 3. Batch Generate Tests
```bash
npx playwright test src/tests/plan-to-code.spec.js --grep "Batch convert"
```

## 🏃 Next Steps

1. **Test the generated code**:
   ```bash
   npx playwright test src/tests/generated-saucedemo.spec.js --headed
   ```

2. **Customize the tests**:
   - Open `src/tests/generated-saucedemo.spec.js`
   - Modify steps as needed
   - Add more test cases

3. **Generate more tests**:
   - Use the Generator Agent for any test scenario
   - Just describe what you want in plain English
   - Get production-ready code instantly

4. **Use AI-powered methods**:
   ```javascript
   await aiPage.clickElement('description of button');
   await aiPage.fillField('description of field', 'value');
   await aiPage.verifyElement('description of element');
   ```

## 📊 Features of Generated Code

✅ **Production-Ready**: Follows Playwright best practices  
✅ **Well-Commented**: Clear explanations of each step  
✅ **AI-Powered**: Uses intelligent element finding  
✅ **Maintainable**: Clean structure, easy to modify  
✅ **Executable**: Run immediately without changes  

## 🔄 Generate Tests from Any Description

You can generate tests for:
- ✅ Login flows
- ✅ Form submissions
- ✅ Navigation tests
- ✅ Element verifications
- ✅ E2E workflows
- ✅ API interactions
- ✅ Visual validations
- ✅ Any test scenario!

Just describe it in plain English, and the Generator Agent creates the code!

## 📚 Reference Files

- Full Guide: `PLAN_TO_CODE_GUIDE.md`
- Test Agents Guide: `TEST_AGENTS_GUIDE.md`
- Quick Reference: `TEST_AGENTS_QUICK_REF.md`
- Converter Script: `src/tests/plan-to-code.spec.js`
