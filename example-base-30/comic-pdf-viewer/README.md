# Comic PDF Viewer

Java Swing application for browsing and reading PDF comics from:

```text
D:\comics
```

## Features

- Lists all PDF files from `D:\comics`
- Select a PDF and render its pages
- Previous / Next page
- Zoom in / Zoom out
- Fit page
- Page number indicator
- Double-click a PDF to open it
- Refresh comic list
- Uses Apache PDFBox for PDF rendering

## Requirements

- JDK 17+
- Maven 3.9+
- Windows
- Comics stored in `D:\comics`

## Run

```powershell
mvn clean compile
mvn exec:java

mvn exec:java "-Dexec.mainClass=com.comicviewer.Main"
```

Or run:

```text
com.comicviewer.Main
```

from IntelliJ IDEA.

## Change comics directory

Edit:

```java
private static final Path COMICS_DIRECTORY =
        Paths.get("D:\\comics");
```

in `ComicViewerFrame.java`.
