# ============================================================
# Question Bank - File Copy Script
# ============================================================

# Source file
$sourceFile = "C:\Users\LENOVO\Downloads\question-bank.json"

# Destination folders
$destinationFolders = @(
    "E:\GIT\question-bank-viewer",
    "E:\GIT\microservices-playground\example-base-26\question-bank-viewer"
)

# Validate source file
if (-not (Test-Path -Path $sourceFile -PathType Leaf)) {
    Write-Error "Source file not found: $sourceFile"
    exit 1
}

# Copy file to each destination
foreach ($destinationFolder in $destinationFolders) {

    Copy-Item `
        -Path $sourceFile `
        -Destination $destinationFolder `
        -Force

    Write-Host "Copied successfully to: $destinationFolder"
}

Write-Host ""
Write-Host "File copy operation completed successfully!"