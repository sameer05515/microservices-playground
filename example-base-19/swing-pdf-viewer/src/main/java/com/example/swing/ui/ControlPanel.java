package com.example.swing.ui;

import com.example.swing.util.AppTheme;

import javax.swing.*;
import java.awt.*;

/**
 * Control panel for PDF navigation
 */
public class ControlPanel extends JPanel {
    private JButton previousPageButton;
    private JButton nextPageButton;
    private JLabel currentPageLabel;
    private JLabel totalPagesLabel;
    private JLabel infoLabel;
    
    private Runnable onPreviousPage;
    private Runnable onNextPage;
    
    public ControlPanel() {
        initializePanel();
    }
    
    private void initializePanel() {
        setLayout(new BorderLayout(0, 0));
        setBackground(AppTheme.BG_SECONDARY);
        setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createMatteBorder(1, 0, 0, 0, AppTheme.BORDER),
            BorderFactory.createEmptyBorder(15, 15, 15, 15)
        ));
        
        // Navigation buttons
        add(createNavigationPanel(), BorderLayout.CENTER);
        
        // Info label
        add(createInfoPanel(), BorderLayout.SOUTH);
    }
    
    private JPanel createNavigationPanel() {
        JPanel navPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 12, 0));
        navPanel.setBackground(AppTheme.BG_SECONDARY);
        
        previousPageButton = new ModernButton("◀ Previous", e -> {
            if (onPreviousPage != null) {
                onPreviousPage.run();
            }
        });
        previousPageButton.setEnabled(false);
        navPanel.add(previousPageButton);
        
        // Page counter
        JPanel pageCounterPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 5, 0));
        pageCounterPanel.setBackground(AppTheme.BG_SECONDARY);
        
        currentPageLabel = new JLabel("Page: 0");
        currentPageLabel.setFont(AppTheme.FONT_BOLD);
        currentPageLabel.setForeground(AppTheme.TEXT_PRIMARY);
        pageCounterPanel.add(currentPageLabel);
        
        JLabel separator = new JLabel(" / ");
        separator.setFont(AppTheme.FONT_PRIMARY);
        separator.setForeground(AppTheme.TEXT_SECONDARY);
        pageCounterPanel.add(separator);
        
        totalPagesLabel = new JLabel("0");
        totalPagesLabel.setFont(AppTheme.FONT_BOLD);
        totalPagesLabel.setForeground(AppTheme.TEXT_PRIMARY);
        pageCounterPanel.add(totalPagesLabel);
        
        navPanel.add(pageCounterPanel);
        
        nextPageButton = new ModernButton("Next ▶", e -> {
            if (onNextPage != null) {
                onNextPage.run();
            }
        });
        nextPageButton.setEnabled(false);
        navPanel.add(nextPageButton);
        
        return navPanel;
    }
    
    private JPanel createInfoPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(AppTheme.BG_SECONDARY);
        
        infoLabel = new JLabel("Select a PDF from the list to view");
        infoLabel.setFont(AppTheme.FONT_PRIMARY);
        infoLabel.setForeground(AppTheme.TEXT_SECONDARY);
        infoLabel.setHorizontalAlignment(SwingConstants.CENTER);
        infoLabel.setBorder(BorderFactory.createEmptyBorder(8, 0, 0, 0));
        panel.add(infoLabel, BorderLayout.CENTER);
        
        return panel;
    }
    
    /**
     * Set callback for previous page action
     * @param callback Runnable to execute
     */
    public void setOnPreviousPage(Runnable callback) {
        this.onPreviousPage = callback;
    }
    
    /**
     * Set callback for next page action
     * @param callback Runnable to execute
     */
    public void setOnNextPage(Runnable callback) {
        this.onNextPage = callback;
    }
    
    /**
     * Update page display
     * @param currentPage Current page (1-based)
     * @param totalPages Total pages
     * @param canGoPrevious Whether previous page is available
     * @param canGoNext Whether next page is available
     */
    public void updatePageDisplay(int currentPage, int totalPages, 
                                   boolean canGoPrevious, boolean canGoNext) {
        currentPageLabel.setText("Page: " + currentPage);
        totalPagesLabel.setText(String.valueOf(totalPages));
        previousPageButton.setEnabled(canGoPrevious);
        nextPageButton.setEnabled(canGoNext);
    }
    
    /**
     * Set info message
     * @param message Info message to display
     */
    public void setInfoMessage(String message) {
        infoLabel.setText(message);
    }
}

