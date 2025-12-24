@echo off
echo ========================================
echo Building Full Application
echo ========================================
echo.

echo Building Backend (Spring Boot)...
cd backend-spring-boot
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend build failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo Building Frontend (Next.js)...
cd frontend-nextjs
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend build failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo Backend JAR: backend-spring-boot\target\backend-spring-boot-*.jar
echo Frontend: frontend-nextjs\.next
echo.
pause

