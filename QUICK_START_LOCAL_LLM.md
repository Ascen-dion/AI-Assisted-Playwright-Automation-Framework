# 🤖 Quick Start: Switch to Local LLM (FREE!)

## What You Need to Do:

### 1️⃣ Install Ollama (5 minutes)
```powershell
# Download and install Ollama from:
https://ollama.com/download

# Or with winget:
winget install Ollama.Ollama
```

### 2️⃣ Download a Model
```powershell
ollama pull llama3.2:3b
```

### 3️⃣ Install OpenAI Package
```powershell
npm install openai
```

### 4️⃣ Update .env File

Add these lines to your `.env` file:

```env
# Switch to Local LLM
AI_PROVIDER=local
LOCAL_LLM_URL=http://localhost:11434/v1
LOCAL_LLM_MODEL=llama3.2:3b
LOCAL_LLM_API_KEY=not-needed
```

### 5️⃣ Switch to New AI Engine
```powershell
# Backup original
cp src/core/ai-engine.js src/core/ai-engine-backup.js

# Use new flexible version
cp src/core/ai-engine-local.js src/core/ai-engine.js
```

### 6️⃣ Test It!
```powershell
npx playwright test saucedemo_Smoke.spec.js --headed
```

---

**That's it!** You now have FREE AI-powered testing with no API costs! 🎉

See [LOCAL_LLM_SETUP.md](LOCAL_LLM_SETUP.md) for detailed guide.
