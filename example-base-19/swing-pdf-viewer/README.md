# Swing PDF Viewer

A Maven-based Java Swing application for viewing PDF files. Lists all PDFs from a specified folder and displays the selected PDF with page navigation.

## Features

- ✅ **PDF List** - Automatically lists all PDF files from a folder (default: `D:\Prem\comics`)
- ✅ **PDF Display** - Renders and displays selected PDF pages
- ✅ **Page Navigation** - Previous/Next page buttons
- ✅ **Page Counter** - Shows current page and total pages
- ✅ **Folder Selection** - Change the folder to scan for PDFs
- ✅ **Refresh** - Reload PDF list from current folder
- ✅ **Zoom Support** - Automatic scaling to fit panel
- ✅ **Clean GUI** - Split-pane layout with file list and viewer

## Prerequisites

- Java 17 or higher
- Maven 3.6+ (or use Maven wrapper)
- PDF files in a folder (default: `D:\Prem\comics`)

## Project Structure

```
swing-pdf-viewer/
├── pom.xml
├── README.md
└── src/
    └── main/
        └── java/
            └── com/
                └── example/
                    └── swing/
                        └── PDFViewerApp.java
```

## Building the Project

```bash
cd example-base-19/swing-pdf-viewer
mvn clean compile
```

## Running the Application

### Option 1: Using Maven Exec Plugin

```bash
cd example-base-19/swing-pdf-viewer
mvn exec:java
```

### Option 2: Build JAR and Run

```bash
# Build the JAR
mvn clean package

# Run the JAR
java -jar target/swing-pdf-viewer-1.0.0.jar
```

### Option 3: Run from IDE

Run the `PDFViewerApp` class directly from your IDE (main method is in `src/main/java/com/example/swing/PDFViewerApp.java`).

## Usage

1. **Default Folder**: The application starts by scanning `D:\Prem\comics` for PDF files
2. **View PDF**: Click on any PDF in the left panel to view it
3. **Navigate Pages**: Use "◀ Previous" and "Next ▶" buttons to navigate pages
4. **Change Folder**: Click "Change Folder" to select a different folder containing PDFs
5. **Refresh**: Click "Refresh" to reload the PDF list from the current folder

## Controls

- **PDF List (Left Panel)** - Shows all PDF files in the selected folder
- **PDF Viewer (Center Panel)** - Displays the selected PDF page
- **◀ Previous** - Go to previous page
- **Next ▶** - Go to next page
- **Page Counter** - Shows "Page: X / Y" (current page / total pages)
- **Refresh** - Reload PDF list from current folder
- **Change Folder** - Select a different folder to scan for PDFs

## Default Folder

The application is configured to scan `D:\Prem\comics` by default. You can:
- Change the folder using the "Change Folder" button
- Modify the `PDF_FOLDER` constant in `PDFViewerApp.java` to set a different default

## Dependencies

- **Apache PDFBox 3.0.3** - PDF rendering and manipulation library
- **PDFBox Tools 3.0.3** - Additional PDFBox utilities
- **Java Swing** - GUI framework (built-in)

## Troubleshooting

### ClassNotFoundException

If you encounter `ClassNotFoundException`, make sure:
1. You're in the correct directory: `example-base-19/swing-pdf-viewer`
2. The project has been compiled: `mvn clean compile`
3. You're using the correct command: `mvn exec:java`

### Folder Not Found

If the default folder `D:\Prem\comics` doesn't exist:
- The application will show a warning
- Use the "Change Folder" button to select a valid folder
- Or modify the `PDF_FOLDER` constant in the code

### PDF Not Displaying

- Ensure the PDF file is not corrupted
- Check that the file is a valid PDF format
- Verify file permissions allow reading
- Some encrypted PDFs may not display (password-protected)

### Out of Memory Errors

For very large PDF files:
- Increase JVM heap size: `java -Xmx2g -jar target/swing-pdf-viewer-1.0.0.jar`
- Or use: `mvn exec:java -Dexec.jvmArgs="-Xmx2g"`

### Performance Issues

- Large PDF files may take time to render
- High-resolution PDFs may render slowly
- Consider closing the application properly to free resources

## Customization

### Change Default Folder

Edit `PDFViewerApp.java` and modify the constant:

```java
private static final String PDF_FOLDER = "D:\\Prem\\comics";
```

Change to your desired folder path.

### Adjust Rendering DPI

In the `paintComponent` method, change the DPI value:

```java
BufferedImage image = pdfRenderer.renderImageWithDPI(currentPage, 150);
```

Higher DPI (e.g., 200) = better quality but slower rendering
Lower DPI (e.g., 100) = faster rendering but lower quality

## Notes

- The application uses Apache PDFBox for PDF rendering
- PDFs are rendered at 150 DPI by default
- Images are automatically scaled to fit the display panel
- The application maintains aspect ratio when scaling
- All PDFs are sorted alphabetically by filename

## Technical Details

- **Rendering**: Uses PDFBox PDFRenderer with 150 DPI
- **Scaling**: Automatic scaling to fit panel while maintaining aspect ratio
- **Memory**: Each page is rendered as a BufferedImage
- **Threading**: All operations run on the Event Dispatch Thread (EDT)

