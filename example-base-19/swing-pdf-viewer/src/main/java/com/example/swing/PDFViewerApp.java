package com.example.swing;

import com.example.swing.service.PDFService;
import com.example.swing.ui.ControlPanel;
import com.example.swing.ui.PDFDisplayPanel;
import com.example.swing.ui.PDFListPanel;
import com.example.swing.util.AppTheme;
import com.example.swing.util.PDFDocumentManager;

import javax.swing.*;
import java.awt.*;
import java.io.File;
import java.io.IOException;

/**
 * Swing PDF Viewer Application
 * Lists PDFs from a folder and displays selected PDF
 */
public class PDFViewerApp extends JFrame {
    private static final String PDF_FOLDER = "D:\\Prem\\comics";
    
    private PDFListPanel pdfListPanel;
    private PDFDisplayPanel pdfDisplayPanel;
    private ControlPanel controlPanel;
    private PDFDocumentManager documentManager;
    
    private String currentFolder = PDF_FOLDER;

    public PDFViewerApp() {
        documentManager = new PDFDocumentManager();
        initializeGUI();
        loadPDFsFromFolder();
    }

    private void initializeGUI() {
        setTitle("PDF Viewer");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        
        getContentPane().setBackground(AppTheme.BG_PRIMARY);
        setLayout(new BorderLayout());

        JPanel mainPanel = new JPanel(new BorderLayout(0, 0));
        mainPanel.setBackground(AppTheme.BG_PRIMARY);
        mainPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        // Create and add components
        pdfListPanel = new PDFListPanel(currentFolder);
        pdfListPanel.setOnPDFSelected(e -> handlePDFSelection());
        pdfListPanel.setOnFolderChange(e -> changeFolder());
        mainPanel.add(pdfListPanel, BorderLayout.WEST);

        pdfDisplayPanel = new PDFDisplayPanel();
        pdfDisplayPanel.setPDFRenderer(null, 0);
        mainPanel.add(pdfDisplayPanel, BorderLayout.CENTER);

        controlPanel = new ControlPanel();
        controlPanel.setOnPreviousPage(this::goToPreviousPage);
        controlPanel.setOnNextPage(this::goToNextPage);
        mainPanel.add(controlPanel, BorderLayout.SOUTH);

        add(mainPanel, BorderLayout.CENTER);

        pack();
        setLocationRelativeTo(null);
        setSize(1200, 800);
        setMinimumSize(new Dimension(800, 600));
    }

    private void loadPDFsFromFolder() {
        if (!PDFService.isValidFolder(currentFolder)) {
            showFolderNotFoundDialog();
            return;
        }
        
        pdfListPanel.setFolder(currentFolder);
        pdfListPanel.refreshPDFList();
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
            pdfListPanel.setFolder(currentFolder);
            loadPDFsFromFolder();
        }
    }

    private void handlePDFSelection() {
        File selectedFile = pdfListPanel.getSelectedPDF();
        if (selectedFile != null && selectedFile.exists()) {
            loadPDF(selectedFile);
        }
    }

    private void loadPDF(File pdfFile) {
        try {
            documentManager.loadPDF(pdfFile);
            pdfDisplayPanel.setPDFRenderer(documentManager.getRenderer(), documentManager.getPageCount());
            updateControlPanel();
        } catch (IOException e) {
            JOptionPane.showMessageDialog(this,
                    "Error loading PDF: " + e.getMessage(),
                    "Load Error",
                    JOptionPane.ERROR_MESSAGE);
            clearDisplay();
        }
    }

    private void goToPreviousPage() {
        if (pdfDisplayPanel.previousPage()) {
            updateControlPanel();
        }
    }

    private void goToNextPage() {
        if (pdfDisplayPanel.nextPage()) {
            updateControlPanel();
        }
    }

    private void updateControlPanel() {
        int currentPage = pdfDisplayPanel.getCurrentPage() + 1; // Convert to 1-based
        int totalPages = pdfDisplayPanel.getTotalPages();
        boolean canGoPrevious = pdfDisplayPanel.canGoToPrevious();
        boolean canGoNext = pdfDisplayPanel.canGoToNext();
        
        controlPanel.updatePageDisplay(currentPage, totalPages, canGoPrevious, canGoNext);
        
        if (documentManager.getCurrentFile() != null) {
            controlPanel.setInfoMessage("Viewing: " + documentManager.getCurrentFile().getName());
        }
    }

    private void clearDisplay() {
        documentManager.close();
        pdfDisplayPanel.clear();
        controlPanel.updatePageDisplay(0, 0, false, false);
        controlPanel.setInfoMessage("Select a PDF from the list to view");
    }

    private void showFolderNotFoundDialog() {
        JOptionPane.showMessageDialog(this,
                "Folder does not exist: " + currentFolder + "\n\nPlease use 'Change Folder' to select a valid folder.",
                "Folder Not Found",
                JOptionPane.WARNING_MESSAGE);
    }

    @Override
    public void dispose() {
        if (documentManager != null) {
            documentManager.close();
        }
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
