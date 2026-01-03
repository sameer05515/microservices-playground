package com.example.swing;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;

import javax.swing.*;
import java.awt.*;
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
        setLayout(new BorderLayout(10, 10));

        // Create main panel
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

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
        JPanel panel = new JPanel(new BorderLayout(5, 5));
        panel.setBorder(BorderFactory.createTitledBorder("PDF Files"));
        panel.setPreferredSize(new Dimension(300, 0));

        // Folder label
        folderLabel = new JLabel("Folder: " + currentFolder);
        folderLabel.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
        folderLabel.setToolTipText(currentFolder);
        panel.add(folderLabel, BorderLayout.NORTH);

        // PDF list
        listModel = new DefaultListModel<>();
        pdfList = new JList<>(listModel);
        pdfList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        pdfList.setCellRenderer(new PDFListCellRenderer());
        pdfList.addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                handlePDFSelection();
            }
        });
        
        JScrollPane listScrollPane = new JScrollPane(pdfList);
        listScrollPane.setPreferredSize(new Dimension(300, 600));
        panel.add(listScrollPane, BorderLayout.CENTER);

        // Buttons panel
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 5, 5));
        
        refreshButton = new JButton("Refresh");
        refreshButton.addActionListener(e -> loadPDFsFromFolder());
        buttonPanel.add(refreshButton);

        changeFolderButton = new JButton("Change Folder");
        changeFolderButton.addActionListener(e -> changeFolder());
        buttonPanel.add(changeFolderButton);

        panel.add(buttonPanel, BorderLayout.SOUTH);

        return panel;
    }

    private JPanel createPDFDisplayPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder("PDF Viewer"));

        // PDF display area
        pdfDisplayPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
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

                        g.drawImage(image, x, y, scaledWidth, scaledHeight, null);
                    } catch (IOException e) {
                        g.setColor(Color.RED);
                        g.drawString("Error rendering PDF page: " + e.getMessage(), 10, 20);
                    }
                } else {
                    g.setColor(Color.GRAY);
                    g.drawString("No PDF selected", 10, 20);
                }
            }
        };
        pdfDisplayPanel.setBackground(Color.WHITE);
        pdfDisplayPanel.setPreferredSize(new Dimension(800, 600));

        pdfScrollPane = new JScrollPane(pdfDisplayPanel);
        pdfScrollPane.setPreferredSize(new Dimension(800, 600));
        panel.add(pdfScrollPane, BorderLayout.CENTER);

        return panel;
    }

    private JPanel createControlPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 5));
        panel.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));

        // Navigation buttons
        JPanel navPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 5));
        
        previousPageButton = new JButton("◀ Previous");
        previousPageButton.setEnabled(false);
        previousPageButton.addActionListener(e -> goToPreviousPage());
        navPanel.add(previousPageButton);

        currentPageLabel = new JLabel("Page: 0");
        currentPageLabel.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 12));
        navPanel.add(currentPageLabel);

        JLabel separator = new JLabel(" / ");
        navPanel.add(separator);

        totalPagesLabel = new JLabel("0");
        totalPagesLabel.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 12));
        navPanel.add(totalPagesLabel);

        nextPageButton = new JButton("Next ▶");
        nextPageButton.setEnabled(false);
        nextPageButton.addActionListener(e -> goToNextPage());
        navPanel.add(nextPageButton);

        panel.add(navPanel, BorderLayout.CENTER);

        // File info
        JLabel infoLabel = new JLabel("Select a PDF from the list to view");
        infoLabel.setHorizontalAlignment(SwingConstants.CENTER);
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

            folderLabel.setText("Folder: " + currentFolder + " (" + pdfFiles.size() + " PDFs)");
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
     * Custom cell renderer for PDF list
     */
    private static class PDFListCellRenderer extends DefaultListCellRenderer {
        @Override
        public Component getListCellRendererComponent(JList<?> list, Object value, int index,
                                                      boolean isSelected, boolean cellHasFocus) {
            super.getListCellRendererComponent(list, value, index, isSelected, cellHasFocus);
            if (value instanceof File) {
                File file = (File) value;
                setText(file.getName());
                setToolTipText(file.getAbsolutePath());
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

