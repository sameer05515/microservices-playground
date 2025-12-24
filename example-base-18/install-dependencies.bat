@echo off
echo ========================================
echo Installing Dependencies
echo ========================================
echo.

echo Installing Backend Dependencies (Maven)...
cd backend-spring-boot
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo Installing Frontend Dependencies (npm)...
cd frontend-nextjs
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo All dependencies installed successfully!
echo ========================================
pause

