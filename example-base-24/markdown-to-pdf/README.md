# Markdown to PDF Converter

A Python utility to convert Markdown (`.md`) files into professionally formatted PDF documents.

The application uses:

* **Python**
* **Markdown** — Converts Markdown into HTML
* **WeasyPrint** — Converts HTML into PDF
* **MSYS2 / Pango** — Required native libraries for WeasyPrint on Windows

---

## Features

* Convert Markdown files to PDF
* A4 PDF output
* Markdown headings
* Ordered and unordered lists
* Tables
* Fenced code blocks
* Inline code
* Blockquotes
* Links
* Images
* Relative image paths
* Custom CSS styling
* Code block formatting
* Automatic output filename
* Custom output filename

---

# Project Structure

```text
markdown-to-pdf/
│
├── venv/
│
├── md_to_pdf.py
├── README.md
└── requirements.txt
```

---

# Requirements

* Python 3.10+
* pip
* MSYS2 (Windows only)

Check Python:

```powershell
python --version
```

Check pip:

```powershell
pip --version
```

---

# 1. Create Project

```powershell
mkdir markdown-to-pdf
cd markdown-to-pdf
```

---

# 2. Create Virtual Environment

```powershell
python -m venv venv
```

Activate:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then activate:

```powershell
.\venv\Scripts\Activate.ps1
```

You should see:

```text
(venv) PS>
```

---

# 3. Install Python Dependencies

```powershell
python -m pip install --upgrade pip
```

Install Markdown and WeasyPrint:

```powershell
pip install markdown weasyprint
```

Or:

```powershell
pip install -r requirements.txt
```

---

# 4. Windows: Install MSYS2

WeasyPrint requires native libraries such as **Pango** and **GObject** on Windows.

Install MSYS2 using:

```powershell
winget install MSYS2.MSYS2
```

After installation, verify:

```powershell
Test-Path "C:\msys64"
```

Expected:

```text
True
```

---

# 5. Install Pango

There are two ways to open the MSYS2 UCRT64 terminal.

## Option 1: Start Menu

Open Windows Start Menu and search:

```text
MSYS2 UCRT64
```

Open the **MSYS2 UCRT64** terminal.

Do not run:

```powershell
MSYS2 UCRT64
```

from PowerShell. It is a terminal/application, not a PowerShell command.

---

## Option 2: Start from PowerShell

If this file exists:

```text
C:\msys64\ucrt64.exe
```

run:

```powershell
Start-Process "C:\msys64\ucrt64.exe"
```

This opens the MSYS2 UCRT64 terminal.

---

# 6. Update MSYS2

Inside the **MSYS2 UCRT64** terminal:

```bash
pacman -Syu
```

If MSYS2 asks you to close/restart the terminal, close it.

Open **MSYS2 UCRT64** again and run:

```bash
pacman -Syu
```

---

# 7. Install Pango

Inside the MSYS2 UCRT64 terminal:

```bash
pacman -S mingw-w64-ucrt-x86_64-pango
```

Confirm the installation when prompted.

---

# 8. Verify Pango DLL

Return to PowerShell.

Run:

```powershell
Test-Path "C:\msys64\ucrt64\bin\libgobject-2.0-0.dll"
```

Expected:

```text
True
```

You can also check Pango:

```powershell
Test-Path "C:\msys64\ucrt64\bin\libpango-1.0-0.dll"
```

Expected:

```text
True
```

---

# 9. Configure WeasyPrint

Set the DLL directory for the current PowerShell session:

```powershell
$env:WEASYPRINT_DLL_DIRECTORIES="C:\msys64\ucrt64\bin"
```

Verify:

```powershell
$env:WEASYPRINT_DLL_DIRECTORIES
```

Expected:

```text
C:\msys64\ucrt64\bin
```

---

# 10. Configure Permanently

To avoid setting the environment variable every time, execute:

```powershell
[Environment]::SetEnvironmentVariable(
    "WEASYPRINT_DLL_DIRECTORIES",
    "C:\msys64\ucrt64\bin",
    "User"
)
```

