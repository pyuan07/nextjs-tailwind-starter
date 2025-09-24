# PowerShell script for starting Next.js development server on Windows
# This handles the common Windows permission issues with Next.js

# Set environment variables for Next.js
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NODE_ENV = "development"

# Clean any existing build artifacts
Write-Host "Cleaning build artifacts..." -ForegroundColor Green
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "out" -Recurse -Force -ErrorAction SilentlyContinue

# Create .next directory with proper permissions
Write-Host "Creating .next directory..." -ForegroundColor Green
New-Item -ItemType Directory -Path ".next" -Force | Out-Null

# Create trace file to prevent permission errors
New-Item -ItemType File -Path ".next\trace" -Force | Out-Null

# Give full permissions to the .next directory
Write-Host "Setting permissions..." -ForegroundColor Green
icacls ".next" /grant Everyone:F /T | Out-Null

# Start the development server
Write-Host "Starting Next.js development server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Cyan

# Use npm run dev:webpack to avoid Turbopack issues on Windows
npm run dev:webpack