# Java Zip / Unzip Utilities

Maven project demonstrating how to:

- Zip a complete folder recursively.
- Unzip a ZIP file into a destination folder.
- Preserve nested directories and files.
- Prevent Zip Slip path traversal.
- Use Java's built-in `java.util.zip` APIs.

## Requirements

- Java 17+
- Maven 3.8+

## Build

```bash
mvn clean package
```

## Zip a folder

```bash
mvn exec:java -Dexec.args="zip C:/data/my-folder C:/data/my-folder.zip"
```

## Unzip a ZIP file

```bash
mvn exec:java -Dexec.args="unzip C:/data/my-folder.zip C:/data/extracted"
```

## Linux/macOS examples

```bash
mvn exec:java -Dexec.args="zip /tmp/my-folder /tmp/my-folder.zip"
mvn exec:java -Dexec.args="unzip /tmp/my-folder.zip /tmp/extracted"
```

## Project Structure

```text
java-zip-unzip-utils/
├── pom.xml
├── README.md
└── src/main/java/com/prem/ziputils/
    ├── ZipUnzipApplication.java
    ├── ZipUtils.java
    └── UnzipUtils.java
```

## Main APIs

```java
Files.walk(...)
ZipOutputStream
ZipInputStream
ZipEntry
```

## Zip Slip Protection

During extraction every ZIP entry is normalized and checked to ensure it stays
inside the destination directory. Malicious entries such as:

```text
../../../../important-file.txt
```

are rejected.

## No External Dependencies

The implementation uses only the Java standard library.
