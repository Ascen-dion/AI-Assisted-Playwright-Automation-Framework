# Playwright AI Framework - UI Launcher
# This script starts both the backend API and frontend UI

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Playwright AI Framework - UI Launcher" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if ui/node_modules exists
if (-not (Test-Path "ui\node_modules")) {
    Write-Host "[1/4] Installing UI dependencies..." -ForegroundColor Yellow
    Push-Location ui
    npm install --legacy-peer-deps
    Pop-Location
} else {
    Write-Host "[1/4] UI dependencies already installed ✓" -ForegroundColor Green
}

# Check if server/node_modules exists
if (-not (Test-Path "server\node_modules")) {
    Write-Host "[2/4] Installing backend dependencies..." -ForegroundColor Yellow
    Push-Location server
    npm install
    Pop-Location
} else {
    Write-Host "[2/4] Backend dependencies already installed ✓" -ForegroundColor Green
}

Write-Host "`n[3/4] Starting backend API server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; node workflow-api.js"

Start-Sleep -Seconds 3

Write-Host "[4/4] Starting React UI...`n" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\ui'; npm start"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Backend API: " -NoNewline
Write-Host "http://localhost:3001" -ForegroundColor Blue
Write-Host "Frontend UI: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Blue

Write-Host "`nTwo PowerShell windows have been opened:" -ForegroundColor Yellow
Write-Host "  1. Workflow API Backend (port 3001)" -ForegroundColor White
Write-Host "  2. React UI Frontend (port 3000)" -ForegroundColor White

Write-Host "`nKeep both windows running while using the UI." -ForegroundColor Yellow
Write-Host "Press Ctrl+C in each window to stop the servers.`n" -ForegroundColor Yellow
