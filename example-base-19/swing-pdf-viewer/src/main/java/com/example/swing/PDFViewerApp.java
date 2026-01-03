package com.example.swing;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;

import javax.swing.*;
import java.awt.*;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Swing PDF Viewer Application
 * Lists PDFs from a folder and displays selected PDF
 */
public class PDFViewerApp extends JFrame {
    private static final String PDF_FOLDER = "D:\\Prem\\comics";
    
    // Modern color scheme
    private static final Color BG_PRIMARY = new Color(245, 247, 250);
    private static final Color BG_SECONDARY = Color.WHITE;
    private static final Color BG_PANEL = new Color(250, 252, 255);
    private static final Color TEXT_PRIMARY = new Color(33, 37, 41);
    private static final Color TEXT_SECONDARY = new Color(108, 117, 125);
    private static final Color ACCENT = new Color(0, 123, 255);
    private static final Color ACCENT_HOVER = new Color(0, 105, 217);
    private static final Color BORDER = new Color(222, 226, 230);
    private static final Color SELECTION = new Color(0, 123, 255);
    private static final Color SELECTION_BG = new Color(230, 244, 255);
    private static final Font FONT_PRIMARY = new Font("Segoe UI", Font.PLAIN, 13);
    private static final Font FONT_BOLD = new Font("Segoe UI", Font.BOLD, 13);
    private static final Font FONT_TITLE = new Font("Segoe UI", Font.BOLD, 14);
    
    private JList<File> pdfList;
    private DefaultListModel<File> listModel;
    private JLabel currentPageLabel;
    private JLabel totalPagesLabel;
    private JButton previousPageButton;
    private JButton nextPageButton;
    private JButton refreshButton;
    private JButton changeFolderButton;
    private JLabel folderLabel;
    private JPanel pdfDisplayPanel;
    private JScrollPane pdfScrollPane;
    
    private PDDocument currentDocument;
    private PDFRenderer pdfRenderer;
    private int currentPage = 0;
    private int totalPages = 0;
    private File currentPdfFile;
    private String currentFolder = PDF_FOLDER;

    public PDFViewerApp() {
        initializeGUI();
        loadPDFsFromFolder();
    }

    private void initializeGUI() {
        setTitle("PDF Viewer");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        
        // Set modern background
        getContentPane().setBackground(BG_PRIMARY);
        setLayout(new BorderLayout());

        // Create main panel with modern styling
        JPanel mainPanel = new JPanel(new BorderLayout(0, 0));
        mainPanel.setBackground(BG_PRIMARY);
        mainPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        // Left panel - PDF list
        mainPanel.add(createPDFListPanel(), BorderLayout.WEST);

        // Center panel - PDF display
        mainPanel.add(createPDFDisplayPanel(), BorderLayout.CENTER);

        // Bottom panel - Controls
        mainPanel.add(createControlPanel(), BorderLayout.SOUTH);

        add(mainPanel, BorderLayout.CENTER);

        pack();
        setLocationRelativeTo(null);
        setSize(1200, 800);
        setMinimumSize(new Dimension(800, 600));
    }

