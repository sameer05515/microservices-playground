# JAR → EXE Packaging Studio V3

V3 turns the basic JAR-to-EXE wrapper into a small Java packaging studio.

## Features

- JAR selection
- Main-Class auto detection
- Application name/version
- ICO icon
- Output directory
- Windows EXE installer
- Portable app-image
- Start Menu / Desktop / per-user options
- Custom install directory
- Custom runtime/JRE image via `--runtime-image`
- JVM `--java-options`
- Resource list UI
- Environment variable list UI
- Build + Launch workflow
- Live build log
- Generated command preview
- Copy command
- Save/load packaging profiles as JSON
- New profile
- Prerequisite check for Java, jpackage and WiX

## Run

```powershell
mvn clean compile
mvn exec:java
```

Build the builder:

```powershell
mvn clean package
java -jar target/jar-to-exe-builder-v3-3.0.0.jar
```

## Windows EXE requirements

- JDK 17+
- `jpackage` on PATH
- WiX Toolset available on PATH for `.exe` installer generation

## Important

The V3 Resources and Environment tabs provide configuration storage/UI. The generated command currently wires the JVM options and runtime image directly into `jpackage`; arbitrary resource/environment entries are preserved in the UI/profile for the next packaging expansion.

