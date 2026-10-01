package com.comicviewer;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.io.IOException;
import java.nio.file.*;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class ComicViewerFrame extends JFrame {
    private static final Path COMICS_DIRECTORY = Paths.get("D:\\comics");

    private final DefaultListModel<Path> pdfListModel = new DefaultListModel<>();
    private final JList<Path> pdfList = new JList<>(pdfListModel);
    private final PdfViewerPanel viewerPanel = new PdfViewerPanel();

    private static final Color BG = new Color(20, 22, 27);
    private static final Color SIDEBAR = new Color(28, 31, 38);
    private static final Color TOOLBAR = new Color(35, 38, 46);
    private static final Color TEXT = new Color(235, 238, 245);
    private static final Color MUTED = new Color(155, 162, 175);
    private static final Color ACCENT = new Color(255, 183, 77);

    public ComicViewerFrame() {
        setTitle("Comic Reader — D:\\comics");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1450, 920);
        setMinimumSize(new Dimension(1000, 700));
        setLocationRelativeTo(null);
        getContentPane().setBackground(BG);

        buildUi();
        loadPdfFiles();
    }

    private void buildUi() {
        setLayout(new BorderLayout());

        JPanel toolbar = new JPanel(new BorderLayout());
        toolbar.setBackground(TOOLBAR);
        toolbar.setBorder(new EmptyBorder(10, 14, 10, 14));

        JLabel title = new JLabel("  COMIC READER");
        title.setForeground(ACCENT);
        title.setFont(new Font("SansSerif", Font.BOLD, 18));
        toolbar.add(title, BorderLayout.WEST);

        JPanel controls = new JPanel(new FlowLayout(FlowLayout.RIGHT, 7, 0));
        controls.setOpaque(false);

        JButton refresh = button("⟳  Refresh");
        JButton previous = button("‹  Previous");
        JButton next = button("Next  ›");
        JButton zoomOut = button("−");
        JButton zoomIn = button("+");
        JButton fit = button("Fit");

        refresh.addActionListener(e -> loadPdfFiles());
        previous.addActionListener(e -> viewerPanel.previousPage());
        next.addActionListener(e -> viewerPanel.nextPage());
        zoomOut.addActionListener(e -> viewerPanel.zoomOut());
        zoomIn.addActionListener(e -> viewerPanel.zoomIn());
        fit.addActionListener(e -> viewerPanel.fitPage());

        controls.add(refresh);
        controls.add(previous);
        controls.add(next);
        controls.add(zoomOut);
        controls.add(zoomIn);
        controls.add(fit);
        toolbar.add(controls, BorderLayout.EAST);

        add(toolbar, BorderLayout.NORTH);

        JPanel sidebar = new JPanel(new BorderLayout());
        sidebar.setBackground(SIDEBAR);
        sidebar.setBorder(new EmptyBorder(14, 12, 12, 12));

        JLabel library = new JLabel("LIBRARY");
        library.setForeground(MUTED);
        library.setFont(new Font("SansSerif", Font.BOLD, 12));
        library.setBorder(new EmptyBorder(0, 4, 10, 0));
        sidebar.add(library, BorderLayout.NORTH);

        pdfList.setBackground(SIDEBAR);
        pdfList.setForeground(TEXT);
        pdfList.setSelectionBackground(new Color(92, 64, 28));
        pdfList.setSelectionForeground(Color.WHITE);
        pdfList.setFont(new Font("SansSerif", Font.PLAIN, 14));
        pdfList.setFixedCellHeight(38);
        pdfList.setBorder(new EmptyBorder(4, 4, 4, 4));

        pdfList.setCellRenderer(new DefaultListCellRenderer() {
            @Override
            public Component getListCellRendererComponent(
                    JList<?> list, Object value, int index,
                    boolean selected, boolean focus) {
                JLabel label = (JLabel) super.getListCellRendererComponent(
                        list, value, index, selected, focus);
                label.setText("  " + ((Path)value).getFileName());
                label.setBorder(new EmptyBorder(0, 4, 0, 4));
                label.setBackground(selected ? new Color(92,64,28) : SIDEBAR);
                label.setForeground(selected ? Color.WHITE : TEXT);
                return label;
            }
        });

        pdfList.addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting() && pdfList.getSelectedValue() != null)
                viewerPanel.openPdf(pdfList.getSelectedValue());
        });

        sidebar.add(new JScrollPane(pdfList), BorderLayout.CENTER);

        JSplitPane split = new JSplitPane(
                JSplitPane.HORIZONTAL_SPLIT,
                sidebar,
                viewerPanel);
        split.setDividerLocation(310);
        split.setBorder(null);
        split.setDividerSize(5);

        add(split, BorderLayout.CENTER);

        JLabel footer = new JLabel("  D:\\comics");
        footer.setForeground(MUTED);
        footer.setBackground(new Color(16,18,22));
        footer.setOpaque(true);
        footer.setBorder(new EmptyBorder(7, 8, 7, 8));
        add(footer, BorderLayout.SOUTH);
    }

    private JButton button(String text) {
        JButton b = new JButton(text);
        b.setForeground(TEXT);
        b.setBackground(new Color(48, 52, 61));
        b.setFont(new Font("SansSerif", Font.BOLD, 12));
        b.setFocusPainted(false);
        b.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(70,75,85)),
                new EmptyBorder(7, 12, 7, 12)));
        b.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        return b;
    }

    private void loadPdfFiles() {
        pdfListModel.clear();

        if (!Files.exists(COMICS_DIRECTORY)) {
            JOptionPane.showMessageDialog(this,
                    "Directory not found:\n" + COMICS_DIRECTORY,
                    "Comic Library", JOptionPane.WARNING_MESSAGE);
            return;
        }

        try {
            List<Path> files = Files.list(COMICS_DIRECTORY)
                    .filter(Files::isRegularFile)
                    .filter(p -> p.toString().toLowerCase().endsWith(".pdf"))
                    .sorted(Comparator.comparing(
                            p -> p.getFileName().toString().toLowerCase()))
                    .collect(Collectors.toList());

            files.forEach(pdfListModel::addElement);
            if (!files.isEmpty()) pdfList.setSelectedIndex(0);
        } catch (IOException ex) {
            JOptionPane.showMessageDialog(this,
                    ex.getMessage(), "Unable to read library",
                    JOptionPane.ERROR_MESSAGE);
        }
    }
}
