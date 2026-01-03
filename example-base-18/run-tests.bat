@echo off
echo ========================================
echo Running All Tests
echo ========================================
echo.

echo Running Backend Tests (Spring Boot)...
cd backend-spring-boot
call mvn test
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Backend tests failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo Running Frontend Tests (Next.js)...
cd frontend-nextjs
call npm test -- --passWithNoTests
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Frontend tests failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo All tests passed successfully!
echo ========================================
pause

