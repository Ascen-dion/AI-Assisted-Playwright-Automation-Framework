@echo off
echo.
echo ========================================
echo   Playwright AI Framework - UI Launcher
echo ========================================
echo.

REM Check if ui/node_modules exists
if not exist "ui\node_modules\" (
    echo [1/4] Installing UI dependencies...
    cd ui
    call npm install --legacy-peer-deps
    cd ..
) else (
    echo [1/4] UI dependencies already installed ✓
)

REM Check if server/node_modules exists
if not exist "server\node_modules\" (
    echo [2/4] Installing backend dependencies...
    cd server
    call npm install
    cd ..
) else (
    echo [2/4] Backend dependencies already installed ✓
)

echo.
echo [3/4] Starting backend API server...
start "Workflow API Backend" cmd /k "cd server && node workflow-api.js"

timeout /t 3 /nobreak >nul

echo [4/4] Starting React UI...
start "React UI Frontend" cmd /k "cd ui && npm start"

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Backend API: http://localhost:3001
echo Frontend UI: http://localhost:3000
echo.
echo Two windows have been opened:
echo   1. Workflow API Backend (port 3001)
echo   2. React UI Frontend (port 3000)
echo.
echo Keep both windows running while using the UI.
echo Press any key to exit this window...
pause >nul
