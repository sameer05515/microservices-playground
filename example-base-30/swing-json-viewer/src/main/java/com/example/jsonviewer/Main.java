package com.example.jsonviewer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.event.ListSelectionEvent;
import java.awt.*;
import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class Main extends JFrame {
    private final ObjectMapper mapper = new ObjectMapper();
    private JsonNode root;
    private final DefaultListModel<String> companyModel = new DefaultListModel<>();
    private final DefaultListModel<String> projectModel = new DefaultListModel<>();
    private final JList<String> companyList = new JList<>(companyModel);
    private final JList<String> projectList = new JList<>(projectModel);
    private final JTextArea details = new JTextArea();
    private final JLabel status = new JLabel("Ready");
    private final List<JsonNode> companies = new ArrayList<>();
    private final List<JsonNode> projects = new ArrayList<>();

    public Main() {
        setTitle("JSON Explorer - Swing");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setMinimumSize(new Dimension(1200, 720));
        setLocationRelativeTo(null);
        buildUi();
        loadBundledJson();
    }

    private void buildUi() {
        JPanel rootPanel = new JPanel(new BorderLayout(10, 10));
        rootPanel.setBorder(new EmptyBorder(10, 10, 10, 10));
        setContentPane(rootPanel);

        JToolBar toolbar = new JToolBar();
        toolbar.setFloatable(false);
        JButton open = new JButton("Open JSON...");
        JButton reload = new JButton("Reload");
        JButton clear = new JButton("Clear");
        open.addActionListener(e -> chooseAndLoad());
        reload.addActionListener(e -> loadBundledJson());
        clear.addActionListener(e -> clearView());
        toolbar.add(open); toolbar.add(reload); toolbar.add(clear);
        toolbar.addSeparator();
        toolbar.add(status);
        rootPanel.add(toolbar, BorderLayout.NORTH);

        companyList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        projectList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        companyList.addListSelectionListener(this::companySelected);
        projectList.addListSelectionListener(this::projectSelected);

        details.setEditable(false);
        details.setLineWrap(false);
        details.setWrapStyleWord(false);
        details.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));
        details.setMargin(new Insets(12, 12, 12, 12));

        JScrollPane companiesPane = pane("Companies", companyList);
        JScrollPane projectsPane = pane("Projects", projectList);
        JScrollPane detailsPane = pane("Details", details);

        JSplitPane left = new JSplitPane(JSplitPane.VERTICAL_SPLIT, companiesPane, projectsPane);
        left.setResizeWeight(0.40);
        JSplitPane main = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, left, detailsPane);
        main.setResizeWeight(0.32);
        rootPanel.add(main, BorderLayout.CENTER);

        JLabel footer = new JLabel("Source: data.json | Jackson JSON parser | Java Swing");
        footer.setBorder(new EmptyBorder(5, 2, 0, 0));
        rootPanel.add(footer, BorderLayout.SOUTH);
    }

    private JScrollPane pane(String title, Component component) {
        JScrollPane scroll = new JScrollPane(component);
        scroll.setBorder(BorderFactory.createTitledBorder(title));
        return scroll;
    }

    private void loadBundledJson() {
        try (InputStream in = Main.class.getResourceAsStream("/data.json")) {
            if (in == null) throw new IllegalStateException("data.json not found in resources");
            root = mapper.readTree(in);
            refreshData();
            status.setText("Loaded bundled data.json");
        } catch (Exception ex) {
            showError(ex);
        }
    }

    private void chooseAndLoad() {
        JFileChooser chooser = new JFileChooser();
        chooser.setDialogTitle("Select JSON file");
        chooser.setFileFilter(new javax.swing.filechooser.FileNameExtensionFilter("JSON files", "json"));
        if (chooser.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
            loadFile(chooser.getSelectedFile().toPath());
        }
    }

    private void loadFile(Path path) {
        try {
            root = mapper.readTree(Files.newInputStream(path));
            refreshData();
            status.setText("Loaded: " + path.toAbsolutePath());
        } catch (Exception ex) {
            showError(ex);
        }
    }

    private void refreshData() {
        companyModel.clear(); projectModel.clear();
        companies.clear(); projects.clear();
        details.setText("");

        JsonNode companyArray = root.path("companies");
        if (companyArray.isArray()) {
            for (JsonNode company : companyArray) {
                companies.add(company);
                companyModel.addElement(text(company, "name"));
            }
        }

        JsonNode projectArray = root.path("projects");
        if (projectArray.isArray()) {
            for (JsonNode project : projectArray) projects.add(project);
        }

        if (!companies.isEmpty()) companyList.setSelectedIndex(0);
    }

    private void companySelected(ListSelectionEvent e) {
        if (e.getValueIsAdjusting()) return;
        int index = companyList.getSelectedIndex();
        if (index < 0) return;
        String companyId = text(companies.get(index), "id");
        projectModel.clear();
        for (JsonNode project : projects) {
            if (companyId.equals(text(project, "companyId"))) {
                projectModel.addElement(text(project, "name"));
            }
        }
        showJson(companies.get(index));
        if (!projectModel.isEmpty()) projectList.setSelectedIndex(0);
    }

    private void projectSelected(ListSelectionEvent e) {
        if (e.getValueIsAdjusting()) return;
        int selectedCompany = companyList.getSelectedIndex();
        if (selectedCompany < 0) return;
        String companyId = text(companies.get(selectedCompany), "id");
        int target = projectList.getSelectedIndex();
        if (target < 0) return;
        int count = 0;
        for (JsonNode project : projects) {
            if (companyId.equals(text(project, "companyId"))) {
                if (count++ == target) {
                    showProjectWithDetails(project);
                    return;
                }
            }
        }
    }

    private void showProjectWithDetails(JsonNode project) {
        String projectId = text(project, "id");
        StringBuilder sb = new StringBuilder();
        sb.append("PROJECT\n");
        sb.append("=".repeat(80)).append("\n");
        sb.append("Name       : ").append(text(project, "name")).append('\n');
        sb.append("Status     : ").append(text(project, "status")).append('\n');
        sb.append("Start Date : ").append(text(project, "startDate")).append('\n');
        sb.append("End Date   : ").append(text(project, "endDate")).append('\n');
        sb.append("Created At : ").append(text(project, "createdAt")).append("\n\n");
        sb.append("DESCRIPTION\n");
        sb.append("-".repeat(80)).append("\n");
        sb.append(text(project, "description")).append("\n\n");

        JsonNode detailArray = root.path("projectDetails");
        if (detailArray.isArray()) {
            for (JsonNode d : detailArray) {
                if (projectId.equals(text(d, "projectId"))) {
                    sb.append("PROJECT DETAILS\n");
                    sb.append("-".repeat(80)).append("\n");
                    sb.append("Technology : ").append(text(d, "technology")).append('\n');
                    sb.append("Team Size  : ").append(text(d, "teamSize")).append('\n');
                    sb.append("Budget     : ").append(text(d, "budget")).append('\n');
                    sb.append("Client     : ").append(text(d, "clientName")).append("\n\n");
                    sb.append("NOTES\n");
                    sb.append("-".repeat(80)).append("\n");
                    sb.append(text(d, "notes"));
                    break;
                }
            }
        }
        details.setText(sb.toString());
        details.setCaretPosition(0);
    }

    private void showJson(JsonNode node) {
        try {
            details.setText(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(node));
            details.setCaretPosition(0);
        } catch (Exception ignored) { }
    }

    private void clearView() {
        companyModel.clear(); projectModel.clear(); companies.clear(); projects.clear();
        details.setText(""); status.setText("Cleared");
    }

    private String text(JsonNode node, String field) {
        JsonNode value = node.get(field);
        return value == null || value.isNull() ? "" : value.asText();
    }

    private void showError(Exception ex) {
        status.setText("Error: " + ex.getMessage());
        JOptionPane.showMessageDialog(this, ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); }
            catch (Exception ignored) { }
            new Main().setVisible(true);
        });
    }
}
