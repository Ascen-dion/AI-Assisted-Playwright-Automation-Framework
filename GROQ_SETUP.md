# 🚀 Groq Setup Guide - Free LLM for MCP

## ✅ What Changed

Your MCP integration now uses **Groq** instead of Anthropic Claude:
- ✅ **100% Free**: 14,400 requests/day
- ✅ **Very Fast**: 30-100 tokens/second
- ✅ **Great Model**: Llama 3.3 70B
- ✅ **No Credit Card Required**

---

## 📝 Quick Setup (3 Steps)

### Step 1: Get Your Free Groq API Key

1. Go to: **https://console.groq.com/keys**
2. Sign up with Google/GitHub (takes 30 seconds)
3. Click **"Create API Key"**
4. Copy the key (starts with `gsk_...`)

### Step 2: Add API Key to .env File

Open `.env` file and replace:
```env
GROQ_API_KEY=your-groq-api-key-here
```

With your actual key:
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Test It!

Run the MCP demo tests:
```bash
npm test -- mcp-demo.spec.js
```

Run the natural language test:
```bash
npm test -- mcp-example.spec.js --grep "Login using natural language"
```

---

## 🎯 What Works with Groq

**All MCP Features:**
- ✅ Natural language test authoring
- ✅ `mcpClaude.do('login as admin')` 
- ✅ `mcpClaude.verify('user is logged in')`
- ✅ `mcpClaude.navigate(url)` with page analysis
- ✅ Self-healing element detection
- ✅ Autonomous test generation
- ✅ AI-powered assertions

**Limitations:**
- ❌ No vision/image support (yet) - screenshots analysis disabled
- ✅ Everything else works perfectly!

---

## 📊 Performance Comparison

| Feature | Anthropic Claude | Groq |
|---------|-----------------|------|
| Cost | $3-5 per million tokens | **FREE** |
| Speed | 10-20 tokens/sec | **30-100 tokens/sec** |
| Rate Limit | Varies by plan | 14,400 req/day |
| Quality | Excellent | Very Good |

---

## 🔧 Troubleshooting

### "API key is invalid"
- Make sure key starts with `gsk_`
- No spaces or quotes around the key
- Create a new key if needed

### "Rate limit exceeded"
- Free tier: 14,400 requests/day
- Wait 24 hours or create new account
- More than enough for testing!

### Tests still failing?
- Check `.env` file is in project root
- Restart VS Code/terminal
- Verify key at: https://console.groq.com/keys

---

## 🎉 Example Usage

```javascript
const { test } = require('../core/ai-test-runner');

test('Login test with Groq', async ({ mcpClaude }) => {
  // Natural language - Groq LLM understands!
  await mcpClaude.navigate('https://www.saucedemo.com/');
  await mcpClaude.do('login with username standard_user and password secret_sauce');
  await mcpClaude.verify('user is logged in');
  await mcpClaude.verify('products page is displayed');
});
```

---

## 💰 Cost Savings

**Before (Anthropic Claude):**
- $3-5 per million tokens
- Requires payment & credit card
- Low credit = tests blocked

**After (Groq):**
- **$0** - Completely free
- 14,400 requests/day
- No credit card needed
- Never gets blocked!

---

## 🚀 Next Steps

1. **Get API Key**: https://console.groq.com/keys
2. **Update .env**: Add your `GROQ_API_KEY`  
3. **Run Tests**: `npm test -- mcp-example.spec.js`
4. **Enjoy Free AI Testing!** 🎉

---

## 📚 Resources

- **Groq Console**: https://console.groq.com
- **Groq Docs**: https://console.groq.com/docs
- **MCP Integration Guide**: See `MCP_INTEGRATION.md`
- **Free Models**: Llama 3.3 70B, Mixtral, Gemma

---

**All set! Your MCP framework now uses free, fast Groq AI.** 🚀
