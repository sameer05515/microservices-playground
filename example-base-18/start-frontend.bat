@echo off
echo ========================================
echo Starting Next.js Frontend
echo ========================================
echo.

cd frontend-nextjs

echo Checking if Node.js is installed...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Checking if node_modules exists...
if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting frontend server...
echo Frontend will be available at: http://localhost:3000
echo.

call npm run dev

pause