Close PowerShell.

Open a new PowerShell window.

Activate the virtual environment again:

```powershell
cd E:\GIT\microservices-playground\example-base-24\markdown-to-pdf

.\venv\Scripts\Activate.ps1
```

Check:

```powershell
$env:WEASYPRINT_DLL_DIRECTORIES
```

Expected:

```text
C:\msys64\ucrt64\bin
```

---

# 11. Test WeasyPrint

Run:

```powershell
python -m weasyprint --info
```

If everything is correctly configured, WeasyPrint information should be displayed without an import error.

You can also test the Python module:

```powershell
python -c "from weasyprint import HTML; print('WeasyPrint OK')"
```

Expected:

```text
WeasyPrint OK
```

---

# 12. Generate PDF

The application accepts:

```text
python md_to_pdf.py <input.md>
```

Example:

```powershell
python md_to_pdf.py README.md
```

This generates:

```text
README.pdf
```

---

# 13. Specify Output PDF

You can also specify the output filename:

```powershell
python md_to_pdf.py README.md documentation.pdf
```

Output:

```text
documentation.pdf
```

---

# 14. Complete Windows Setup

For a new machine, follow these steps.

## Create project

```powershell
mkdir markdown-to-pdf
cd markdown-to-pdf
```

## Create virtual environment

```powershell
python -m venv venv
```

## Activate environment

```powershell
.\venv\Scripts\Activate.ps1
```

## Install Python dependencies

```powershell
python -m pip install --upgrade pip
pip install markdown weasyprint
```

## Install MSYS2

```powershell
winget install MSYS2.MSYS2
```

## Open MSYS2 UCRT64

```powershell
Start-Process "C:\msys64\ucrt64.exe"
```

Inside MSYS2:

```bash
pacman -Syu
```

Restart MSYS2 UCRT64 if requested.

Then:

```bash
pacman -Syu
```

Install Pango:

```bash
pacman -S mingw-w64-ucrt-x86_64-pango
```

## Configure DLL directory

Back in PowerShell:

```powershell
[Environment]::SetEnvironmentVariable(
    "WEASYPRINT_DLL_DIRECTORIES",
    "C:\msys64\ucrt64\bin",
    "User"
)
```

Restart PowerShell.

## Activate virtual environment

```powershell
cd E:\GIT\microservices-playground\example-base-24\markdown-to-pdf

.\venv\Scripts\Activate.ps1
```

## Test

```powershell
python -c "from weasyprint import HTML; print('WeasyPrint OK')"
```

## Generate PDF

```powershell
python md_to_pdf.py README.md
```

---

# 15. Markdown Example

Create:

```text
sample.md
```

Example content:

````markdown
# Sample Document

This is a Markdown document.

## Features

- Markdown
- Python
- WeasyPrint
- PDF generation

## Java Example

```java
public class HelloWorld {

    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
````

## Table

| Name  | Age | City   |
| ----- | --- | ------ |
| Prem  | 30  | Delhi  |
| John  | 35  | Mumbai |
| David | 28  | Pune   |

## Quote

> This is a sample blockquote.

## Link

[Python](https://www.python.org)

## Image

![Architecture](images/architecture.png)

````

Generate:

```powershell
python md_to_pdf.py sample.md
````

Output:

```text
sample.pdf
```

---

# 16. Images

Images can be referenced using relative paths.

Example:

```markdown
![Architecture](images/architecture.png)
```

Project:

```text
markdown-to-pdf/
│
├── md_to_pdf.py
├── sample.md
│
└── images/
    └── architecture.png
```

The application uses the Markdown file's parent directory as the base URL, allowing relative images to be resolved.

---

# 17. Supported Markdown

The application uses these Markdown extensions:

```python
extensions=[
    "extra",
    "tables",
    "fenced_code",
    "toc",
    "sane_lists"
]
```

Supported features include:

### Headings

```markdown
# Heading 1

## Heading 2

### Heading 3
```

### Bold

```markdown
**Bold text**
```

### Italic

```markdown
*Italic text*
```

### Lists

