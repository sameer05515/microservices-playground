package com.comicviewer;

import javax.swing.*;
import java.awt.*;
import java.io.IOException;
import java.nio.file.*;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class ComicViewerFrame extends JFrame {

    private static final Path COMICS_DIRECTORY =
            Paths.get("D:\\comics");

    private final DefaultListModel<Path> pdfListModel = new DefaultListModel<>();
    private final JList<Path> pdfList = new JList<>(pdfListModel);
    private final PdfViewerPanel viewerPanel = new PdfViewerPanel();

    public ComicViewerFrame() {
        setTitle("Comic PDF Viewer");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1400, 900);
        setLocationRelativeTo(null);

        buildUi();
        loadPdfFiles();
    }

    private void buildUi() {
        setLayout(new BorderLayout());

        JPanel toolbar = new JPanel(new FlowLayout(FlowLayout.LEFT));

        JButton refreshButton = new JButton("Refresh");
        JButton previousButton = new JButton("Previous");
        JButton nextButton = new JButton("Next");
        JButton zoomOutButton = new JButton("Zoom -");
        JButton zoomInButton = new JButton("Zoom +");
        JButton fitButton = new JButton("Fit Page");

        refreshButton.addActionListener(e -> loadPdfFiles());
        previousButton.addActionListener(e -> viewerPanel.previousPage());
        nextButton.addActionListener(e -> viewerPanel.nextPage());
        zoomOutButton.addActionListener(e -> viewerPanel.zoomOut());
        zoomInButton.addActionListener(e -> viewerPanel.zoomIn());
        fitButton.addActionListener(e -> viewerPanel.fitPage());

        toolbar.add(refreshButton);
        toolbar.add(previousButton);
        toolbar.add(nextButton);
        toolbar.add(zoomOutButton);
        toolbar.add(zoomInButton);
        toolbar.add(fitButton);

        add(toolbar, BorderLayout.NORTH);

        pdfList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        pdfList.setCellRenderer(new DefaultListCellRenderer() {
            @Override
            public Component getListCellRendererComponent(
                    JList<?> list,
                    Object value,
                    int index,
                    boolean isSelected,
                    boolean cellHasFocus) {

                String name = ((Path) value).getFileName().toString();

                return super.getListCellRendererComponent(
                        list, name, index, isSelected, cellHasFocus);
            }
        });

        pdfList.addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                Path selected = pdfList.getSelectedValue();
                if (selected != null) {
                    viewerPanel.openPdf(selected);
                }
            }
        });

        pdfList.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseClicked(java.awt.event.MouseEvent e) {
                if (e.getClickCount() == 2) {
                    Path selected = pdfList.getSelectedValue();
                    if (selected != null) {
                        viewerPanel.openPdf(selected);
                    }
                }
            }
        });

        JScrollPane listScrollPane = new JScrollPane(pdfList);
        listScrollPane.setPreferredSize(new Dimension(300, 0));

        JSplitPane splitPane = new JSplitPane(
                JSplitPane.HORIZONTAL_SPLIT,
                listScrollPane,
                viewerPanel
        );

        splitPane.setDividerLocation(300);

        add(splitPane, BorderLayout.CENTER);
    }

    private void loadPdfFiles() {
        pdfListModel.clear();

        if (!Files.exists(COMICS_DIRECTORY)) {
            JOptionPane.showMessageDialog(
                    this,
                    "Comic directory does not exist:\n" + COMICS_DIRECTORY,
                    "Directory Not Found",
                    JOptionPane.WARNING_MESSAGE
            );
            return;
        }

        try {
            List<Path> pdfFiles = Files.list(COMICS_DIRECTORY)
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName()
                            .toString()
                            .toLowerCase()
                            .endsWith(".pdf"))
                    .sorted(Comparator.comparing(
                            path -> path.getFileName().toString().toLowerCase()))
                    .collect(Collectors.toList());

            pdfFiles.forEach(pdfListModel::addElement);

            if (!pdfFiles.isEmpty()) {
                pdfList.setSelectedIndex(0);
            }

        } catch (IOException ex) {
            JOptionPane.showMessageDialog(
                    this,
                    "Unable to read comic directory:\n" + ex.getMessage(),
                    "Error",
                    JOptionPane.ERROR_MESSAGE
            );
        }
    }
}
