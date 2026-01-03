@echo off
echo ========================================
echo Cleaning Build Artifacts
echo ========================================
echo.

echo Cleaning Backend (Maven)...
cd backend-spring-boot
call mvn clean
cd ..

echo.
echo Cleaning Frontend (Next.js)...
cd frontend-nextjs
if exist ".next" (
    rmdir /s /q ".next"
    echo Removed .next directory
)
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo Removed cache directory
)
cd ..

echo.
echo ========================================
echo Clean completed!
echo ========================================
echo.
echo Note: node_modules and target directories are kept
echo       Run install-dependencies.bat to reinstall if needed
echo.
pause

