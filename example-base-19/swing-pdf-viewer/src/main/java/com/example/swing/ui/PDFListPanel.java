package com.example.swing.ui;

import com.example.swing.service.PDFService;
import com.example.swing.util.AppTheme;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionListener;
import java.io.File;
import java.util.List;

/**
 * Panel for displaying and managing PDF file list
 */
public class PDFListPanel extends JPanel {
    private JList<File> pdfList;
    private DefaultListModel<File> listModel;
    private JLabel folderLabel;
    private JButton refreshButton;
    private JButton changeFolderButton;
    
    private String currentFolder;
    private ActionListener onPDFSelected;
    private ActionListener onFolderChange;
    
    public PDFListPanel(String initialFolder) {
        this.currentFolder = initialFolder;
        initializePanel();
    }
    
    private void initializePanel() {
        setLayout(new BorderLayout(0, 0));
        setBackground(AppTheme.BG_SECONDARY);
        setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(AppTheme.BORDER, 1),
            BorderFactory.createEmptyBorder(15, 15, 15, 15)
        ));
        setPreferredSize(new Dimension(320, 0));
        
        // Header
        add(createHeaderPanel(), BorderLayout.NORTH);
        
        // PDF list
        add(createListPanel(), BorderLayout.CENTER);
        
        // Buttons
        add(createButtonPanel(), BorderLayout.SOUTH);
    }
    
    private JPanel createHeaderPanel() {
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(AppTheme.BG_SECONDARY);
        headerPanel.setBorder(BorderFactory.createEmptyBorder(0, 0, 12, 0));
        
        JLabel titleLabel = new JLabel("PDF Files");
        titleLabel.setFont(AppTheme.FONT_TITLE);
        titleLabel.setForeground(AppTheme.TEXT_PRIMARY);
        headerPanel.add(titleLabel, BorderLayout.NORTH);
        
        folderLabel = new JLabel();
        folderLabel.setFont(AppTheme.FONT_PRIMARY);
        folderLabel.setForeground(AppTheme.TEXT_SECONDARY);
        folderLabel.setBorder(BorderFactory.createEmptyBorder(5, 0, 0, 0));
        headerPanel.add(folderLabel, BorderLayout.CENTER);
        
        updateFolderLabel();
        
        return headerPanel;
    }
    
    private JPanel createListPanel() {
        listModel = new DefaultListModel<>();
        pdfList = new JList<>(listModel);
        pdfList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        pdfList.setCellRenderer(new PDFListCellRenderer());
        pdfList.setBackground(AppTheme.BG_SECONDARY);
        pdfList.setSelectionBackground(AppTheme.SELECTION_BG);
        pdfList.setSelectionForeground(AppTheme.SELECTION);
        pdfList.setFont(AppTheme.FONT_PRIMARY);
        pdfList.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
        pdfList.addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting() && onPDFSelected != null) {
                onPDFSelected.actionPerformed(null);
            }
        });
        
        JScrollPane listScrollPane = new JScrollPane(pdfList);
        listScrollPane.setPreferredSize(new Dimension(300, 500));
        listScrollPane.setBorder(BorderFactory.createLineBorder(AppTheme.BORDER, 1));
        listScrollPane.getViewport().setBackground(AppTheme.BG_SECONDARY);
        ScrollPaneStyler.styleScrollPane(listScrollPane);
        
        JPanel panel = new JPanel(new BorderLayout());
        panel.add(listScrollPane, BorderLayout.CENTER);
        return panel;
    }
    
    private JPanel createButtonPanel() {
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 10));
        buttonPanel.setBackground(AppTheme.BG_SECONDARY);
        buttonPanel.setBorder(BorderFactory.createEmptyBorder(10, 0, 0, 0));
        
        refreshButton = new ModernButton("🔄 Refresh", e -> refreshPDFList());
        changeFolderButton = new ModernButton("📁 Change Folder", e -> {
            if (onFolderChange != null) {
                onFolderChange.actionPerformed(null);
            }
        });
        
        buttonPanel.add(refreshButton);
        buttonPanel.add(changeFolderButton);
        
        return buttonPanel;
    }
    
    /**
     * Set the folder to display PDFs from
     * @param folderPath Path to folder
     */
    public void setFolder(String folderPath) {
        this.currentFolder = folderPath;
        updateFolderLabel();
        refreshPDFList();
    }
    
    /**
     * Get the current folder path
     * @return Current folder path
     */
    public String getFolder() {
        return currentFolder;
    }
    
    /**
     * Get the selected PDF file
     * @return Selected PDF file, or null if none selected
     */
    public File getSelectedPDF() {
        return pdfList.getSelectedValue();
    }
    
    /**
     * Set callback for when a PDF is selected
     * @param listener Action listener
     */
    public void setOnPDFSelected(ActionListener listener) {
        this.onPDFSelected = listener;
    }
    
    /**
     * Set callback for when folder change is requested
     * @param listener Action listener
     */
    public void setOnFolderChange(ActionListener listener) {
        this.onFolderChange = listener;
    }
    
    /**
     * Refresh the PDF list from current folder
     */
    public void refreshPDFList() {
        listModel.clear();
        
        try {
            List<File> pdfFiles = PDFService.getPDFFilesFromFolder(currentFolder);
            for (File pdfFile : pdfFiles) {
                listModel.addElement(pdfFile);
            }
            updateFolderLabel(pdfFiles.size());
        } catch (Exception e) {
            updateFolderLabel(0);
        }
    }
    
    private void updateFolderLabel() {
        updateFolderLabel(-1);
    }
    
    private void updateFolderLabel(int pdfCount) {
        String truncatedPath = PDFService.truncatePath(currentFolder, 35);
        String html;
        
        if (pdfCount >= 0) {
            html = "<html><div style='color: #6c757d; font-size: 11px;'>" + 
                   truncatedPath + " <span style='color: #007bff;'>(" + 
                   pdfCount + " PDFs)</span></div></html>";
        } else {
            html = "<html><div style='color: #6c757d; font-size: 11px;'>" + 
                   truncatedPath + "</div></html>";
        }
        
        folderLabel.setText(html);
        folderLabel.setToolTipText(currentFolder);
    }
}

