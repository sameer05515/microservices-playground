# Java File Folder Utils

A simple Maven project containing independent Java command-line utilities for working with files and folders using Java NIO.

The purpose of this project is to practice:

* Java NIO
* `Path`
* `Paths`
* `Files`
* `FileVisitor`
* `SimpleFileVisitor`
* Directory traversal
* File searching
* File hashing
* File size calculation
* Java Collections
* Java Streams
* Command-line arguments

---

## Requirements

* Java 17+
* Maven 3.8+

Check Java:

```bash
java -version
```

Check Maven:

```bash
mvn -version
```

---

## Project Structure

```text
java-file-folder-utils/
│
├── pom.xml
├── README.md
│
└── src/
    └── main/
        └── java/
            └── com/
                └── prem/
                    └── utils/
                        │
                        ├── FileUtils.java
                        ├── FileFolderCounter.java
                        ├── FileExtensionCounter.java
                        ├── LargestFileFinder.java
                        ├── DuplicateFileFinder.java
                        ├── EmptyFolderFinder.java
                        ├── EmptyFileFinder.java
                        ├── DirectoryTreePrinter.java
                        ├── FileSearch.java
                        └── FileSizeCalculator.java
```

---

# Build the Project

Open a command prompt in the project root:

```bash
cd java-file-folder-utils
```

Run:

```bash
mvn clean compile
```

After successful compilation:

```text
[INFO] BUILD SUCCESS
```

Compiled classes will be available under:

```text
target/classes/
```

---

# Common Configuration

All utilities exclude the following directories:

```text
.git
.node_modules
node_modules
```

These directories are:

* Not counted
* Not searched
* Not traversed

The common configuration is maintained in:

```text
FileUtils.java
```

```java
public static final Set<String> EXCLUDED_FOLDERS =
        Set.of(".git", ".node_modules", "node_modules");
```

---

# 1. FileFolderCounter

Counts all files and subfolders recursively.

The supplied root folder itself is not included in the folder count.

## Run

```bash
java -cp target/classes com.prem.utils.FileFolderCounter "D:\Projects"
```

Example:

```text
Root Folder : D:\Projects
Folders     : 125
Files       : 2450
Total Items : 2575
```

## What it demonstrates

```java
Files.walkFileTree(...)
SimpleFileVisitor
FileVisitResult
preVisitDirectory()
visitFile()
```

---

# 2. FileExtensionCounter

Counts files based on their file extension.

## Run

```bash
java -cp target/classes com.prem.utils.FileExtensionCounter "D:\Projects"
```

Example:

```text
class                120
css                  45
html                 30
java                 850
json                 120
js                   230
md                   75
xml                  180
[no extension]       12
```

## What it demonstrates

```java
Map
TreeMap
String manipulation
File extension extraction
Map.merge()
```

---

# 3. LargestFileFinder

Finds the largest file recursively.

## Run

```bash
java -cp target/classes com.prem.utils.LargestFileFinder "D:\Projects"
```

Example:

```text
Largest File : D:\Projects\backup\data.zip
Size         : 1.82 GB
```

## What it demonstrates

```java
Files.size()
File traversal
Comparison
Finding maximum value
```

---

# 4. DuplicateFileFinder

Finds duplicate files based on their content.

The implementation first uses:

```text
File Size
```

and then:

```text
SHA-256
```

This avoids calculating hashes for files that have different sizes.

## Run

```bash
java -cp target/classes com.prem.utils.DuplicateFileFinder "D:\Projects"
```

Example:

```text
Duplicate Group 1:
  D:\Projects\a\test.txt
  D:\Projects\b\test-copy.txt

Duplicate Group 2:
  D:\Projects\images\logo.png
  D:\Projects\backup\logo.png
```

## What it demonstrates

```java
MessageDigest
SHA-256
InputStream
HashMap
File hashing
Duplicate detection
```

---

# 5. EmptyFolderFinder

Finds folders that contain no files or subfolders.

## Run

```bash
java -cp target/classes com.prem.utils.EmptyFolderFinder "D:\Projects"
```

Example:

```text
D:\Projects\project1\temp
D:\Projects\project2\empty
D:\Projects\backup\old
```

## What it demonstrates

```java
DirectoryStream
Files.newDirectoryStream()
postVisitDirectory()
Directory traversal
```

---

# 6. EmptyFileFinder

Finds files whose size is zero bytes.

## Run

```bash
java -cp target/classes com.prem.utils.EmptyFileFinder "D:\Projects"
```

Example:

```text
D:\Projects\test.txt
D:\Projects\src\main\resources\application.properties
D:\Projects\temp\data.json
```

## What it demonstrates

```java
Files.size()
FileVisitor
Zero-byte file detection
```

---

# 7. DirectoryTreePrinter

Prints the directory structure as a tree.

## Run

```bash
java -cp target/classes com.prem.utils.DirectoryTreePrinter "D:\Projects"
```

