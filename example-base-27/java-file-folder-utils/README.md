# Java File Folder Utils

Simple Maven project for practicing Java file and folder operations using `java.nio.file`.

## Requirements

- Java 17+
- Maven 3.8+

## Project Structure

```text
java-file-folder-utils/
├── pom.xml
├── README.md
└── src/
    └── main/
        └── java/
            └── com/
                └── prem/
                    └── utils/
                        └── FileFolderCounter.java
```

## Run

Update the folder path in `FileFolderCounter.java`:

```java
Path rootPath = Paths.get("C:\Users\Prem\Documents");
```

Compile:

```bash
mvn clean compile
```

Run:

```bash
java -cp target/classes com.prem.utils.FileFolderCounter
```

## What it does

- Recursively scans the supplied folder.
- Counts directories.
- Counts regular files.
- Prints total items.
- Includes the root directory in the folder count.

## Example

```text
Root Folder : C:\Projects
Folders     : 12
Files       : 85
Total Items : 97
```

## Future Exercises

We can add more independent classes, each with its own `main()` method:

- FileExtensionCounter
- LargestFileFinder
- DuplicateFileFinder
- EmptyFolderFinder
- EmptyFileFinder
- DirectoryTreePrinter
- FileSearch
- FileSizeCalculator
