package com.example.swing.ui;

import com.example.swing.util.AppTheme;

import javax.swing.*;
import java.awt.*;
import java.io.File;

/**
 * Custom cell renderer for PDF list with modern styling
 */
public class PDFListCellRenderer extends DefaultListCellRenderer {
    
    @Override
    public Component getListCellRendererComponent(JList<?> list, Object value, int index,
                                                  boolean isSelected, boolean cellHasFocus) {
        super.getListCellRendererComponent(list, value, index, isSelected, cellHasFocus);
        
        if (value instanceof File) {
            File file = (File) value;
            setText("📄 " + file.getName());
            setToolTipText(file.getAbsolutePath());
            setFont(AppTheme.FONT_PRIMARY);
            setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createEmptyBorder(8, 12, 8, 12),
                BorderFactory.createMatteBorder(0, 0, 1, 0, AppTheme.BORDER)
            ));
            
            if (isSelected) {
                setBackground(AppTheme.SELECTION_BG);
                setForeground(AppTheme.SELECTION);
            } else {
                setBackground(AppTheme.BG_SECONDARY);
                setForeground(AppTheme.TEXT_PRIMARY);
            }
        }
        return this;
    }
}

