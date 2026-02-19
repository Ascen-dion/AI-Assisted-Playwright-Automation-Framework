# 🤖 Local LLM Setup Guide for AI-Assisted Playwright

This guide shows you how to use **FREE local LLMs** instead of Anthropic's paid API.

## ✅ Benefits of Local LLMs
- **100% Free** - No API costs
- **Unlimited Usage** - No rate limits
- **Privacy** - Data stays on your machine
- **Offline** - No internet required

## 🚀 Quick Setup (Recommended: Ollama)

### Step 1: Install Ollama

**Windows:**
```powershell
# Download and install from: https://ollama.com/download
# Or use winget:
winget install Ollama.Ollama
```

**Mac/Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Download a Model

```powershell
# Recommended: Llama 3.2 (3B - fast, good quality)
ollama pull llama3.2:3b

# Alternative options:
# ollama pull llama3.1:8b    # Better quality, slower
# ollama pull qwen2.5:7b     # Good for technical tasks
# ollama pull mistral:7b     # Fast and capable
```

### Step 3: Verify Ollama is Running

```powershell
# Test the API
curl http://localhost:11434/api/tags

# Or test a chat completion
ollama run llama3.2:3b "Hello, are you working?"
```

### Step 4: Update Your `.env` File

```env
# AI Provider Configuration
AI_PROVIDER=local                              # Options: local, anthropic, disabled

# Local LLM Settings (for Ollama or LM Studio)
LOCAL_LLM_URL=http://localhost:11434/v1       # Ollama's OpenAI-compatible endpoint
LOCAL_LLM_MODEL=llama3.2:3b                    # Your downloaded model
LOCAL_LLM_API_KEY=not-needed                   # Most local LLMs don't need this

# Anthropic (Optional - only if you have credits)
ANTHROPIC_API_KEY=your_key_here
```

### Step 5: Install OpenAI Package

```powershell
npm install openai
```

### Step 6: Update ai-engine.js

```powershell
# Backup original
cp src/core/ai-engine.js src/core/ai-engine-original.js

# Use the new flexible version
cp src/core/ai-engine-local.js src/core/ai-engine.js
```

### Step 7: Run Your Tests!

```powershell
npx playwright test saucedemo_Smoke.spec.js --headed
```

## 🎯 Alternative: LM Studio

If you prefer a GUI:

1. Download **LM Studio**: https://lmstudio.ai/
2. Download a model (Llama 3.2 3B recommended)
3. Start the local server (default: http://localhost:1234/v1)
4. Update `.env`:

```env
AI_PROVIDER=local
LOCAL_LLM_URL=http://localhost:1234/v1
LOCAL_LLM_MODEL=llama-3.2-3b-instruct
```

## 📊 Model Recommendations

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| **llama3.2:3b** | 2GB | ⚡⚡⚡ | Good | General testing, fast CI/CD |
| **llama3.1:8b** | 4.7GB | ⚡⚡ | Better | Complex selectors, detailed analysis |
| **qwen2.5:7b** | 4.4GB | ⚡⚡ | Great | Technical/code tasks |
| **mistral:7b** | 4.1GB | ⚡⚡ | Good | Balanced performance |

## 🔧 Configuration Options

### Option 1: Local LLM (Recommended for Free)
```env
AI_PROVIDER=local
LOCAL_LLM_URL=http://localhost:11434/v1
LOCAL_LLM_MODEL=llama3.2:3b
```

### Option 2: Anthropic Claude (Requires Credits)
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Option 3: Disable AI (Use Standard Playwright)
```env
AI_PROVIDER=disabled
```

## 🧪 Test the Setup

```javascript
// Create test-local-llm.js
const aiEngine = require('./src/core/ai-engine');

async function test() {
  const result = await aiEngine.findElementSelector(
    '<button id="submit">Login</button>',
    'login button'
  );
  console.log('AI Response:', result);
}

test();
```

## ⚠️ Known Limitations with Local LLMs

1. **No Vision Support** - Screenshot analysis won't work (Anthropic only)
2. **Slower** - Local LLMs are slower than cloud APIs
3. **Quality Varies** - Smaller models may be less accurate
4. **RAM Usage** - 3B models need ~4GB RAM, 8B models need ~8GB RAM

## 💡 Tips for Best Results

1. **Use specific descriptions**: Instead of "button", say "blue login button"
2. **Keep models running**: Don't stop Ollama between tests
3. **Warm up models**: First query is slow, subsequent ones are faster
4. **Choose right model**: 3B for speed, 8B for quality

## 🆘 Troubleshooting

### Ollama not running?
```powershell
# Check if Ollama is running
Get-Process ollama -ErrorAction SilentlyContinue

# Start Ollama (if not running)
Start-Process "ollama" "serve"
```

### Connection refused?
```powershell
# Test connection
curl http://localhost:11434/api/tags

# Verify model is downloaded
ollama list
```

### Slow responses?
- Use smaller model (llama3.2:3b instead of :8b)
- Reduce HTML truncation in prompts
- Add more RAM if possible

## 🎉 You're All Set!

Your AI-assisted testing framework now works completely FREE with local LLMs!

Questions? Check the main README or create an issue on GitHub.
