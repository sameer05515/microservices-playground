@echo off
REM Batch script to run Swing Video Player with JavaFX native libraries
REM 
REM Usage:
REM   1. Set JAVA_FX_HOME to your JavaFX SDK path
REM   2. Run this script: run-with-javafx.bat

REM Set JavaFX SDK path (adjust this to your JavaFX SDK location)
set JAVA_FX_HOME=C:\javafx-sdk-17.0.2

REM Check if JavaFX SDK exists
if not exist "%JAVA_FX_HOME%\bin" (
    echo.
    echo ERROR: JavaFX SDK not found at %JAVA_FX_HOME%
    echo.
    echo Please:
    echo 1. Download JavaFX SDK 17.0.2 from https://openjfx.io/
    echo 2. Extract it to a folder
    echo 3. Update JAVA_FX_HOME in this script to point to the extracted folder
    echo.
    pause
    exit /b 1
)

REM Add JavaFX native libraries to PATH
set PATH=%JAVA_FX_HOME%\bin;%PATH%

echo.
echo Running Swing Video Player with JavaFX...
echo JavaFX SDK: %JAVA_FX_HOME%
echo.

REM Run the application
mvn exec:java

pause