    private JPanel createPDFListPanel() {
        JPanel panel = new JPanel(new BorderLayout(0, 0));
        panel.setBackground(BG_SECONDARY);
        panel.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(BORDER, 1),
            BorderFactory.createEmptyBorder(15, 15, 15, 15)
        ));
        panel.setPreferredSize(new Dimension(320, 0));

        // Header with title
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(BG_SECONDARY);
        headerPanel.setBorder(BorderFactory.createEmptyBorder(0, 0, 12, 0));
        
        JLabel titleLabel = new JLabel("PDF Files");
        titleLabel.setFont(FONT_TITLE);
        titleLabel.setForeground(TEXT_PRIMARY);
        headerPanel.add(titleLabel, BorderLayout.NORTH);
        
        // Folder label with modern styling
        folderLabel = new JLabel("<html><div style='color: #6c757d; font-size: 11px;'>" + 
                                  truncatePath(currentFolder, 35) + "</div></html>");
        folderLabel.setFont(FONT_PRIMARY);
        folderLabel.setForeground(TEXT_SECONDARY);
        folderLabel.setBorder(BorderFactory.createEmptyBorder(5, 0, 0, 0));
        folderLabel.setToolTipText(currentFolder);
        headerPanel.add(folderLabel, BorderLayout.CENTER);
        
        panel.add(headerPanel, BorderLayout.NORTH);

        // PDF list with modern styling
        listModel = new DefaultListModel<>();
        pdfList = new JList<>(listModel);
        pdfList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        pdfList.setCellRenderer(new PDFListCellRenderer());
        pdfList.setBackground(BG_SECONDARY);
        pdfList.setSelectionBackground(SELECTION_BG);
        pdfList.setSelectionForeground(SELECTION);
        pdfList.setFont(FONT_PRIMARY);
        pdfList.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
        pdfList.addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                handlePDFSelection();
            }
        });
        
        JScrollPane listScrollPane = new JScrollPane(pdfList);
        listScrollPane.setPreferredSize(new Dimension(300, 500));
        listScrollPane.setBorder(BorderFactory.createLineBorder(BORDER, 1));
        listScrollPane.getViewport().setBackground(BG_SECONDARY);
        styleScrollPane(listScrollPane);
        panel.add(listScrollPane, BorderLayout.CENTER);

        // Buttons panel with modern styling
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 10));
        buttonPanel.setBackground(BG_SECONDARY);
        buttonPanel.setBorder(BorderFactory.createEmptyBorder(10, 0, 0, 0));
        
        refreshButton = createModernButton("🔄 Refresh", e -> loadPDFsFromFolder());
        changeFolderButton = createModernButton("📁 Change Folder", e -> changeFolder());

        buttonPanel.add(refreshButton);
        buttonPanel.add(changeFolderButton);

        panel.add(buttonPanel, BorderLayout.SOUTH);

        return panel;
    }

    private JPanel createPDFDisplayPanel() {
        JPanel panel = new JPanel(new BorderLayout(0, 0));
        panel.setBackground(BG_SECONDARY);
        panel.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(BORDER, 1),
            BorderFactory.createEmptyBorder(15, 15, 15, 15)
        ));

        // Header
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(BG_SECONDARY);
        headerPanel.setBorder(BorderFactory.createEmptyBorder(0, 0, 12, 0));
        
        JLabel titleLabel = new JLabel("PDF Viewer");
        titleLabel.setFont(FONT_TITLE);
        titleLabel.setForeground(TEXT_PRIMARY);
        headerPanel.add(titleLabel, BorderLayout.WEST);
        
        panel.add(headerPanel, BorderLayout.NORTH);

        // PDF display area with modern styling
        pdfDisplayPanel = new JPanel() {
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

                        // Calculate scaling to fit panel while maintaining aspect ratio
                        double scaleX = (double) panelWidth / imageWidth;
                        double scaleY = (double) panelHeight / imageHeight;
                        double scale = Math.min(scaleX, scaleY);
                        scale = Math.min(scale, 1.0); // Don't scale up

                        int scaledWidth = (int) (imageWidth * scale);
                        int scaledHeight = (int) (imageHeight * scale);

                        // Center the image
                        int x = (panelWidth - scaledWidth) / 2;
                        int y = (panelHeight - scaledHeight) / 2;

                        // Draw shadow effect
                        g2d.setColor(new Color(0, 0, 0, 30));
                        g2d.fillRoundRect(x + 3, y + 3, scaledWidth, scaledHeight, 8, 8);
                        
                        // Draw image with rounded corners
                        g2d.setClip(new RoundRectangle2D.Float(x, y, scaledWidth, scaledHeight, 8, 8));
                        g2d.drawImage(image, x, y, scaledWidth, scaledHeight, null);
                        g2d.setClip(null);
                        
                        // Draw border
                        g2d.setColor(BORDER);
                        g2d.setStroke(new BasicStroke(1));
                        g2d.drawRoundRect(x, y, scaledWidth, scaledHeight, 8, 8);
                    } catch (IOException e) {
                        g2d.setColor(new Color(220, 53, 69));
                        g2d.setFont(FONT_PRIMARY);
                        g2d.drawString("Error rendering PDF page: " + e.getMessage(), 20, 30);
                    }
                } else {
                    // Modern empty state
                    g2d.setColor(TEXT_SECONDARY);
                    g2d.setFont(FONT_PRIMARY);
                    FontMetrics fm = g2d.getFontMetrics();
                    String message = "No PDF selected";
                    int x = (getWidth() - fm.stringWidth(message)) / 2;
                    int y = getHeight() / 2;
                    g2d.drawString(message, x, y);
                }
            }
        };
        pdfDisplayPanel.setBackground(new Color(248, 249, 250));
        pdfDisplayPanel.setPreferredSize(new Dimension(800, 600));

        pdfScrollPane = new JScrollPane(pdfDisplayPanel);
        pdfScrollPane.setPreferredSize(new Dimension(800, 600));
        pdfScrollPane.setBorder(BorderFactory.createLineBorder(BORDER, 1));
        pdfScrollPane.getViewport().setBackground(new Color(248, 249, 250));
        styleScrollPane(pdfScrollPane);
        panel.add(pdfScrollPane, BorderLayout.CENTER);

        return panel;
    }

    private JPanel createControlPanel() {
        JPanel panel = new JPanel(new BorderLayout(0, 0));
        panel.setBackground(BG_SECONDARY);
        panel.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createMatteBorder(1, 0, 0, 0, BORDER),
            BorderFactory.createEmptyBorder(15, 15, 15, 15)
        ));

        // Navigation buttons with modern styling
        JPanel navPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 12, 0));
        navPanel.setBackground(BG_SECONDARY);
        
        previousPageButton = createModernButton("◀ Previous", e -> goToPreviousPage());
        previousPageButton.setEnabled(false);
        navPanel.add(previousPageButton);

        // Modern page counter
        JPanel pageCounterPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 5, 0));
        pageCounterPanel.setBackground(BG_SECONDARY);
        
        currentPageLabel = new JLabel("Page: 0");
        currentPageLabel.setFont(FONT_BOLD);
        currentPageLabel.setForeground(TEXT_PRIMARY);
        pageCounterPanel.add(currentPageLabel);

        JLabel separator = new JLabel(" / ");
        separator.setFont(FONT_PRIMARY);
        separator.setForeground(TEXT_SECONDARY);
        pageCounterPanel.add(separator);

        totalPagesLabel = new JLabel("0");
        totalPagesLabel.setFont(FONT_BOLD);
        totalPagesLabel.setForeground(TEXT_PRIMARY);
        pageCounterPanel.add(totalPagesLabel);
        
        navPanel.add(pageCounterPanel);

        nextPageButton = createModernButton("Next ▶", e -> goToNextPage());
        nextPageButton.setEnabled(false);
        navPanel.add(nextPageButton);

        panel.add(navPanel, BorderLayout.CENTER);

        // File info with modern styling
        JLabel infoLabel = new JLabel("Select a PDF from the list to view");
        infoLabel.setFont(FONT_PRIMARY);
        infoLabel.setForeground(TEXT_SECONDARY);
        infoLabel.setHorizontalAlignment(SwingConstants.CENTER);
        infoLabel.setBorder(BorderFactory.createEmptyBorder(8, 0, 0, 0));
        panel.add(infoLabel, BorderLayout.SOUTH);

        return panel;
    }

    private void loadPDFsFromFolder() {
        listModel.clear();
        closeCurrentDocument();

        Path folderPath = Paths.get(currentFolder);
        if (!Files.exists(folderPath) || !Files.isDirectory(folderPath)) {
            JOptionPane.showMessageDialog(this,
                    "Folder does not exist: " + currentFolder + "\n\nPlease use 'Change Folder' to select a valid folder.",
                    "Folder Not Found",
                    JOptionPane.WARNING_MESSAGE);
            folderLabel.setText("Folder: (Not Found)");
            return;
        }

        try {
            List<File> pdfFiles = Files.list(folderPath)
                    .filter(Files::isRegularFile)
                    .map(Path::toFile)
                    .filter(file -> file.getName().toLowerCase().endsWith(".pdf"))
                    .sorted(Comparator.comparing(File::getName))
                    .collect(Collectors.toList());

            if (pdfFiles.isEmpty()) {
                JOptionPane.showMessageDialog(this,
                        "No PDF files found in: " + currentFolder,
                        "No PDFs Found",
                        JOptionPane.INFORMATION_MESSAGE);
            } else {
                for (File pdfFile : pdfFiles) {
                    listModel.addElement(pdfFile);
                }
            }

            folderLabel.setText("<html><div style='color: #6c757d; font-size: 11px;'>" + 
                               truncatePath(currentFolder, 35) + " <span style='color: #007bff;'>(" + 
                               pdfFiles.size() + " PDFs)</span></div></html>");
            folderLabel.setToolTipText(currentFolder);

        } catch (IOException e) {
            JOptionPane.showMessageDialog(this,
                    "Error reading folder: " + e.getMessage(),
                    "Error",
                    JOptionPane.ERROR_MESSAGE);
        }
    }

    private void changeFolder() {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
        fileChooser.setDialogTitle("Select Folder Containing PDFs");
        fileChooser.setCurrentDirectory(new File(currentFolder));

        int result = fileChooser.showOpenDialog(this);
        if (result == JFileChooser.APPROVE_OPTION) {
            File selectedFolder = fileChooser.getSelectedFile();
            currentFolder = selectedFolder.getAbsolutePath();
            loadPDFsFromFolder();
        }
    }

    private void handlePDFSelection() {
        File selectedFile = pdfList.getSelectedValue();
        if (selectedFile != null && selectedFile.exists()) {
            loadPDF(selectedFile);
        }
    }

    private void loadPDF(File pdfFile) {
        closeCurrentDocument();

        try {
            currentPdfFile = pdfFile;
            currentDocument = Loader.loadPDF(pdfFile);
            pdfRenderer = new PDFRenderer(currentDocument);
            totalPages = currentDocument.getNumberOfPages();
            currentPage = 0;

            updatePageDisplay();
            pdfDisplayPanel.repaint();

        } catch (IOException e) {
            JOptionPane.showMessageDialog(this,
                    "Error loading PDF: " + e.getMessage(),
                    "Load Error",
                    JOptionPane.ERROR_MESSAGE);
            closeCurrentDocument();
        }
    }

    private void goToPreviousPage() {
        if (currentPage > 0) {
            currentPage--;
            updatePageDisplay();
            pdfDisplayPanel.repaint();
            // Scroll to top
            SwingUtilities.invokeLater(() -> {
                pdfScrollPane.getVerticalScrollBar().setValue(0);
                pdfScrollPane.getHorizontalScrollBar().setValue(0);
            });
        }
    }

    private void goToNextPage() {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updatePageDisplay();
            pdfDisplayPanel.repaint();
            // Scroll to top
            SwingUtilities.invokeLater(() -> {
                pdfScrollPane.getVerticalScrollBar().setValue(0);
                pdfScrollPane.getHorizontalScrollBar().setValue(0);
            });
        }
    }

    private void updatePageDisplay() {
        currentPageLabel.setText("Page: " + (currentPage + 1));
        totalPagesLabel.setText(String.valueOf(totalPages));
        previousPageButton.setEnabled(currentPage > 0);
        nextPageButton.setEnabled(currentPage < totalPages - 1);
    }

    private void closeCurrentDocument() {
        if (currentDocument != null) {
            try {
                currentDocument.close();
            } catch (IOException e) {
                System.err.println("Error closing PDF: " + e.getMessage());
            }
            currentDocument = null;
            pdfRenderer = null;
            currentPage = 0;
            totalPages = 0;
            currentPdfFile = null;
            updatePageDisplay();
            pdfDisplayPanel.repaint();
        }
    }

    /**
     * Create a modern styled button
     */
    private JButton createModernButton(String text, java.awt.event.ActionListener listener) {
        JButton button = new JButton(text) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                if (getModel().isPressed()) {
                    g2d.setColor(ACCENT_HOVER);
                } else if (getModel().isRollover()) {
                    g2d.setColor(ACCENT_HOVER);
                } else {
                    g2d.setColor(ACCENT);
                }
                
                if (isEnabled()) {
                    g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 6, 6);
                } else {
                    g2d.setColor(BORDER);
                    g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 6, 6);
                }
                
                g2d.dispose();
                super.paintComponent(g);
            }
        };
        
        button.setFont(FONT_PRIMARY);
        button.setForeground(Color.WHITE);
        button.setBackground(ACCENT);
        button.setBorderPainted(false);
        button.setFocusPainted(false);
        button.setContentAreaFilled(false);
        button.setOpaque(false);
        button.setPreferredSize(new Dimension(120, 35));
        button.setCursor(new Cursor(Cursor.HAND_CURSOR));
        button.addActionListener(listener);
        
        return button;
    }
    
    /**
     * Style scroll pane with modern appearance
     */
    private void styleScrollPane(JScrollPane scrollPane) {
        scrollPane.getVerticalScrollBar().setUI(new javax.swing.plaf.basic.BasicScrollBarUI() {
            @Override
            protected void configureScrollBarColors() {
                this.thumbColor = new Color(200, 200, 200);
                this.trackColor = new Color(245, 245, 245);
            }
            
            @Override
            protected JButton createDecreaseButton(int orientation) {
                return createZeroButton();
            }
            
            @Override
            protected JButton createIncreaseButton(int orientation) {
                return createZeroButton();
            }
            
            private JButton createZeroButton() {
                JButton button = new JButton();
                button.setPreferredSize(new Dimension(0, 0));
                button.setMinimumSize(new Dimension(0, 0));
                button.setMaximumSize(new Dimension(0, 0));
                return button;
            }
        });
        
        scrollPane.getHorizontalScrollBar().setUI(new javax.swing.plaf.basic.BasicScrollBarUI() {
            @Override
            protected void configureScrollBarColors() {
                this.thumbColor = new Color(200, 200, 200);
                this.trackColor = new Color(245, 245, 245);
            }
            
            @Override
            protected JButton createDecreaseButton(int orientation) {
                return createZeroButton();
            }
            
            @Override
            protected JButton createIncreaseButton(int orientation) {
                return createZeroButton();
            }
            
            private JButton createZeroButton() {
                JButton button = new JButton();
                button.setPreferredSize(new Dimension(0, 0));
                button.setMinimumSize(new Dimension(0, 0));
                button.setMaximumSize(new Dimension(0, 0));
                return button;
            }
        });
    }
    
    /**
     * Truncate path for display
     */
    private String truncatePath(String path, int maxLength) {
        if (path.length() <= maxLength) {
            return path;
        }
        return "..." + path.substring(path.length() - maxLength + 3);
    }
    
    /**
     * Custom cell renderer for PDF list with modern styling
     */
    private class PDFListCellRenderer extends DefaultListCellRenderer {
        @Override
        public Component getListCellRendererComponent(JList<?> list, Object value, int index,
                                                      boolean isSelected, boolean cellHasFocus) {
            super.getListCellRendererComponent(list, value, index, isSelected, cellHasFocus);
            
            if (value instanceof File) {
                File file = (File) value;
                setText("📄 " + file.getName());
                setToolTipText(file.getAbsolutePath());
                setFont(FONT_PRIMARY);
                setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createEmptyBorder(8, 12, 8, 12),
                    BorderFactory.createMatteBorder(0, 0, 1, 0, BORDER)
                ));
                
                if (isSelected) {
                    setBackground(SELECTION_BG);
                    setForeground(SELECTION);
                } else {
                    setBackground(BG_SECONDARY);
                    setForeground(TEXT_PRIMARY);
                }
            }
            return this;
        }
    }

    @Override
    public void dispose() {
        closeCurrentDocument();
        super.dispose();
    }

    public static void main(String[] args) {
        // Set look and feel to system default
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Create and show the GUI
        SwingUtilities.invokeLater(() -> {
            new PDFViewerApp().setVisible(true);
        });
    }
}

