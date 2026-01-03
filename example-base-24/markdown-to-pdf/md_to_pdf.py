import sys
from pathlib import Path

import markdown
from weasyprint import HTML


def markdown_to_pdf(md_file, pdf_file):
    md_path = Path(md_file)
    pdf_path = Path(pdf_file)

    if not md_path.exists():
        raise FileNotFoundError(f"Markdown file not found: {md_path}")

    markdown_text = md_path.read_text(encoding="utf-8")

    html_body = markdown.markdown(
        markdown_text,
        extensions=[
            "extra",
            "tables",
            "fenced_code",
            "toc",
            "sane_lists"
        ]
    )

    html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <style>
        @page {{
            size: A4;
            margin: 20mm 18mm 20mm 18mm;
        }}

        body {{
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #222;
        }}

        h1 {{
            font-size: 24pt;
            margin-top: 0;
            margin-bottom: 20px;
        }}

        h2 {{
            font-size: 18pt;
            margin-top: 30px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }}

        h3 {{
            font-size: 14pt;
            margin-top: 25px;
        }}

        p {{
            margin: 10px 0;
        }}

        code {{
            font-family: "Courier New", monospace;
            background: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
        }}

        pre {{
            background: #f5f5f5;
            padding: 12px;
            border-radius: 5px;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            font-family: "Courier New", monospace;
            font-size: 9pt;
        }}

        blockquote {{
            border-left: 4px solid #999;
            margin: 15px 0;
            padding-left: 15px;
            color: #555;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 9pt;
        }}

        th, td {{
            border: 1px solid #ccc;
            padding: 7px;
            text-align: left;
        }}

        th {{
            background: #eee;
        }}

        img {{
            max-width: 100%;
            height: auto;
        }}

        a {{
            color: #1565c0;
            text-decoration: none;
        }}

        ul, ol {{
            margin-top: 5px;
            margin-bottom: 10px;
        }}

        li {{
            margin-bottom: 4px;
        }}
    </style>
</head>

<body>
{html_body}
</body>
</html>
"""

    HTML(
        string=html,
        base_url=str(md_path.parent.resolve())
    ).write_pdf(str(pdf_path))

    print(f"PDF created successfully: {pdf_path}")


def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python md_to_pdf.py input.md")
        print("  python md_to_pdf.py input.md output.pdf")
        sys.exit(1)

    md_file = sys.argv[1]

    if len(sys.argv) >= 3:
        pdf_file = sys.argv[2]
    else:
        pdf_file = Path(md_file).with_suffix(".pdf")

    markdown_to_pdf(md_file, pdf_file)


if __name__ == "__main__":
    main()