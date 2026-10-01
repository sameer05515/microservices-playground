# Swing JSON Viewer

A Java 17 Swing application that consumes `data.json` using Jackson.

## Features

- Loads bundled `src/main/resources/data.json` on startup
- Open another JSON file at runtime
- Displays Companies
- Filters Projects by selected Company
- Displays project metadata and matching `projectDetails`
- Shows long Markdown/text descriptions in a read-only viewer
- Maven build with executable shaded JAR

## Run from IntelliJ

1. Open the project as a Maven project.
2. Ensure JDK 17+ is configured.
3. Run `com.example.jsonviewer.Main`.

## Run from command line

```powershell
mvn clean package
java -jar target/swing-json-viewer-1.0.0.jar
```

Or:

```powershell
mvn exec:java
```

## JSON structure supported

The current application consumes the uploaded JSON structure with these top-level arrays:

```text
companies
projects
projectDetails
```

Projects are associated to companies through `companyId`, and project details are associated through `projectId`.
