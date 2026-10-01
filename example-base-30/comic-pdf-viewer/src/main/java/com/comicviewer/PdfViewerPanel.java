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
    private final JLabel pageInfoLabel = new JLabel("No PDF selected");

    private PDDocument document;
    private PDFRenderer renderer;
    private Path currentPdf;

    private int currentPage = 0;
    private float zoom = 1.0f;

    public PdfViewerPanel() {
        setLayout(new BorderLayout());

        imageLabel.setHorizontalAlignment(SwingConstants.CENTER);
        imageLabel.setVerticalAlignment(SwingConstants.CENTER);

        JScrollPane scrollPane = new JScrollPane(imageLabel);
        scrollPane.getVerticalScrollBar().setUnitIncrement(30);
        scrollPane.getHorizontalScrollBar().setUnitIncrement(30);

        add(scrollPane, BorderLayout.CENTER);

        JPanel statusPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
        statusPanel.add(pageInfoLabel);

        add(statusPanel, BorderLayout.SOUTH);
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
            JOptionPane.showMessageDialog(
                    this,
                    "Unable to open PDF:\n" + ex.getMessage(),
                    "PDF Error",
                    JOptionPane.ERROR_MESSAGE
            );
        }
    }

    public void previousPage() {
        if (document == null || currentPage <= 0) {
            return;
        }

        currentPage--;
        renderCurrentPage();
    }

    public void nextPage() {
        if (document == null || currentPage >= document.getNumberOfPages() - 1) {
            return;
        }

        currentPage++;
        renderCurrentPage();
    }

    public void zoomIn() {
        if (document == null) {
            return;
        }

        zoom = Math.min(zoom + 0.25f, 4.0f);
        renderCurrentPage();
    }

    public void zoomOut() {
        if (document == null) {
            return;
        }

        zoom = Math.max(zoom - 0.25f, 0.25f);
        renderCurrentPage();
    }

    public void fitPage() {
        if (document == null) {
            return;
        }

        zoom = 1.0f;
        renderCurrentPage();
    }

    private void renderCurrentPage() {
        if (document == null || renderer == null) {
            return;
        }

        SwingWorker<BufferedImage, Void> worker =
                new SwingWorker<>() {

                    @Override
                    protected BufferedImage doInBackground()
                            throws Exception {

                        float dpi = 96f * zoom;

                        return renderer.renderImageWithDPI(
                                currentPage,
                                dpi,
                                ImageType.RGB
                        );
                    }

                    @Override
                    protected void done() {
                        try {
                            BufferedImage image = get();

                            imageLabel.setIcon(new ImageIcon(image));

                            pageInfoLabel.setText(
                                    String.format(
                                            "%s  |  Page %d / %d  |  Zoom %.0f%%",
                                            currentPdf.getFileName(),
                                            currentPage + 1,
                                            document.getNumberOfPages(),
                                            zoom * 100
                                    )
                            );

                            imageLabel.revalidate();
                            imageLabel.repaint();

                        } catch (Exception ex) {
                            JOptionPane.showMessageDialog(
                                    PdfViewerPanel.this,
                                    "Unable to render PDF page:\n"
                                            + ex.getMessage(),
                                    "Render Error",
                                    JOptionPane.ERROR_MESSAGE
                            );
                        }
                    }
                };

        worker.execute();
    }

    private void closeDocument() {
        if (document != null) {
            try {
                document.close();
            } catch (IOException ignored) {
            }
        }

        document = null;
        renderer = null;
    }
}
