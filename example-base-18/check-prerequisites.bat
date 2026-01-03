@echo off
echo ========================================
echo Checking Prerequisites
echo ========================================
echo.

set MISSING=0

echo Checking Java...
where java >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [X] Java is NOT installed or not in PATH
    set MISSING=1
) else (
    java -version 2>&1 | findstr /i "version"
    echo [OK] Java is installed
)

echo.
echo Checking Maven...
where mvn >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [X] Maven is NOT installed or not in PATH
    set MISSING=1
) else (
    mvn -version | findstr /i "Apache Maven"
    echo [OK] Maven is installed
)

echo.
echo Checking Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js is NOT installed or not in PATH
    set MISSING=1
) else (
    node -v
    echo [OK] Node.js is installed
)

echo.
echo Checking npm...
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [X] npm is NOT installed or not in PATH
    set MISSING=1
) else (
    npm -v
    echo [OK] npm is installed
)

echo.
echo Checking MongoDB...
where mongod >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MongoDB may not be installed or not in PATH
    echo           Make sure MongoDB is running on localhost:27017
) else (
    echo [OK] MongoDB command found
)

echo.
echo ========================================
if %MISSING% EQU 1 (
    echo Some prerequisites are missing!
    echo Please install the missing tools before running the application.
) else (
    echo All prerequisites are installed!
)
echo ========================================
echo.

pause

