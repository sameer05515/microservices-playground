package com.example.swing.util;

import com.vladsch.flexmark.html.HtmlRenderer;
import com.vladsch.flexmark.parser.Parser;
import com.vladsch.flexmark.profile.pegdown.Extensions;
import com.vladsch.flexmark.profile.pegdown.PegdownOptionsAdapter;
import com.vladsch.flexmark.util.data.DataHolder;

/**
 * Utility class for rendering Markdown to HTML
 */
public class MarkdownRenderer {
    private static final DataHolder OPTIONS = PegdownOptionsAdapter.flexmarkOptions(
            Extensions.ALL & ~Extensions.ANCHORLINKS);

    private static final Parser PARSER = Parser.builder(OPTIONS).build();
    private static final HtmlRenderer RENDERER = HtmlRenderer.builder(OPTIONS).build();

    /**
     * Convert Markdown text to HTML
     * 
     * @param markdown The markdown text to convert
     * @return HTML string
     */
    public static String markdownToHtml(String markdown) {
        if (markdown == null || markdown.trim().isEmpty()) {
            return "<p><em>No content</em></p>";
        }

        try {
            var document = PARSER.parse(markdown);
            String html = RENDERER.render(document);

            // Add basic CSS styling for better appearance
            return wrapWithStyles(html);
        } catch (Exception e) {
            return "<p style='color: red;'>Error rendering markdown: " + e.getMessage() + "</p>";
        }
    }

    /**
     * Wrap HTML content with basic CSS styles
     */
    private static String wrapWithStyles(String html) {
        return """
                <html>
                <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 10px; line-height: 1.6; }
                    h1, h2, h3, h4, h5, h6 { color: #333; margin-top: 1em; margin-bottom: 0.5em; }
                    h1 { font-size: 2em; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
                    h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
                    h3 { font-size: 1.25em; }
                    code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: 'Courier New', monospace; }
                    pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
                    pre code { background-color: transparent; padding: 0; }
                    blockquote { border-left: 4px solid #ddd; margin-left: 0; padding-left: 1em; color: #666; }
                    a { color: #0066cc; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                    ul, ol { margin-left: 1.5em; }
                    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    img { max-width: 100%; height: auto; }
                </style>
                </head>
                <body>
                """
                + html + """
                        </body>
                        </html>
                        """;
    }
}
