package com.prem.quesui.ui;

import com.prem.quesui.api.ApiClient;

import javax.swing.*;
import java.awt.*;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

public class MainFrame extends JFrame {
    private final ApiClient apiClient;
    private final JLabel status = new JLabel(" Ready");
    private final QuestionPanel questionPanel;
    private final TagPanel tagPanel;

    public MainFrame() {
        super("Question Bank - Swing UI");
        apiClient = new ApiClient("http://localhost:8080");

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1150, 720);
        setLocationRelativeTo(null);

        questionPanel = new QuestionPanel(apiClient, this::setStatus);
        tagPanel = new TagPanel(apiClient, this::setStatus);

        JTabbedPane tabs = new JTabbedPane();
        tabs.addTab("Questions", questionPanel);
        tabs.addTab("Tags", tagPanel);

        setJMenuBar(createMenuBar());
        add(tabs, BorderLayout.CENTER);
        add(status, BorderLayout.SOUTH);

        addWindowListener(new WindowAdapter() {
            @Override public void windowOpened(WindowEvent e) {
                questionPanel.refresh();
                tagPanel.refresh();
            }
        });
    }

    private JMenuBar createMenuBar() {
        JMenuBar bar = new JMenuBar();

        JMenu settings = new JMenu("Settings");
        JMenuItem apiUrl = new JMenuItem("API Base URL...");
        apiUrl.addActionListener(e -> changeApiUrl());
        settings.add(apiUrl);

        JMenu actions = new JMenu("Actions");
        JMenuItem export = new JMenuItem("Export Question Bank...");
        export.addActionListener(e -> export());
        actions.add(export);

        JMenu help = new JMenu("Help");
        JMenuItem about = new JMenuItem("About");
        about.addActionListener(e -> JOptionPane.showMessageDialog(
                this,
                "Swing Ques-Ans UI\\nJava 17 + Swing + HttpClient + Jackson",
                "About", JOptionPane.INFORMATION_MESSAGE));
        help.add(about);

        bar.add(settings);
        bar.add(actions);
        bar.add(help);
        return bar;
    }

    private void changeApiUrl() {
        String value = JOptionPane.showInputDialog(
                this, "Backend API Base URL:", apiClient.getBaseUrl());

        if (value != null && !value.isBlank()) {
            apiClient.setBaseUrl(value);
            setStatus("API URL changed to " + apiClient.getBaseUrl());
            questionPanel.refresh();
            tagPanel.refresh();
        }
    }

    private void export() {
        JFileChooser chooser = new JFileChooser();
        chooser.setSelectedFile(new java.io.File("question-bank.json"));

        if (chooser.showSaveDialog(this) != JFileChooser.APPROVE_OPTION) return;

        try {
            java.nio.file.Files.writeString(
                    chooser.getSelectedFile().toPath(),
                    apiClient.exportAll());
            setStatus("Export completed.");
            JOptionPane.showMessageDialog(this, "Export saved successfully.");
        } catch (Exception ex) {
            showError(ex);
        }
    }

    private void setStatus(String text) {
        status.setText(" " + text);
    }

    public void showError(Exception ex) {
        setStatus("Error");
        JOptionPane.showMessageDialog(
                this,
                ex.getMessage(),
                "API Error",
                JOptionPane.ERROR_MESSAGE);
    }
}
