@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\package-windows.ps1"
if errorlevel 1 (
  echo.
  echo Packaging failed.
  exit /b 1
)
echo.
echo Packaging completed successfully.
endlocal
