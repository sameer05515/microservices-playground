$source = "C:\Users\LENOVO\Downloads\question-bank.json"
$destination1 = "E:\GIT\question-bank-viewer"
$destination2 = "E:\GIT\microservices-playground\example-base-26\question-bank-viewer"

Copy-Item $source $destination1 -Force

Copy-Item $source $destination2 -Force

Write-Host "File copied successfully!"