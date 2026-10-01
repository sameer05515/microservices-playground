package com.example.jarttoexe;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Desktop;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.GridLayout;
import java.awt.Toolkit;
import java.awt.Insets;
import java.awt.datatransfer.StringSelection;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.jar.JarFile;
import java.util.jar.Manifest;

public class Main {
    private final JFrame frame = new JFrame("JAR → EXE Builder V2");
    private final JTextField jarField = new JTextField();
    private final JTextField appNameField = new JTextField("My Java Application");
    private final JTextField versionField = new JTextField("1.0.0");
    private final JTextField mainClassField = new JTextField();
    private final JTextField iconField = new JTextField();
    private final JTextField outputField = new JTextField();
    private final JTextField installDirField = new JTextField();
    private final JComboBox<String> typeBox = new JComboBox<>(new String[]{"Windows Installer (.exe)", "Portable App Image"});
    private final JCheckBox menuBox = new JCheckBox("Start Menu shortcut", true);
    private final JCheckBox desktopBox = new JCheckBox("Desktop shortcut", true);
    private final JCheckBox consoleBox = new JCheckBox("Allow console window", false);
    private final JCheckBox perUserBox = new JCheckBox("Per-user installation", false);
    private final JLabel jdkStatus = statusLabel();
    private final JLabel jpackageStatus = statusLabel();
    private final JLabel wixStatus = statusLabel();
    private final JLabel jarStatus = statusLabel();
    private final JTextArea log = new JTextArea();
    private final JTextArea commandArea = new JTextArea();
    private JButton buildButton;

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new Main().show());
    }

    private void show() {
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setMinimumSize(new Dimension(980, 760));
        frame.setSize(1100, 820);
        frame.setLocationRelativeTo(null);

        try {
            var icon = Main.class.getResource("/app-icon.ico");
            if (icon != null) {
                // ImageIcon can decode the first ICO frame on many JDKs; failures are harmless.
                frame.setIconImage(new ImageIcon(icon).getImage());
            }
        } catch (Exception ignored) {}

        JPanel root = new JPanel(new BorderLayout(10, 10));
        root.setBorder(new EmptyBorder(12, 12, 12, 12));
        root.add(buildTop(), BorderLayout.NORTH);

        JSplitPane center = new JSplitPane(JSplitPane.VERTICAL_SPLIT, buildCommandPanel(), buildLogPanel());
        center.setResizeWeight(0.34);
        root.add(center, BorderLayout.CENTER);

        frame.setContentPane(root);
        wireChanges();
        refreshPrerequisites();
        updateTypeState();
        frame.setVisible(true);
    }

    private JPanel buildTop() {
        JPanel outer = new JPanel(new BorderLayout(8, 8));
        outer.add(buildForm(), BorderLayout.CENTER);
        outer.add(buildPrerequisites(), BorderLayout.SOUTH);
        return outer;
    }

    private JPanel buildForm() {
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Packaging Configuration"));
        GridBagConstraints g = new GridBagConstraints();
        g.insets = new Insets(4, 6, 4, 6);
        g.fill = GridBagConstraints.HORIZONTAL;
        g.weighty = 0;

        int y = 0;
        addRow(panel, g, y++, "JAR file", jarField, browseFile(jarField, "Select JAR", "jar"));
        addRow(panel, g, y++, "Application name", appNameField, empty());
        addRow(panel, g, y++, "Version", versionField, empty());
        addRow(panel, g, y++, "Main class", mainClassField, button("Detect", e -> detectJar()));
        addRow(panel, g, y++, "Icon (.ico)", iconField, browseFile(iconField, "Select ICO", "ico"));
        addRow(panel, g, y++, "Output folder", outputField, browseDir(outputField));
        addRow(panel, g, y++, "Install directory", installDirField, empty());

        g.gridx = 0; g.gridy = y; g.gridwidth = 1; g.weightx = 0;
        panel.add(new JLabel("Package type"), g);
        g.gridx = 1; g.weightx = 1; panel.add(typeBox, g);
        g.gridx = 2; g.weightx = 0; panel.add(empty(), g);
        y++;

        JPanel opts = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 2));
        opts.add(menuBox);
        opts.add(desktopBox);
        opts.add(perUserBox);
        opts.add(consoleBox);
        g.gridx = 0; g.gridy = y; g.gridwidth = 3; g.weightx = 1;
        panel.add(opts, g);

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        buttons.add(button("Check Prerequisites", e -> refreshPrerequisites()));
        buttons.add(button("Show Command", e -> refreshCommand()));
        buttons.add(button("Copy Command", e -> copyCommand()));
        buttons.add(button("Open Output", e -> openOutput()));
        buildButton = button("🚀 Build Package", e -> build());
        buttons.add(buildButton);

        g.gridy = y + 1;
        panel.add(buttons, g);
        return panel;
    }

    private JPanel buildPrerequisites() {
        JPanel p = new JPanel(new GridLayout(1, 4, 8, 0));
        p.setBorder(BorderFactory.createTitledBorder("Prerequisites"));
        p.add(prereqCard("JDK", jdkStatus));
        p.add(prereqCard("jpackage", jpackageStatus));
        p.add(prereqCard("WiX", wixStatus));
        p.add(prereqCard("Selected JAR", jarStatus));
        return p;
    }

    private JPanel prereqCard(String title, JLabel value) {
        JPanel p = new JPanel(new BorderLayout());
        p.add(new JLabel(title), BorderLayout.NORTH);
        value.setFont(value.getFont().deriveFont(Font.BOLD));
        p.add(value, BorderLayout.CENTER);
        return p;
    }

    private JPanel buildCommandPanel() {
        JPanel p = new JPanel(new BorderLayout());
        p.setBorder(BorderFactory.createTitledBorder("Generated jpackage Command"));
        commandArea.setLineWrap(true);
        commandArea.setWrapStyleWord(true);
        commandArea.setEditable(false);
        commandArea.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));
        p.add(new JScrollPane(commandArea), BorderLayout.CENTER);
        return p;
    }

    private JPanel buildLogPanel() {
        JPanel p = new JPanel(new BorderLayout());
        p.setBorder(BorderFactory.createTitledBorder("Build Log"));
        log.setEditable(false);
        log.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 12));
        p.add(new JScrollPane(log), BorderLayout.CENTER);
        return p;
    }

    private void wireChanges() {
        typeBox.addActionListener(e -> {
            updateTypeState();
            refreshCommand();
        });
        DocumentListener dl = new DocumentListener() {
            public void insertUpdate(DocumentEvent e) { refreshCommand(); }
            public void removeUpdate(DocumentEvent e) { refreshCommand(); }
            public void changedUpdate(DocumentEvent e) { refreshCommand(); }
        };
        jarField.getDocument().addDocumentListener(dl);
        appNameField.getDocument().addDocumentListener(dl);
        versionField.getDocument().addDocumentListener(dl);
        mainClassField.getDocument().addDocumentListener(dl);
        iconField.getDocument().addDocumentListener(dl);
        outputField.getDocument().addDocumentListener(dl);
        installDirField.getDocument().addDocumentListener(dl);
    }

    private void updateTypeState() {
        boolean exe = typeBox.getSelectedIndex() == 0;
        menuBox.setEnabled(exe);
        desktopBox.setEnabled(exe);
        perUserBox.setEnabled(exe);
        installDirField.setEnabled(exe);
        if (!exe) {
            menuBox.setSelected(false);
            desktopBox.setSelected(false);
            perUserBox.setSelected(false);
        }
    }

    private void refreshPrerequisites() {
        jdkStatus.setText(checkCommand("java", "-version") ? "✓ Found" : "✗ Missing");
        jpackageStatus.setText(checkCommand("jpackage", "--version") ? "✓ Found" : "✗ Missing");

        boolean wix = checkCommand("wix", "--version")
                || (checkCommand("candle", "-?") && checkCommand("light", "-?"));
        wixStatus.setText(wix ? "✓ Found" : (typeBox.getSelectedIndex() == 0 ? "✗ Missing" : "Not required"));
        boolean jarOk = Files.isRegularFile(Paths.get(jarField.getText().trim()));
        jarStatus.setText(jarOk ? "✓ Selected" : "—");
        refreshCommand();
    }

    private boolean checkCommand(String command, String arg) {
        try {
            Process p = new ProcessBuilder(command, arg).redirectErrorStream(true).start();
            p.waitFor();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private void detectJar() {
        Path jar = Paths.get(jarField.getText().trim());
        if (!Files.isRegularFile(jar)) {
            JOptionPane.showMessageDialog(frame, "Please select a valid JAR file first.", "JAR Required",
                    JOptionPane.WARNING_MESSAGE);
            return;
        }
        try (JarFile jf = new JarFile(jar.toFile())) {
            Manifest mf = jf.getManifest();
            String main = mf == null ? null : mf.getMainAttributes().getValue("Main-Class");
            if (main != null && !main.isBlank()) {
                mainClassField.setText(main.replace('/', '.'));
                append("Detected Main-Class: " + mainClassField.getText());
            } else {
                JOptionPane.showMessageDialog(frame,
                        "Main-Class was not found in the JAR manifest.",
                        "Main-Class Not Found", JOptionPane.INFORMATION_MESSAGE);
            }
        } catch (Exception ex) {
            showError("Unable to read JAR manifest.", ex);
        }
        refreshPrerequisites();
    }

    private List<String> buildCommand() {
        Path jar = Paths.get(jarField.getText().trim());
        List<String> c = new ArrayList<>();
        c.add("jpackage");
        c.add("--type");
        c.add(typeBox.getSelectedIndex() == 0 ? "exe" : "app-image");
        c.add("--name");
        c.add(appNameField.getText().trim());
        c.add("--app-version");
        c.add(versionField.getText().trim());
        c.add("--input");
        c.add(jar.getParent() == null ? "." : jar.getParent().toString());
        c.add("--main-jar");
        c.add(jar.getFileName().toString());
        c.add("--main-class");
        c.add(mainClassField.getText().trim());
        c.add("--dest");
        c.add(outputField.getText().trim());

        if (!iconField.getText().trim().isBlank()) {
            c.add("--icon");
            c.add(iconField.getText().trim());
        }

        if (typeBox.getSelectedIndex() == 0) {
            if (menuBox.isSelected()) c.add("--win-menu");
            if (desktopBox.isSelected()) c.add("--win-shortcut");
            if (perUserBox.isSelected()) c.add("--win-per-user-install");
            if (!installDirField.getText().trim().isBlank()) {
                c.add("--install-dir");
                c.add(installDirField.getText().trim());
            }
        }
        return c;
    }

    private void refreshCommand() {
        try {
            commandArea.setText(toPowerShellCommand(buildCommand()));
        } catch (Exception e) {
            commandArea.setText("Select a JAR and fill the required fields.");
        }
    }

    private String toPowerShellCommand(List<String> c) {
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < c.size(); i++) {
            if (i > 0) b.append(" ");
            b.append(quote(c.get(i)));
            if (i < c.size() - 1) b.append(" `\n");
        }
        return b.toString();
    }

    private String quote(String s) {
        if (s.matches("[A-Za-z0-9_./:=+-]+")) return s;
        return "\"" + s.replace("\"", "\\\"") + "\"";
    }

    private void copyCommand() {
        refreshCommand();
        Toolkit.getDefaultToolkit().getSystemClipboard()
                .setContents(new StringSelection(commandArea.getText()), null);
        append("Command copied to clipboard.");
    }

    private void build() {
        Path jar = Paths.get(jarField.getText().trim());
        if (!Files.isRegularFile(jar)) {
            JOptionPane.showMessageDialog(frame, "Select a valid JAR file.", "Validation", JOptionPane.WARNING_MESSAGE);
            return;
        }
        if (appNameField.getText().trim().isBlank() || mainClassField.getText().trim().isBlank()) {
            JOptionPane.showMessageDialog(frame, "Application name and Main Class are required.",
                    "Validation", JOptionPane.WARNING_MESSAGE);
            return;
        }
        if (!checkCommand("jpackage", "--version")) {
            JOptionPane.showMessageDialog(frame, "jpackage was not found. Run this application with a JDK 17+.",
                    "jpackage Missing", JOptionPane.ERROR_MESSAGE);
            return;
        }
        if (typeBox.getSelectedIndex() == 0 && !checkCommand("wix", "--version")
                && !(checkCommand("candle", "-?") && checkCommand("light", "-?"))) {
            JOptionPane.showMessageDialog(frame,
                    "WiX Toolset was not found on PATH.\nInstall WiX and click Check Prerequisites.",
                    "WiX Missing", JOptionPane.ERROR_MESSAGE);
            return;
        }

        List<String> command = buildCommand();
        buildButton.setEnabled(false);
        log.setText("");
        append("Starting package build...");
        append(toPowerShellCommand(command));

        new Thread(() -> {
            try {
                Files.createDirectories(Paths.get(outputField.getText().trim()));
                ProcessBuilder pb = new ProcessBuilder(command);
                pb.redirectErrorStream(true);
                Process process = pb.start();
                try (BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = br.readLine()) != null) {
                        String x = line;
                        SwingUtilities.invokeLater(() -> append(x));
                    }
                }
                int code = process.waitFor();
                SwingUtilities.invokeLater(() -> {
                    append("");
                    append(code == 0 ? "✓ BUILD SUCCESSFUL" : "✗ BUILD FAILED (exit code " + code + ")");
                    buildButton.setEnabled(true);
                    if (code == 0) {
                        int answer = JOptionPane.showConfirmDialog(frame,
                                "Package created successfully.\nOpen output folder?",
                                "Build Complete", JOptionPane.YES_NO_OPTION);
                        if (answer == JOptionPane.YES_OPTION) openOutput();
                    }
                });
            } catch (Exception ex) {
                SwingUtilities.invokeLater(() -> {
                    append("✗ " + ex);
                    buildButton.setEnabled(true);
                });
            }
        }, "jpackage-builder").start();
    }

    private void openOutput() {
        String s = outputField.getText().trim();
        if (s.isBlank()) return;
        try {
            Path p = Paths.get(s);
            Files.createDirectories(p);
            if (Desktop.isDesktopSupported()) Desktop.getDesktop().open(p.toFile());
        } catch (Exception ex) {
            showError("Unable to open output folder.", ex);
        }
    }

    private void append(String s) {
        SwingUtilities.invokeLater(() -> {
            log.append(s + System.lineSeparator());
            log.setCaretPosition(log.getDocument().getLength());
        });
    }

    private void addRow(JPanel panel, GridBagConstraints g, int y, String label,
                        JTextField field, JButton action) {
        g.gridy = y;
        g.gridwidth = 1;
        g.gridx = 0;
        g.weightx = 0;
        panel.add(new JLabel(label), g);

        g.gridx = 1;
        g.weightx = 1;
        panel.add(field, g);

        g.gridx = 2;
        g.weightx = 0;
        panel.add(action, g);
    }

    private JButton browseFile(JTextField field, String title, String extension) {
        return button("Browse", e -> {
            JFileChooser c = new JFileChooser();
            c.setDialogTitle(title);
            if (c.showOpenDialog(frame) == JFileChooser.APPROVE_OPTION) {
                File f = c.getSelectedFile();
                if (extension.equals("jar") && !f.getName().toLowerCase(Locale.ROOT).endsWith(".jar")) {
                    JOptionPane.showMessageDialog(frame, "Please select a .jar file.");
                    return;
                }
                if (extension.equals("ico") && !f.getName().toLowerCase(Locale.ROOT).endsWith(".ico")) {
                    JOptionPane.showMessageDialog(frame, "Please select a .ico file.");
                    return;
                }
                field.setText(f.getAbsolutePath());
                if (extension.equals("jar")) {
                    if (outputField.getText().isBlank()) outputField.setText(f.getParent());
                    if (appNameField.getText().equals("My Java Application"))
                        appNameField.setText(stripExtension(f.getName()));
                }
                refreshPrerequisites();
            }
        });
    }

    private JButton browseDir(JTextField field) {
        return button("Browse", e -> {
            JFileChooser c = new JFileChooser();
            c.setDialogTitle("Select folder");
            c.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
            if (c.showOpenDialog(frame) == JFileChooser.APPROVE_OPTION) {
                field.setText(c.getSelectedFile().getAbsolutePath());
                refreshCommand();
            }
        });
    }

    private String stripExtension(String name) {
        int i = name.lastIndexOf('.');
        return i > 0 ? name.substring(0, i) : name;
    }

    private JButton button(String text, java.awt.event.ActionListener listener) {
        JButton b = new JButton(text);
        b.addActionListener(listener);
        return b;
    }

    private JButton empty() {
        JButton b = new JButton();
        b.setEnabled(false);
        b.setVisible(false);
        return b;
    }

    private JLabel statusLabel() {
        JLabel l = new JLabel("Checking...");
        l.setOpaque(true);
        l.setBorder(new EmptyBorder(4, 8, 4, 8));
        return l;
    }

    private void showError(String message, Exception ex) {
        append(message + " " + ex.getMessage());
        JOptionPane.showMessageDialog(frame, message + "\n" + ex.getMessage(),
                "Error", JOptionPane.ERROR_MESSAGE);
    }
}
