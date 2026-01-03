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

Recursively counts files and subfolders under a supplied directory.

The utility:

- Counts files at all levels.
- Counts subfolders at all levels.
- Does not count the supplied root folder.
- Excludes `.git`.
- Excludes `.node_modules`.
- Does not traverse excluded folders.
- Accepts the folder path as a command-line argument.

## Build

From the project root:

```bash
mvn clean compile
```

## Run

### Windows

```powershell
java -cp target/classes com.prem.utils.FileFolderCounter "D:\Projects"
```

### Linux / macOS

```bash
java -cp target/classes com.prem.utils.FileFolderCounter "/home/prem/projects"
```

## No Argument

If no folder path is supplied:

```bash
java -cp target/classes com.prem.utils.FileFolderCounter
```

Output:

```text
Usage:
java -cp target/classes com.prem.utils.FileFolderCounter <folder-path>

Example:
java -cp target/classes com.prem.utils.FileFolderCounter "D:\Projects"
```

## Example Output

```text
Skipping: D:\Projects\project1\.git
Skipping: D:\Projects\project2\.node_modules

Root Folder : D:\Projects
Folders     : 15
Files       : 120
Total Items : 135
```

## Future Utilities

Each utility will be an independent Java class with its own `main()` method.

Possible next classes:

- FileExtensionCounter
- LargestFileFinder
- DuplicateFileFinder
- EmptyFolderFinder
- EmptyFileFinder
- DirectoryTreePrinter
- FileSearch
- FileSizeCalculator
