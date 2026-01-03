package com.example.swing.util;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;

import java.io.File;
import java.io.IOException;

/**
 * Manages PDF document operations
 */
public class PDFDocumentManager {
    private PDDocument document;
    private PDFRenderer renderer;
    private File currentFile;
    
    /**
     * Load a PDF file
     * @param pdfFile PDF file to load
     * @throws IOException If file cannot be loaded
     */
    public void loadPDF(File pdfFile) throws IOException {
        close();
        
        currentFile = pdfFile;
        document = Loader.loadPDF(pdfFile);
        renderer = new PDFRenderer(document);
    }
    
    /**
     * Get the number of pages in the current document
     * @return Number of pages, or 0 if no document is loaded
     */
    public int getPageCount() {
        return document != null ? document.getNumberOfPages() : 0;
    }
    
    /**
     * Get the PDF renderer
     * @return PDFRenderer instance, or null if no document is loaded
     */
    public PDFRenderer getRenderer() {
        return renderer;
    }
    
    /**
     * Check if a document is loaded
     * @return true if a document is loaded
     */
    public boolean isDocumentLoaded() {
        return document != null && renderer != null;
    }
    
    /**
     * Get the current PDF file
     * @return Current PDF file, or null if no file is loaded
     */
    public File getCurrentFile() {
        return currentFile;
    }
    
    /**
     * Close the current document
     */
    public void close() {
        if (document != null) {
            try {
                document.close();
            } catch (IOException e) {
                System.err.println("Error closing PDF: " + e.getMessage());
            }
            document = null;
            renderer = null;
            currentFile = null;
        }
    }
}

