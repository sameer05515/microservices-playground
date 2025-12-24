@echo off
echo ========================================
echo Starting Full Application Stack
echo ========================================
echo.
echo This will start:
echo   1. Spring Boot Backend (port 8080)
echo   2. Next.js Frontend (port 3000)
echo.
echo Press Ctrl+C to stop all services
echo.

start "Backend Server" cmd /k "cd backend-spring-boot && mvn spring-boot:run"

timeout /t 5 /nobreak >nul

start "Frontend Server" cmd /k "cd frontend-nextjs && npm run dev"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo.
echo Close the command windows to stop the servers
echo.

pause

