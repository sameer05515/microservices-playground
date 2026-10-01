package com.comicviewer;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.rendering.ImageType;

import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Path;

public class PdfViewerPanel extends JPanel {
    private final JLabel imageLabel = new JLabel();
    private final JLabel info = new JLabel(" Select a comic ");

    private PDDocument document;
    private PDFRenderer renderer;
    private Path currentPdf;
    private int currentPage;
    private float zoom = 1.0f;

    public PdfViewerPanel() {
        setLayout(new BorderLayout());
        setBackground(new Color(20,22,27));

        imageLabel.setHorizontalAlignment(SwingConstants.CENTER);
        imageLabel.setVerticalAlignment(SwingConstants.CENTER);
        imageLabel.setBackground(new Color(20,22,27));
        imageLabel.setOpaque(true);

        JScrollPane scroll = new JScrollPane(imageLabel);
        scroll.setBorder(null);
        scroll.getViewport().setBackground(new Color(20,22,27));
        scroll.getVerticalScrollBar().setUnitIncrement(30);
        add(scroll, BorderLayout.CENTER);

        info.setForeground(new Color(190,195,205));
        info.setBackground(new Color(16,18,22));
        info.setOpaque(true);
        info.setHorizontalAlignment(SwingConstants.CENTER);
        info.setBorder(new javax.swing.border.EmptyBorder(7, 10, 7, 10));
        add(info, BorderLayout.SOUTH);
    }

    public void openPdf(Path pdf) {
        closeDocument();
        try {
            currentPdf = pdf;
            document = Loader.loadPDF(pdf.toFile());
            renderer = new PDFRenderer(document);
            currentPage = 0;
            zoom = 1.0f;
            renderCurrentPage();
        } catch (IOException ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(),
                    "PDF Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public void previousPage() {
        if (document != null && currentPage > 0) {
            currentPage--;
            renderCurrentPage();
        }
    }

    public void nextPage() {
        if (document != null && currentPage < document.getNumberOfPages() - 1) {
            currentPage++;
            renderCurrentPage();
        }
    }

    public void zoomIn() {
        if (document != null) {
            zoom = Math.min(zoom + .25f, 4f);
            renderCurrentPage();
        }
    }

    public void zoomOut() {
        if (document != null) {
            zoom = Math.max(zoom - .25f, .25f);
            renderCurrentPage();
        }
    }

    public void fitPage() {
        if (document != null) {
            zoom = 1f;
            renderCurrentPage();
        }
    }

    private void renderCurrentPage() {
        SwingWorker<BufferedImage, Void> worker = new SwingWorker<>() {
            protected BufferedImage doInBackground() throws Exception {
                return renderer.renderImageWithDPI(
                        currentPage, 96f * zoom, ImageType.RGB);
            }

            protected void done() {
                try {
                    imageLabel.setIcon(new ImageIcon(get()));
                    info.setText(String.format(
                            "  %s   •   Page %d / %d   •   %.0f%%  ",
                            currentPdf.getFileName(),
                            currentPage + 1,
                            document.getNumberOfPages(),
                            zoom * 100));
                    imageLabel.revalidate();
                    imageLabel.repaint();
                } catch (Exception e) {
                    info.setText(" Render error: " + e.getMessage());
                }
            }
        };
        worker.execute();
    }

    private void closeDocument() {
        if (document != null) {
            try { document.close(); } catch (IOException ignored) {}
        }
        document = null;
        renderer = null;
    }
}
