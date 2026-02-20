# 🔧 Self-Healing Test Automation

## Overview

The workflow now includes **intelligent self-healing** that automatically recovers from test failures. When tests fail on the first run (common with selector issues, timing problems, or text mismatches), the system automatically analyzes failures and regenerates improved tests.

## How It Works

### 1. **Initial Test Execution**
- Tests run normally with AI-generated selectors
- If tests pass ✅ → Workflow completes
- If tests fail ❌ → Self-healing activates

### 2. **Failure Analysis**
The system analyzes error output to detect:
- **Selector Issues**: Timeouts, elements not found
- **Text Mismatches**: Exact text not matching actual content
- **Navigation Issues**: Page load failures, network errors

### 3. **AI-Powered Healing**
- Sends failure details to AI with enhanced healing prompt
- AI generates improved test code with:
  - More robust selectors (role-based, data-testid)
  - Flexible assertions (contains vs exact match)
  - Better wait strategies
  - Proper error handling

### 4. **Retry with Healed Tests**
- Overwrites original test file with improved version
- Executes tests again (up to 2 attempts total)
- Logs healing status in UI

### 5. **Results**
- Shows healing status: `🔧 Self-healing applied`
- Displays attempt count: `♻️ Test execution took 2 attempt(s)`
- Reports final pass/fail status

## Configuration

```javascript
// In server/workflow-api.js
const maxRetries = 2; // Maximum retry attempts (configurable)
```

## Healing Strategies

### Selector Improvements
**Before:**
```javascript
const headline = page.locator('h1:has-text("Your hidden advantage in RTSM")');
```

**After (Healed):**
```javascript
const headline = page.locator('h1');
const text = await headline.textContent();
expect(text.toLowerCase()).toContain('rtsm');
```

### Wait Strategy Improvements
**Before:**
```javascript
await page.goto('https://example.com');
```

**After (Healed):**
```javascript
await page.goto('https://example.com', { 
  waitUntil: 'domcontentloaded', 
  timeout: 15000 
});
await page.waitForLoadState('networkidle');
```

### Assertion Improvements
**Before:**
```javascript
await expect(element).toHaveText('Exact text here');
```

**After (Healed):**
```javascript
await expect(element).toBeVisible();
const text = await element.textContent();
expect(text.toLowerCase()).toContain('keyword');
```

## UI Indicators

### Log Messages
- `🔧 Self-healing applied after X failed attempt(s)` - Healing was triggered
- `♻️ Test execution took X attempt(s)` - Multiple attempts made

### Results Panel
Shows healing status when applied:
```
Self-Healing: Applied (2 attempts)
```

## Benefits

1. **Automatic Recovery**: No manual intervention needed for common failures
2. **Learning System**: AI learns from failures to generate better tests
3. **Time Savings**: Eliminates manual debugging for selector issues
4. **Robustness**: Tests become more resilient after healing
5. **Transparency**: Full visibility into healing process via logs

## Common Issues Fixed

### 1. Text Without Spaces in HTML
**Problem**: HTML has `"Your hiddenadvantagein RTSM"` but displays with spaces  
**Solution**: Use keyword-based assertions instead of exact text match

### 2. Selector Timeouts
**Problem**: Elements not found due to page load timing  
**Solution**: Add proper waits and increase timeouts

### 3. Brittle Locators
**Problem**: Locators break with minor HTML changes  
**Solution**: Use semantic selectors (role, label, test-id)

### 4. Navigation Failures
**Problem**: Page doesn't load completely  
**Solution**: Wait for DOM/network idle states

## Example Workflow

```
User clicks "Run Workflow"
  ↓
Generate AI tests
  ↓
Execute tests → FAILED (5/8 passed)
  ↓
[SELF-HEAL] Analyzing failures...
  - Detected: 3 selector timeouts
  - Detected: 2 text mismatches
  ↓
[SELF-HEAL] AI generating improved tests...
  ↓
[SELF-HEAL] Saved healed test script
  ↓
Execute tests (Attempt 2) → SUCCESS (8/8 passed)
  ↓
Results posted to Jira ✅
```

## Testing the Feature

1. **Create intentionally broken test**:
   - Use wrong selectors that will fail
   - Run workflow

2. **Observe self-healing**:
   - Check logs for healing messages
   - Verify test file is regenerated
   - Confirm second attempt passes

3. **Check results panel**:
   - Look for "Self-Healing: Applied" indicator
   - Verify attempt count

## API Changes

### Updated Endpoint: `/api/workflow/execute-tests`

**Request:**
```json
{
  "filename": "ed-2-automated.spec.js",
  "testCases": [...],  // NEW: Required for healing
  "storyId": "ED-2"    // NEW: Required for healing
}
```

**Response:**
```json
{
  "success": true,
  "passed": 8,
  "failed": 0,
  "total": 8,
  "duration": "12.45",
  "healingApplied": true,    // NEW: Healing status
  "attempts": 2,             // NEW: Number of attempts
  "message": "Tests executed: 8/8 passed"
}
```

## Future Enhancements

- [ ] Persistent healing history database
- [ ] Machine learning from past healing events
- [ ] Healing analytics dashboard
- [ ] Custom healing strategies per project
- [ ] Healing confidence scores
- [ ] Manual healing override controls

## Best Practices

1. **Let healing work**: Don't immediately debug failing tests, let healing try first
2. **Review healed tests**: Check generated code quality after healing
3. **Update prompts**: If healing consistently fails, enhance AI prompts
4. **Monitor patterns**: Track common failure types to improve generation
5. **Balance retries**: Too many retries slow workflow, too few miss healing opportunities

## Troubleshooting

### Healing Not Triggered
- Check maximum retry count (default: 2)
- Verify testCases and storyId passed to execute-tests endpoint
- Check logs for AI errors

### Healing Fails
- Review AI error messages in logs
- Check if failure patterns are recognizable
- Manually fix and enhance healing prompt

### Multiple Healing Cycles
- Indicates complex issues AI can't resolve
- Review generated code quality
- Consider updating base AI prompts

---

**Status**: ✅ Active and working in workflow  
**Version**: 1.0  
**Last Updated**: February 20, 2026
