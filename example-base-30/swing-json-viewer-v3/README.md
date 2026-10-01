# Swing JSON Viewer V3

V3 adds a custom JSON Viewer application icon and applies it to the Swing window.

## Run

```powershell
mvn clean compile
mvn exec:java
```

## Package JAR

```powershell
mvn clean package
java -jar target/swing-json-viewer-v2-2.0.0.jar
```

## Windows application

The repository includes `app-icon.png`, `app-icon.ico`, and `package-windows.ps1` for `jpackage` packaging.

```powershell
./package-windows.ps1
```
