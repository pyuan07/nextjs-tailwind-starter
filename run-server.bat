@echo off
echo ====================================
echo    Starting Next.js Server
echo ====================================

REM Kill any existing Node processes
taskkill /f /im node.exe >nul 2>&1

REM Set environment variables
set NEXT_TELEMETRY_DISABLED=1
set NODE_ENV=development

REM Clean and prepare directories
echo Cleaning build directory...
rmdir /s /q .next >nul 2>&1
mkdir .next >nul 2>&1
echo. > .next\trace

REM Start the server
echo Starting server on available port...
echo.
npx next dev --port 3000

pause