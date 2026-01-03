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

## FileFolderCounter

The first utility recursively counts:

- Files at all levels
- Subfolders at all levels
- Excludes `.git`
- Excludes `.node_modules`
- Does not count the supplied root folder
- Does not traverse excluded folders

### Configure the folder

Edit:

```java
Path rootPath = Paths.get("C:\\Users\\Prem\\Documents");
```

### Run

```bash
mvn clean compile
```

```bash
java -cp target/classes com.prem.utils.FileFolderCounter
```

### Example

```text
Skipping: C:\Projects\project1\.git
Skipping: C:\Projects\project2\.node_modules

Root Folder : C:\Projects
Folders     : 15
Files       : 120
Total Items : 135
```

## Adding More Utilities

Future classes can be added under:

```text
src/main/java/com/prem/utils/
```

Each class can have its own `main()` method.

Possible next utilities:

- FileExtensionCounter
- LargestFileFinder
- DuplicateFileFinder
- EmptyFolderFinder
- EmptyFileFinder
- DirectoryTreePrinter
- FileSearch
- FileSizeCalculator