```markdown
- Item 1
- Item 2
- Item 3
```

### Ordered Lists

```markdown
1. First
2. Second
3. Third
```

### Inline Code

```markdown
Use `System.out.println()` to print output.
```

### Code Blocks

````markdown
```java
System.out.println("Hello");
```
````

### Tables

```markdown
| Name | Age |
|------|-----|
| Prem | 30 |
| John | 35 |
```

### Blockquotes

```markdown
> This is a blockquote.
```

### Links

```markdown
[Python](https://www.python.org)
```

### Images

```markdown
![Image](images/example.png)
```

---

# 18. PDF Styling

The generated PDF uses CSS for formatting.

Default configuration:

```text
Page Size : A4
Font      : Arial / Helvetica
Margins   : 20mm top/bottom
            18mm left/right
```

The stylesheet provides formatting for:

* Headings
* Paragraphs
* Lists
* Tables
* Code blocks
* Inline code
* Blockquotes
* Images
* Links

---

# 19. Troubleshooting

## Error: libgobject-2.0-0 could not be loaded

Example:

```text
OSError: cannot load library 'libgobject-2.0-0'
```

Check:

```powershell
Test-Path "C:\msys64\ucrt64\bin\libgobject-2.0-0.dll"
```

If:

```text
False
```

install Pango from MSYS2 UCRT64:

```bash
pacman -S mingw-w64-ucrt-x86_64-pango
```

Then check again:

```powershell
Test-Path "C:\msys64\ucrt64\bin\libgobject-2.0-0.dll"
```

---

## Error: pacman is not recognized

Do not run:

```powershell
pacman -Syu
```

from PowerShell.

`pacman` belongs to MSYS2.

Open:

```text
MSYS2 UCRT64
```

Then run:

```bash
pacman -Syu
```

Alternatively:

```powershell
C:\msys64\usr\bin\pacman.exe -Syu
```

---

## MSYS2 UCRT64 does not open

Check:

```powershell
Test-Path "C:\msys64\ucrt64.exe"
```

If:

```text
True
```

run:

```powershell
Start-Process "C:\msys64\ucrt64.exe"
```

---

## Check DLL directory

```powershell
$env:WEASYPRINT_DLL_DIRECTORIES
```

Expected:

```text
C:\msys64\ucrt64\bin
```

If empty:

```powershell
$env:WEASYPRINT_DLL_DIRECTORIES="C:\msys64\ucrt64\bin"
```

---

## Check WeasyPrint

```powershell
python -m weasyprint --info
```

And:

```powershell
python -c "from weasyprint import HTML; print('WeasyPrint OK')"
```

---

# 20. Deactivate Virtual Environment

```powershell
deactivate
```

---

# 21. Recreate Virtual Environment

If the `venv` directory is deleted:

```powershell
python -m venv venv
```

Activate:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

The MSYS2 installation does **not** need to be repeated if it is already installed.

---

# 22. Requirements

Example `requirements.txt`:

```text
Markdown
WeasyPrint
```

Install:

```powershell
pip install -r requirements.txt
```

---

# 23. Application Flow

```text
             README.md
                 |
                 v
        +----------------+
        | Python Markdown |
        +----------------+
                 |
                 v
               HTML
                 |
                 v
        +----------------+
        |   WeasyPrint   |
        +----------------+
                 |
                 v
                PDF
```

On Windows, WeasyPrint uses native libraries:

```text
WeasyPrint
    |
    +-- Pango
    |
    +-- GObject
    |
    +-- Other native libraries
    |
    +-- MSYS2
```

---

# 24. Future Enhancements

Possible enhancements:

* Syntax highlighting
* Automatic table of contents
* Page numbers
* Header and footer
* Cover page
* Custom fonts
* Custom themes
* PDF metadata
* Clickable table of contents
* Mermaid diagram support
* PlantUML support
* Command-line options
* Custom page size
* Custom margins
* PDF bookmarks
* Multiple Markdown files
* Directory-to-PDF conversion

---

# License

This project is provided for learning and personal use.

Feel free to modify and extend the project according to your requirements.
