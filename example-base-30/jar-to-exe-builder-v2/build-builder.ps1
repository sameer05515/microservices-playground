$ErrorActionPreference = "Stop"
mvn clean package
Write-Host ""
Write-Host "Builder JAR created under target\"
