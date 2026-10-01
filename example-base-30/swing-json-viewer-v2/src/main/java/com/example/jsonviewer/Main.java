package com.example.jsonviewer;

import com.example.jsonviewer.model.DataModel;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.event.ListSelectionEvent;
import java.awt.*;
import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.List;
import java.util.Objects;

public class Main extends JFrame {
    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    private DataModel data;
    private final DefaultListModel<DataModel.Company> companyModel = new DefaultListModel<>();
    private final DefaultListModel<DataModel.Project> projectModel = new DefaultListModel<>();
    private final JList<DataModel.Company> companyList = new JList<>(companyModel);
    private final JList<DataModel.Project> projectList = new JList<>(projectModel);
    private final JEditorPane descriptionPane = MarkdownRenderer.createPane();
    private final JEditorPane notesPane = MarkdownRenderer.createPane();
    private final JLabel projectTitle = new JLabel("Select a project");
    private final JLabel projectMeta = new JLabel(" ");
    private final JLabel statusBar = new JLabel("Ready");

    public Main() {
        super("JSON Project Explorer — V2 Markdown Renderer");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setMinimumSize(new Dimension(1250, 780));
        setSize(1450, 850);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());
        setJMenuBar(createMenuBar());
        add(createToolbar(), BorderLayout.NORTH);
        add(createMainPanel(), BorderLayout.CENTER);
        add(createStatusBar(), BorderLayout.SOUTH);
        loadBundledJson();
    }

    private JMenuBar createMenuBar() {
        JMenuBar bar = new JMenuBar();
        JMenu file = new JMenu("File");
        JMenuItem open = new JMenuItem("Open JSON...");
        open.addActionListener(e -> openJson());
        JMenuItem reload = new JMenuItem("Reload bundled data");
        reload.addActionListener(e -> loadBundledJson());
        JMenuItem exit = new JMenuItem("Exit");
        exit.addActionListener(e -> System.exit(0));
        file.add(open); file.add(reload); file.addSeparator(); file.add(exit);
        bar.add(file);
        return bar;
    }

    private JPanel createToolbar() {
        JPanel p = new JPanel(new BorderLayout());
        p.setBorder(new EmptyBorder(10, 12, 10, 12));
        JLabel title = new JLabel("JSON Project Explorer");
        title.setFont(new Font("Segoe UI", Font.BOLD, 20));
        JLabel hint = new JLabel("  Markdown is rendered with headings, lists, tables and code blocks");
        hint.setForeground(new Color(90, 90, 90));
        JPanel left = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        left.add(title); left.add(hint);
        JButton open = new JButton("Open JSON");
        open.addActionListener(e -> openJson());
        p.add(left, BorderLayout.WEST); p.add(open, BorderLayout.EAST);
        return p;
    }

    private JPanel createMainPanel() {
        companyList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        projectList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        companyList.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        projectList.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        companyList.addListSelectionListener(this::companySelected);
        projectList.addListSelectionListener(this::projectSelected);

        JPanel companies = listPanel("Companies", companyList);
        JPanel projects = listPanel("Projects", projectList);
        JPanel details = createDetailsPanel();

        JSplitPane left = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, companies, projects);
        left.setDividerLocation(250);
        JSplitPane root = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, left, details);
        root.setDividerLocation(550);
        root.setResizeWeight(0.42);
        return new JPanel(new BorderLayout()) {{ add(root, BorderLayout.CENTER); }};
    }

    private JPanel listPanel(String title, JList<?> list) {
        JPanel p = new JPanel(new BorderLayout(5, 5));
        p.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(new Color(220,220,220)), new EmptyBorder(8,8,8,8)));
        JLabel label = new JLabel(title);
        label.setFont(new Font("Segoe UI", Font.BOLD, 15));
        p.add(label, BorderLayout.NORTH);
        p.add(new JScrollPane(list), BorderLayout.CENTER);
        return p;
    }

    private JPanel createDetailsPanel() {
        JPanel p = new JPanel(new BorderLayout(8, 8));
        p.setBorder(new EmptyBorder(8, 8, 8, 8));
        projectTitle.setFont(new Font("Segoe UI", Font.BOLD, 23));
        projectMeta.setForeground(new Color(90,90,90));
        JPanel header = new JPanel(new BorderLayout(5, 5));
        header.add(projectTitle, BorderLayout.NORTH);
        header.add(projectMeta, BorderLayout.CENTER);

        JTabbedPane tabs = new JTabbedPane();
        tabs.addTab("Description", new JScrollPane(descriptionPane));
        tabs.addTab("Project Details / Notes", createNotesPanel());
        p.add(header, BorderLayout.NORTH);
        p.add(tabs, BorderLayout.CENTER);
        return p;
    }

    private JPanel createNotesPanel() {
        JPanel p = new JPanel(new BorderLayout(8,8));
        JPanel info = new JPanel(new GridLayout(0, 2, 8, 6));
        info.setBorder(new EmptyBorder(10,10,5,10));
        p.add(info, BorderLayout.NORTH);
        p.putClientProperty("info", info);
        p.add(new JScrollPane(notesPane), BorderLayout.CENTER);
        return p;
    }

    private JPanel createStatusBar() {
        JPanel p = new JPanel(new BorderLayout());
        p.setBorder(new EmptyBorder(5, 10, 5, 10));
        statusBar.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        p.add(statusBar, BorderLayout.WEST);
        return p;
    }

    private void companySelected(ListSelectionEvent e) {
        if (e.getValueIsAdjusting() || data == null) return;
        DataModel.Company company = companyList.getSelectedValue();
        projectModel.clear();
        if (company != null) {
            data.projects.stream().filter(p -> Objects.equals(p.companyId, company.id)).forEach(projectModel::addElement);
            statusBar.setText(company.name + " — " + projectModel.size() + " project(s)");
        }
        if (!projectModel.isEmpty()) projectList.setSelectedIndex(0);
    }

    private void projectSelected(ListSelectionEvent e) {
        if (e.getValueIsAdjusting() || data == null) return;
        DataModel.Project project = projectList.getSelectedValue();
        if (project == null) return;
        projectTitle.setText(project.name);
        projectMeta.setText(String.format("Status: %s   |   %s → %s   |   Created: %s", project.status, safe(project.startDate), safe(project.endDate), safe(project.createdAt)));
        MarkdownRenderer.render(descriptionPane, project.description);
        DataModel.ProjectDetail detail = data.projectDetails.stream().filter(d -> Objects.equals(d.projectId, project.id)).findFirst().orElse(null);
        if (detail != null) {
            MarkdownRenderer.render(notesPane, detail.notes);
        } else {
            MarkdownRenderer.render(notesPane, "_No project details available._");
        }
    }

    private String safe(String s) { return s == null || s.isBlank() ? "-" : s; }

    private void loadBundledJson() {
        try (InputStream in = getClass().getResourceAsStream("/data.json")) {
            if (in == null) throw new IllegalStateException("Bundled data.json not found");
            load(mapper.readValue(in, DataModel.class), "Bundled data.json");
        } catch (Exception ex) { showError(ex); }
    }

    private void openJson() {
        JFileChooser chooser = new JFileChooser();
        chooser.setDialogTitle("Select JSON file");
        if (chooser.showOpenDialog(this) != JFileChooser.APPROVE_OPTION) return;
        try {
            File file = chooser.getSelectedFile();
            load(mapper.readValue(Files.readString(file.toPath()), DataModel.class), file.getName());
        } catch (Exception ex) { showError(ex); }
    }

    private void load(DataModel loaded, String source) {
        data = loaded;
        companyModel.clear(); projectModel.clear();
        if (data.companies != null) data.companies.forEach(companyModel::addElement);
        statusBar.setText(source + " loaded — " + companyModel.size() + " companies, " + (data.projects == null ? 0 : data.projects.size()) + " projects");
        if (!companyModel.isEmpty()) companyList.setSelectedIndex(0);
    }

    private void showError(Exception ex) {
        JOptionPane.showMessageDialog(this, ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } catch (Exception ignored) {}
            new Main().setVisible(true);
        });
    }
}
