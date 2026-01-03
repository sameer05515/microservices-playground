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
        return markdownToHtml(markdown, Theme.LIGHT);
    }

    /**
     * Convert Markdown text to HTML with theme
     * 
     * @param markdown The markdown text to convert
     * @param theme The theme to use for styling
     * @return HTML string
     */
    public static String markdownToHtml(String markdown, Theme theme) {
        if (markdown == null || markdown.trim().isEmpty()) {
            return "<p><em>No content</em></p>";
        }

        try {
            var document = PARSER.parse(markdown);
            String html = RENDERER.render(document);

            // Add CSS styling based on theme
            return wrapWithStyles(html, theme);
        } catch (Exception e) {
            return "<p style='color: red;'>Error rendering markdown: " + e.getMessage() + "</p>";
        }
    }

    /**
     * Wrap HTML content with CSS styles based on theme
     */
    private static String wrapWithStyles(String html, Theme theme) {
        String borderColor = theme == Theme.DARK ? "#505050" : "#eeeeee";
        String tableBorderColor = theme == Theme.DARK ? "#505050" : "#dddddd";
        String tableHeaderBg = theme == Theme.DARK ? "#3a3a3a" : "#f2f2f2";
        String blockquoteColor = theme == Theme.DARK ? "#888888" : "#666666";
        
        return String.format("""
                <html>
                <head>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        padding: 10px; 
                        line-height: 1.6; 
                        background-color: %s;
                        color: %s;
                    }
                    h1, h2, h3, h4, h5, h6 { 
                        color: %s; 
                        margin-top: 1em; 
                        margin-bottom: 0.5em; 
                    }
                    h1 { 
                        font-size: 2em; 
                        border-bottom: 2px solid %s; 
                        padding-bottom: 0.3em; 
                    }
                    h2 { 
                        font-size: 1.5em; 
                        border-bottom: 1px solid %s; 
                        padding-bottom: 0.3em; 
                    }
                    h3 { 
                        font-size: 1.25em; 
                    }
                    code { 
                        background-color: %s; 
                        padding: 2px 4px; 
                        border-radius: 3px; 
                        font-family: 'Courier New', monospace; 
                        color: %s;
                    }
                    pre { 
                        background-color: %s; 
                        padding: 10px; 
                        border-radius: 5px; 
                        overflow-x: auto; 
                    }
                    pre code { 
                        background-color: transparent; 
                        padding: 0; 
                    }
                    blockquote { 
                        border-left: 4px solid %s; 
                        margin-left: 0; 
                        padding-left: 1em; 
                        color: %s; 
                    }
                    a { 
                        color: %s; 
                        text-decoration: none; 
                    }
                    a:hover { 
                        text-decoration: underline; 
                    }
                    ul, ol { 
                        margin-left: 1.5em; 
                    }
                    table { 
                        border-collapse: collapse; 
                        width: 100%%; 
                        margin: 1em 0; 
                    }
                    th, td { 
                        border: 1px solid %s; 
                        padding: 8px; 
                        text-align: left; 
                    }
                    th { 
                        background-color: %s; 
                        font-weight: bold; 
                    }
                    img { 
                        max-width: 100%%; 
                        height: auto; 
                    }
                </style>
                </head>
                <body>
                %s
                </body>
                </html>
                """,
                theme.getMarkdownBg(),
                theme.getMarkdownText(),
                theme.getMarkdownHeadings(),
                borderColor,
                borderColor,
                theme.getMarkdownCodeBg(),
                theme.getMarkdownText(),
                theme.getMarkdownCodeBg(),
                borderColor,
                blockquoteColor,
                theme.getMarkdownLinks(),
                tableBorderColor,
                tableHeaderBg,
                html);
    }
}