Example:

```text
D:\Projects
├── project1
│   ├── src
│   │   ├── main
│   │   │   └── App.java
│   │   └── test
│   │       └── AppTest.java
│   └── README.md
│
├── project2
│   ├── src
│   └── pom.xml
│
└── README.md
```

Excluded directories such as:

```text
.git
node_modules
.node_modules
```

are not printed.

## What it demonstrates

```java
DirectoryStream
Recursion
Path
Sorting
Tree representation
```

---

# 8. FileSearch

Searches for files using a filename or glob pattern.

## Search for Java files

```bash
java -cp target/classes com.prem.utils.FileSearch "D:\Projects" "*.java"
```

## Search for JSON files

```bash
java -cp target/classes com.prem.utils.FileSearch "D:\Projects" "*.json"
```

## Search for XML files

```bash
java -cp target/classes com.prem.utils.FileSearch "D:\Projects" "*.xml"
```

## Search for a specific file

```bash
java -cp target/classes com.prem.utils.FileSearch "D:\Projects" "pom.xml"
```

Example output:

```text
D:\Projects\project1\src\main\App.java
D:\Projects\project2\src\main\App.java
D:\Projects\project3\src\test\AppTest.java
```

## What it demonstrates

```java
PathMatcher
FileSystem.getPathMatcher()
glob patterns
FileVisitor
```

---

# 9. FileSizeCalculator

Calculates the total size of all files under a directory.

Excluded directories are ignored.

## Run

```bash
java -cp target/classes com.prem.utils.FileSizeCalculator "D:\Projects"
```

Example:

```text
Root Folder : D:\Projects
Files       : 2450
Total Size  : 3.72 GB
```

## What it demonstrates

```java
Files.size()
FileVisitor
Recursive traversal
Byte calculation
Unit conversion
```

---

# Running All Utilities

After:

```bash
mvn clean compile
```

you can run the utilities independently.

```bash
java -cp target/classes com.prem.utils.FileFolderCounter "D:\Projects"
```

```bash
java -cp target/classes com.prem.utils.FileExtensionCounter "D:\Projects"
```

```bash
java -cp target/classes com.prem.utils.LargestFileFinder "D:\Projects"
```

```bash
java -cp target/classes com.prem.utils.DuplicateFileFinder "D:\Projects"
```

```bash
java -cp target/classes com.prem.utils.EmptyFolderFinder "D:\Projects"
```

```bash
java -cp target/classes com.prem.utils.EmptyFileFinder "D:\Projects"
```

```bash
java -cp target/classes com.prem.utils.DirectoryTreePrinter "D:\Projects"
```

```bash
java -cp target/classes com.prem.utils.FileSearch "D:\Projects" "*.java"
```

```bash
java -cp target/classes com.prem.utils.FileSizeCalculator "D:\Projects"
```

---

# Command-Line Arguments

Most utilities accept:

```text
<folder-path>
```

Example:

```bash
java -cp target/classes com.prem.utils.FileFolderCounter "E:\GIT\microservices-playground"
```

`FileSearch` accepts two arguments:

```text
<folder-path> <file-name-or-glob>
```

Example:

```bash
java -cp target/classes com.prem.utils.FileSearch "E:\GIT\microservices-playground" "*.java"
```

---

# Java NIO APIs Used

This project provides practice with the following APIs:

```java
java.nio.file.Path
java.nio.file.Paths
java.nio.file.Files
java.nio.file.FileVisitor
java.nio.file.SimpleFileVisitor
java.nio.file.FileVisitResult
java.nio.file.DirectoryStream
java.nio.file.PathMatcher
```

---

# Learning Progression

Recommended order for studying the project:

```text
1. FileFolderCounter
        ↓
2. FileExtensionCounter
        ↓
3. FileSearch
        ↓
4. EmptyFileFinder
        ↓
5. EmptyFolderFinder
        ↓
6. FileSizeCalculator
        ↓
7. LargestFileFinder
        ↓
8. DirectoryTreePrinter
        ↓
9. DuplicateFileFinder
```

The complexity gradually increases from basic file traversal to hashing and duplicate detection.

---

# Future Improvements

Possible enhancements for this project:

```text
- Command-line option parsing
- Configurable excluded folders
- Case-sensitive / case-insensitive search
- File size filtering
- File date filtering
- Modified-date search
- File type filtering
- CSV report generation
- JSON report generation
- Progress reporting
- Multithreaded file scanning
- Parallel duplicate detection
- File checksum utility
- Directory size calculator
- File statistics report
- Interactive CLI
```

---

# Goal of the Project

This project is intentionally kept simple.

Each utility has its own:

```java
public static void main(String[] args)
```

so that every class can be executed independently from the command line.

The project can later evolve into a more production-oriented Java CLI application while continuing to demonstrate Java Core, NIO, Collections, Streams, concurrency, and performance concepts.
