package com.example.swing.ui;

import com.example.swing.util.AppTheme;
import org.apache.pdfbox.rendering.PDFRenderer;

import javax.swing.*;
import java.awt.*;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.IOException;

/**
 * Panel for displaying PDF pages
 */
public class PDFDisplayPanel extends JPanel {
    private JScrollPane scrollPane;
    private PDFRenderer pdfRenderer;
    private int currentPage = 0;
    private int totalPages = 0;
    
    public PDFDisplayPanel() {
        initializePanel();
    }
    
    private void initializePanel() {
        setLayout(new BorderLayout(0, 0));
        setBackground(AppTheme.BG_SECONDARY);
        setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(AppTheme.BORDER, 1),
            BorderFactory.createEmptyBorder(15, 15, 15, 15)
        ));
        
        // Header
        add(createHeaderPanel(), BorderLayout.NORTH);
        
        // Display area
        JPanel displayArea = createDisplayArea();
        scrollPane = new JScrollPane(displayArea);
        scrollPane.setPreferredSize(new Dimension(800, 600));
        scrollPane.setBorder(BorderFactory.createLineBorder(AppTheme.BORDER, 1));
        scrollPane.getViewport().setBackground(AppTheme.DISPLAY_BG);
        ScrollPaneStyler.styleScrollPane(scrollPane);
        add(scrollPane, BorderLayout.CENTER);
    }
    
    private JPanel createHeaderPanel() {
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(AppTheme.BG_SECONDARY);
        headerPanel.setBorder(BorderFactory.createEmptyBorder(0, 0, 12, 0));
        
        JLabel titleLabel = new JLabel("PDF Viewer");
        titleLabel.setFont(AppTheme.FONT_TITLE);
        titleLabel.setForeground(AppTheme.TEXT_PRIMARY);
        headerPanel.add(titleLabel, BorderLayout.WEST);
        
        return headerPanel;
    }
    
    private JPanel createDisplayArea() {
        JPanel displayArea = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
                
                if (pdfRenderer != null && currentPage >= 0 && currentPage < totalPages) {
                    try {
                        BufferedImage image = pdfRenderer.renderImageWithDPI(currentPage, 150);
                        int panelWidth = getWidth();
                        int panelHeight = getHeight();
                        int imageWidth = image.getWidth();
                        int imageHeight = image.getHeight();
                        
                        // Calculate scaling
                        double scaleX = (double) panelWidth / imageWidth;
                        double scaleY = (double) panelHeight / imageHeight;
                        double scale = Math.min(scaleX, scaleY);
                        scale = Math.min(scale, 1.0);
                        
                        int scaledWidth = (int) (imageWidth * scale);
                        int scaledHeight = (int) (imageHeight * scale);
                        
                        // Center the image
                        int x = (panelWidth - scaledWidth) / 2;
                        int y = (panelHeight - scaledHeight) / 2;
                        
                        // Draw shadow
                        g2d.setColor(new Color(0, 0, 0, 30));
                        g2d.fillRoundRect(x + 3, y + 3, scaledWidth, scaledHeight, 8, 8);
                        
                        // Draw image with rounded corners
                        g2d.setClip(new RoundRectangle2D.Float(x, y, scaledWidth, scaledHeight, 8, 8));
                        g2d.drawImage(image, x, y, scaledWidth, scaledHeight, null);
                        g2d.setClip(null);
                        
                        // Draw border
                        g2d.setColor(AppTheme.BORDER);
                        g2d.setStroke(new BasicStroke(1));
                        g2d.drawRoundRect(x, y, scaledWidth, scaledHeight, 8, 8);
                    } catch (IOException e) {
                        g2d.setColor(AppTheme.ERROR);
                        g2d.setFont(AppTheme.FONT_PRIMARY);
                        g2d.drawString("Error rendering PDF page: " + e.getMessage(), 20, 30);
                    }
                } else {
                    // Empty state
                    g2d.setColor(AppTheme.TEXT_SECONDARY);
                    g2d.setFont(AppTheme.FONT_PRIMARY);
                    FontMetrics fm = g2d.getFontMetrics();
                    String message = "No PDF selected";
                    int x = (getWidth() - fm.stringWidth(message)) / 2;
                    int y = getHeight() / 2;
                    g2d.drawString(message, x, y);
                }
            }
        };
        displayArea.setBackground(AppTheme.DISPLAY_BG);
        displayArea.setPreferredSize(new Dimension(800, 600));
        return displayArea;
    }
    
    /**
     * Set the PDF renderer and page count
     * @param renderer PDF renderer
     * @param pageCount Total number of pages
     */
    public void setPDFRenderer(PDFRenderer renderer, int pageCount) {
        this.pdfRenderer = renderer;
        this.totalPages = pageCount;
        this.currentPage = 0;
        repaint();
    }
    
    /**
     * Clear the display
     */
    public void clear() {
        this.pdfRenderer = null;
        this.totalPages = 0;
        this.currentPage = 0;
        repaint();
    }
    
    /**
     * Go to previous page
     * @return true if page changed
     */
    public boolean previousPage() {
        if (currentPage > 0) {
            currentPage--;
            repaint();
            scrollToTop();
            return true;
        }
        return false;
    }
    
    /**
     * Go to next page
     * @return true if page changed
     */
    public boolean nextPage() {
        if (currentPage < totalPages - 1) {
            currentPage++;
            repaint();
            scrollToTop();
            return true;
        }
        return false;
    }
    
    /**
     * Get current page number (0-based)
     * @return Current page number
     */
    public int getCurrentPage() {
        return currentPage;
    }
    
    /**
     * Get total number of pages
     * @return Total pages
     */
    public int getTotalPages() {
        return totalPages;
    }
    
    /**
     * Check if previous page is available
     * @return true if can go to previous page
     */
    public boolean canGoToPrevious() {
        return currentPage > 0;
    }
    
    /**
     * Check if next page is available
     * @return true if can go to next page
     */
    public boolean canGoToNext() {
        return currentPage < totalPages - 1;
    }
    
    private void scrollToTop() {
        SwingUtilities.invokeLater(() -> {
            if (scrollPane != null) {
                scrollPane.getVerticalScrollBar().setValue(0);
                scrollPane.getHorizontalScrollBar().setValue(0);
            }
        });
    }
}

