$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host "=== Swing REST Client V5 - Windows EXE packaging ===" -ForegroundColor Cyan

$javaVersion = & java -version 2>&1
if ($LASTEXITCODE -ne 0) { throw "Java/JDK was not found. Install JDK 17+ and add it to PATH." }
Write-Host ($javaVersion | Select-Object -First 1)

$jpackage = Get-Command jpackage -ErrorAction SilentlyContinue
if (-not $jpackage) { throw "jpackage was not found. Install a JDK 17+ and ensure its bin directory is on PATH." }

$mvn = Get-Command mvn -ErrorAction SilentlyContinue
if (-not $mvn) { throw "Maven (mvn) was not found. Install Maven and add it to PATH." }

Write-Host "[1/4] Building fat JAR..." -ForegroundColor Yellow
& mvn clean package
if ($LASTEXITCODE -ne 0) { throw "Maven build failed." }

$version = '5.0.0'
$jar = Join-Path $ProjectRoot "target\swing-rest-client-v5-$version.jar"
if (-not (Test-Path $jar)) { throw "Expected JAR not found: $jar" }

$dist = Join-Path $ProjectRoot 'dist'
$inputDir = Join-Path $ProjectRoot 'target'
$resources = Join-Path $ProjectRoot 'src\main\resources'
$icon = Join-Path $resources 'app-icon.ico'
$installerDir = Join-Path $dist 'installer'
$appImageDir = Join-Path $dist 'app-image'

New-Item -ItemType Directory -Force $installerDir | Out-Null
if (Test-Path $appImageDir) { Remove-Item -Recurse -Force $appImageDir }

Write-Host "[2/4] Creating portable app-image..." -ForegroundColor Yellow
& jpackage `
  --type app-image `
  --name "Swing REST Client" `
  --input $inputDir `
  --main-jar "swing-rest-client-v5-$version.jar" `
  --main-class com.example.restclient.Main `
  --icon $icon `
  --dest $dist
if ($LASTEXITCODE -ne 0) { throw "jpackage app-image failed." }

Write-Host "[3/4] Creating Windows installer EXE..." -ForegroundColor Yellow
& jpackage `
  --type exe `
  --name "Swing REST Client" `
  --input $inputDir `
  --main-jar "swing-rest-client-v5-$version.jar" `
  --main-class com.example.restclient.Main `
  --icon $icon `
  --dest $installerDir `
  --app-version $version `
  --vendor "Example" `
  --description "Java Swing REST client" `
  --win-menu `
  --win-shortcut `
  --win-dir-chooser `
  --win-menu-group "Swing REST Client"
if ($LASTEXITCODE -ne 0) { throw "jpackage EXE creation failed." }

Write-Host "[4/4] Packaging complete." -ForegroundColor Green
Write-Host "Installer: $installerDir" -ForegroundColor Green
Write-Host "Portable:  $appImageDir" -ForegroundColor Green
