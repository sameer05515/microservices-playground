@echo off
echo ========================================
echo Starting Spring Boot Backend
echo ========================================
echo.

cd backend-spring-boot

echo Checking if Maven is installed...
where mvn >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven or add it to your PATH
    pause
    exit /b 1
)

echo.
echo Starting backend server...
echo Backend will be available at: http://localhost:8080
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo.

mvn spring-boot:run

pause

