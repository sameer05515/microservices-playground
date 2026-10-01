# JAR → EXE Builder V2

A Java 17 Swing GUI wrapper around `jpackage`.

## V2 features

- JAR file selection
- Automatic Main-Class detection from JAR manifest
- Application name
- Application version
- Windows `.ico` selection
- Output directory selection
- Windows Installer (`.exe`) mode
- Portable `app-image` mode
- Start Menu shortcut
- Desktop shortcut
- Per-user installation option
- Custom install directory
- Prerequisite checker for:
  - JDK
  - jpackage
  - WiX Toolset
  - selected JAR
- Generated `jpackage` command preview
- Copy command to clipboard
- Live build log
- Open output folder
- Uses the supplied application icon in `src/main/resources/app-icon.ico`

## Requirements

- Windows 10/11
- JDK 17 or newer
- `jpackage` available on PATH
- WiX Toolset available on PATH when creating a Windows `.exe` installer.
  WiX 3 (`candle.exe` + `light.exe`) or WiX 4+ (`wix.exe`) can be detected.

## Run

```powershell
mvn clean compile
mvn exec:java
```

## Build the Builder itself

```powershell
mvn clean package
java -jar target/jar-to-exe-builder-v2-2.0.0.jar
```

## Typical workflow

1. Start JAR → EXE Builder.
2. Select your executable JAR.
3. Click `Detect` to read `Main-Class`.
4. Select `.ico`.
5. Select `Windows Installer (.exe)`.
6. Set output folder.
7. Check prerequisites.
8. Click `Build Package`.

The GUI launches `jpackage` directly; it does not invoke PowerShell.

## Note about WiX

If `jpackage` reports:

`No usable WiX Toolset installation found`

install WiX and make sure its executable directory is available through PATH, then restart the Builder and click `Check Prerequisites`.
