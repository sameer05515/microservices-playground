$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

& mvn clean package
if ($LASTEXITCODE -ne 0) { throw "Maven build failed." }

$version = '5.0.0'
$dist = Join-Path $ProjectRoot 'dist'
New-Item -ItemType Directory -Force $dist | Out-Null

& jpackage `
  --type app-image `
  --name "Swing REST Client" `
  --input (Join-Path $ProjectRoot 'target') `
  --main-jar "swing-rest-client-v5-$version.jar" `
  --main-class com.example.restclient.Main `
  --icon (Join-Path $ProjectRoot 'src\main\resources\app-icon.ico') `
  --dest $dist

if ($LASTEXITCODE -ne 0) { throw "jpackage app-image failed." }
Write-Host "Portable application created under: $dist\Swing REST Client" -ForegroundColor Green
