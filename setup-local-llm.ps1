# Setup script to switch from Anthropic to Local LLM
# Simple version without emojis for PowerShell compatibility

Write-Host "`n=== AI-Assisted Playwright - Local LLM Setup ===`n" -ForegroundColor Cyan

# Step 1: Check if Ollama is installed
Write-Host "[1/7] Checking for Ollama..." -ForegroundColor Yellow
$ollamaInstalled = Get-Command ollama -ErrorAction SilentlyContinue

if (-not $ollamaInstalled) {
    Write-Host "   ERROR: Ollama not found!" -ForegroundColor Red
    Write-Host "   Please install Ollama first:" -ForegroundColor White
    Write-Host "   https://ollama.com/download" -ForegroundColor Cyan
    Write-Host "`n   Or run: winget install Ollama.Ollama" -ForegroundColor Gray
    Write-Host "`n   After installation, run this script again.`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "   SUCCESS: Ollama is installed!" -ForegroundColor Green

# Step 2: Check if Ollama is running
Write-Host "`n[2/7] Checking if Ollama is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "   SUCCESS: Ollama is running!" -ForegroundColor Green
} catch {
    Write-Host "   WARNING: Ollama is not running. Starting it..." -ForegroundColor Yellow
    Start-Process "ollama" "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    Write-Host "   SUCCESS: Ollama started!" -ForegroundColor Green
}

# Step 3: Check if model is downloaded
Write-Host "`n[3/7] Checking for llama3.2:3b model..." -ForegroundColor Yellow
$models = ollama list
if ($models -match "llama3.2:3b") {
    Write-Host "   SUCCESS: llama3.2:3b model found!" -ForegroundColor Green
} else {
    Write-Host "   Model not found. Downloading..." -ForegroundColor Yellow
    Write-Host "   (This will take a few minutes - model is ~2GB)" -ForegroundColor Gray
    ollama pull llama3.2:3b
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   SUCCESS: Model downloaded!" -ForegroundColor Green
    } else {
        Write-Host "   WARNING: Download incomplete. You can resume later with: ollama pull llama3.2:3b" -ForegroundColor Yellow
    }
}

# Step 4: Install OpenAI package
Write-Host "`n[4/7] Installing OpenAI package..." -ForegroundColor Yellow
npm install openai --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "   SUCCESS: OpenAI package installed!" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Failed to install openai package" -ForegroundColor Red
    Write-Host "   Run manually: npm install openai" -ForegroundColor Yellow
}

# Step 5: Backup and replace ai-engine.js
Write-Host "`n[5/7] Updating AI engine..." -ForegroundColor Yellow
if (Test-Path "src/core/ai-engine-backup.js") {
    Write-Host "   INFO: Backup already exists, skipping..." -ForegroundColor Gray
} else {
    Copy-Item "src/core/ai-engine.js" "src/core/ai-engine-backup.js"
    Write-Host "   SUCCESS: Original backed up to ai-engine-backup.js" -ForegroundColor Green
}

Copy-Item "src/core/ai-engine-local.js" "src/core/ai-engine.js" -Force
Write-Host "   SUCCESS: AI engine updated to support local LLM!" -ForegroundColor Green

# Step 6: Update .env file
Write-Host "`n[6/7] Updating .env configuration..." -ForegroundColor Yellow

$envContent = @"

# AI Provider Configuration
AI_PROVIDER=local
LOCAL_LLM_URL=http://localhost:11434/v1
LOCAL_LLM_MODEL=llama3.2:3b
LOCAL_LLM_API_KEY=not-needed
"@

if (Test-Path ".env") {
    $currentEnv = Get-Content ".env" -Raw
    if ($currentEnv -match "AI_PROVIDER") {
        Write-Host "   INFO: AI_PROVIDER already configured in .env" -ForegroundColor Gray
        Write-Host "   Please manually verify your .env has these settings:" -ForegroundColor Yellow
        Write-Host "   AI_PROVIDER=local" -ForegroundColor Cyan
        Write-Host "   LOCAL_LLM_URL=http://localhost:11434/v1" -ForegroundColor Cyan
        Write-Host "   LOCAL_LLM_MODEL=llama3.2:3b" -ForegroundColor Cyan
    } else {
        Add-Content ".env" $envContent
        Write-Host "   SUCCESS: .env updated with local LLM settings!" -ForegroundColor Green
    }
} else {
    Set-Content ".env" $envContent.TrimStart()
    Write-Host "   SUCCESS: .env created with local LLM settings!" -ForegroundColor Green
}

# Step 7: Test the setup
Write-Host "`n[7/7] Testing local LLM connection..." -ForegroundColor Yellow
Write-Host "   Sending test query to Ollama..." -ForegroundColor Gray

$testPrompt = @{
    model = "llama3.2:3b"
    prompt = "Respond with exactly: AI is working!"
    stream = $false
} | ConvertTo-Json

try {
    $testResponse = Invoke-RestMethod -Uri "http://localhost:11434/api/generate" -Method Post -Body $testPrompt -ContentType "application/json" -TimeoutSec 30
    Write-Host "   SUCCESS: Local LLM is responding!" -ForegroundColor Green
    $responseText = $testResponse.response
    if ($responseText.Length -gt 50) {
        $responseText = $responseText.Substring(0, 50) + "..."
    }
    Write-Host "   Response: $responseText" -ForegroundColor Cyan
} catch {
    Write-Host "   WARNING: Could not test LLM (model may still be downloading)" -ForegroundColor Yellow
    Write-Host "   This is OK - it will work in tests once model is fully downloaded" -ForegroundColor Gray
}

# Summary
Write-Host "`n" + "="*70 -ForegroundColor Cyan
Write-Host "   Setup Complete!" -ForegroundColor Green -BackgroundColor DarkGreen
Write-Host "="*70 -ForegroundColor Cyan

Write-Host "`nConfiguration Summary:" -ForegroundColor Yellow
Write-Host "   Provider: Local LLM (Ollama)" -ForegroundColor White
Write-Host "   Model: llama3.2:3b" -ForegroundColor White
Write-Host "   Endpoint: http://localhost:11434/v1" -ForegroundColor White
Write-Host "   Cost: FREE" -ForegroundColor Green

Write-Host "`nReady to test!" -ForegroundColor Cyan
Write-Host "   Run: npx playwright test saucedemo_Smoke.spec.js --headed" -ForegroundColor White

Write-Host "`nFor more info, see LOCAL_LLM_SETUP.md`n" -ForegroundColor Gray
