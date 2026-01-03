package com.example.swing.util;

import java.awt.*;

/**
 * Theme class for managing light and dark color schemes
 */
public enum Theme {
    LIGHT(
            "Light",
            Color.WHITE,                    // background
            Color.BLACK,                    // foreground
            new Color(240, 240, 240),      // panel background
            new Color(245, 245, 245),      // text field background
            new Color(255, 255, 255),      // table background
            new Color(230, 230, 230),      // table selection
            new Color(200, 200, 200),      // border
            new Color(51, 51, 51),         // text
            new Color(240, 240, 240),      // scrollbar track
            new Color(200, 200, 200),      // scrollbar thumb
            "#ffffff",                     // markdown bg
            "#000000",                     // markdown text
            "#333333",                     // markdown headings
            "#f4f4f4",                     // markdown code bg
            "#0066cc"                      // markdown links
    ),
    DARK(
            "Dark",
            new Color(30, 30, 30),         // background
            new Color(220, 220, 220),      // foreground
            new Color(45, 45, 45),         // panel background
            new Color(50, 50, 50),         // text field background
            new Color(40, 40, 40),         // table background
            new Color(70, 70, 70),         // table selection
            new Color(60, 60, 60),         // border
            new Color(220, 220, 220),      // text
            new Color(45, 45, 45),         // scrollbar track
            new Color(80, 80, 80),         // scrollbar thumb
            "#1e1e1e",                     // markdown bg
            "#dcdcdc",                     // markdown text
            "#ffffff",                     // markdown headings
            "#2d2d2d",                     // markdown code bg
            "#4a9eff"                      // markdown links
    );

    private final String name;
    private final Color background;
    private final Color foreground;
    private final Color panelBackground;
    private final Color textFieldBackground;
    private final Color tableBackground;
    private final Color tableSelection;
    private final Color border;
    private final Color text;
    private final Color scrollbarTrack;
    private final Color scrollbarThumb;
    private final String markdownBg;
    private final String markdownText;
    private final String markdownHeadings;
    private final String markdownCodeBg;
    private final String markdownLinks;

    Theme(String name, Color background, Color foreground, Color panelBackground,
          Color textFieldBackground, Color tableBackground, Color tableSelection,
          Color border, Color text, Color scrollbarTrack, Color scrollbarThumb,
          String markdownBg, String markdownText, String markdownHeadings,
          String markdownCodeBg, String markdownLinks) {
        this.name = name;
        this.background = background;
        this.foreground = foreground;
        this.panelBackground = panelBackground;
        this.textFieldBackground = textFieldBackground;
        this.tableBackground = tableBackground;
        this.tableSelection = tableSelection;
        this.border = border;
        this.text = text;
        this.scrollbarTrack = scrollbarTrack;
        this.scrollbarThumb = scrollbarThumb;
        this.markdownBg = markdownBg;
        this.markdownText = markdownText;
        this.markdownHeadings = markdownHeadings;
        this.markdownCodeBg = markdownCodeBg;
        this.markdownLinks = markdownLinks;
    }

    public String getName() {
        return name;
    }

    public Color getBackground() {
        return background;
    }

    public Color getForeground() {
        return foreground;
    }

    public Color getPanelBackground() {
        return panelBackground;
    }

    public Color getTextFieldBackground() {
        return textFieldBackground;
    }

    public Color getTableBackground() {
        return tableBackground;
    }

    public Color getTableSelection() {
        return tableSelection;
    }

    public Color getBorder() {
        return border;
    }

    public Color getText() {
        return text;
    }

    public Color getScrollbarTrack() {
        return scrollbarTrack;
    }

    public Color getScrollbarThumb() {
        return scrollbarThumb;
    }

    public String getMarkdownBg() {
        return markdownBg;
    }

    public String getMarkdownText() {
        return markdownText;
    }

    public String getMarkdownHeadings() {
        return markdownHeadings;
    }

    public String getMarkdownCodeBg() {
        return markdownCodeBg;
    }

    public String getMarkdownLinks() {
        return markdownLinks;
    }

    public Theme toggle() {
        return this == LIGHT ? DARK : LIGHT;
    }
}

