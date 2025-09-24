@echo off
REM Batch script for starting Next.js development server on Windows
REM This handles the common Windows permission issues with Next.js

echo Starting Next.js Development Server...

REM Set environment variables
set NEXT_TELEMETRY_DISABLED=1
set NODE_ENV=development

REM Clean build artifacts
echo Cleaning build artifacts...
rmdir /s /q .next 2>nul
rmdir /s /q out 2>nul

REM Create .next directory and trace file
echo Creating directories and files...
mkdir .next 2>nul
echo. > .next\trace

REM Set file permissions
echo Setting permissions...
icacls .next /grant Everyone:F /T >nul 2>&1

REM Start development server
echo.
echo ===========================================
echo  Next.js Development Server Starting
echo ===========================================
echo  Local:    http://localhost:3000
echo  Network:  Check console output for IP
echo ===========================================
echo.

npm run dev:webpack