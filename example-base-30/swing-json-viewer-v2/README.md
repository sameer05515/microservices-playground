# Swing JSON Viewer V2

Java 17 Swing application for consuming `data.json` and rendering Markdown content properly.

## V2 Features

- Companies → Projects navigation
- Runtime `Open JSON...`
- Markdown rendering using CommonMark
- Headings, bold/italic, lists, links, blockquotes
- GFM tables
- Strikethrough
- Fenced code blocks
- Project description and notes rendered as Markdown
- Shaded executable JAR

## Run

```powershell
mvn clean package
java -jar target/swing-json-viewer-v2-2.0.0.jar
```

Requires JDK 17+.
