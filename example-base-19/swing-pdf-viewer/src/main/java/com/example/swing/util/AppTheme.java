package com.example.swing.util;

import java.awt.*;

/**
 * Application theme constants for modern UI styling
 */
public class AppTheme {
    // Color scheme
    public static final Color BG_PRIMARY = new Color(245, 247, 250);
    public static final Color BG_SECONDARY = Color.WHITE;
    public static final Color BG_PANEL = new Color(250, 252, 255);
    public static final Color TEXT_PRIMARY = new Color(33, 37, 41);
    public static final Color TEXT_SECONDARY = new Color(108, 117, 125);
    public static final Color ACCENT = new Color(0, 123, 255);
    public static final Color ACCENT_HOVER = new Color(0, 105, 217);
    public static final Color BORDER = new Color(222, 226, 230);
    public static final Color SELECTION = new Color(0, 123, 255);
    public static final Color SELECTION_BG = new Color(230, 244, 255);
    public static final Color ERROR = new Color(220, 53, 69);
    public static final Color DISPLAY_BG = new Color(248, 249, 250);
    
    // Typography
    public static final Font FONT_PRIMARY = new Font("Segoe UI", Font.PLAIN, 13);
    public static final Font FONT_BOLD = new Font("Segoe UI", Font.BOLD, 13);
    public static final Font FONT_TITLE = new Font("Segoe UI", Font.BOLD, 14);
    
    private AppTheme() {
        // Utility class - prevent instantiation
    }
}

