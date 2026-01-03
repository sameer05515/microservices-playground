package com.example.swing.ui;

import com.example.swing.util.AppTheme;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionListener;

/**
 * Modern styled button component
 */
public class ModernButton extends JButton {
    
    public ModernButton(String text, ActionListener listener) {
        super(text);
        
        setFont(AppTheme.FONT_PRIMARY);
        setForeground(Color.WHITE);
        setBackground(AppTheme.ACCENT);
        setBorderPainted(false);
        setFocusPainted(false);
        setContentAreaFilled(false);
        setOpaque(false);
        setPreferredSize(new Dimension(120, 35));
        setCursor(new Cursor(Cursor.HAND_CURSOR));
        
        if (listener != null) {
            addActionListener(listener);
        }
    }
    
    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2d = (Graphics2D) g.create();
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        if (getModel().isPressed()) {
            g2d.setColor(AppTheme.ACCENT_HOVER);
        } else if (getModel().isRollover()) {
            g2d.setColor(AppTheme.ACCENT_HOVER);
        } else {
            g2d.setColor(AppTheme.ACCENT);
        }
        
        if (isEnabled()) {
            g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 6, 6);
        } else {
            g2d.setColor(AppTheme.BORDER);
            g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 6, 6);
        }
        
        g2d.dispose();
        super.paintComponent(g);
    }
}

