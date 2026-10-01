# Build the Windows EXE (requires JDK 17+ with jpackage and WiX for installer EXE on some JDK distributions)
mvn clean package
jpackage `
  --type app-image `
  --name "JSON Data Viewer" `
  --input target `
  --main-jar swing-json-viewer-v2-2.0.0.jar `
  --main-class com.example.jsonviewer.Main `
  --icon src/main/resources/app-icon.ico `
  --win-menu `
  --win-shortcut
