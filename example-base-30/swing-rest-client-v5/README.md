# Swing REST Client V5

A developer-focused Postman-style REST client built with Java 17+ and Swing.

V5 keeps the V4 developer tools and adds a repeatable Windows packaging workflow using **jpackage**.

## Features

### REST
- GET / POST / PUT / PATCH / DELETE
- Query parameters
- Headers
- JSON request body
- Pretty JSON / Raw response
- Request history
- Saved collections
- Import/export collections
- Environment variables
- Dark theme
- Custom application icon

### Authentication / Developer Tools
- No Auth
- Bearer Token
- Basic Auth
- OAuth2 Bearer Token
- OAuth2 Authorization Code + PKCE helper
- JWT Decoder
- cURL helper
- WebSocket client

## Requirements

- JDK 17 or newer
- Maven 3.9+
- Windows 10/11 for `.exe` packaging
- `java`, `mvn` and `jpackage` available on PATH

Check:

```powershell
java -version
mvn -version
jpackage --version
```

## Run from source

```powershell
mvn clean compile
mvn exec:java
```

## Build JAR

```powershell
mvn clean package
java -jar target\swing-rest-client-v5-5.0.0.jar
```

## Windows EXE — one command

Recommended:

```powershell
.\package-windows.bat
```

Or directly from PowerShell:

```powershell
.\scripts\package-windows.ps1
```

The script performs:

1. `mvn clean package`
2. Creates a portable `jpackage` app-image
3. Creates a Windows installer `.exe`
4. Places the results under `dist\`

Expected structure:

```text
dist\
├── Swing REST Client\              # portable app-image
│   └── Swing REST Client.exe
└── installer\
    └── Swing REST Client-5.0.0.exe
```

The packaged application contains its own Java runtime, so the end user's machine does not need Java installed separately.

## Portable application only

```powershell
.\scripts\package-app-image.ps1
```

Then run:

```powershell
dist\Swing REST Client\Swing REST Client.exe
```

## Manual jpackage command

```powershell
mvn clean package

jpackage `
  --type exe `
  --name "Swing REST Client" `
  --input target `
  --main-jar swing-rest-client-v5-5.0.0.jar `
  --main-class com.example.restclient.Main `
  --icon src\main\resources\app-icon.ico `
  --dest dist\installer `
  --app-version 5.0.0 `
  --vendor "Example" `
  --description "Java Swing REST client" `
  --win-menu `
  --win-shortcut `
  --win-dir-chooser `
  --win-menu-group "Swing REST Client"
```

## Important

`jpackage --type exe` creates a Windows installer. It is intended to be run on Windows. For Windows packaging, use a Windows JDK environment rather than a Linux/macOS build machine.
