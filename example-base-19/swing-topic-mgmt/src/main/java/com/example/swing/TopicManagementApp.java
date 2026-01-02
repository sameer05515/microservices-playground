package com.example.swing;

import com.example.swing.model.Topic;
import com.example.swing.service.TopicService;
import com.example.swing.util.MarkdownRenderer;

import javax.swing.*;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Main Swing application for Topic CRUD operations
 */
public class TopicManagementApp extends JFrame {
    private final TopicService topicService;
    private JTable topicTable;
    private DefaultTableModel tableModel;
    private JTextField titleField;
    private JTextArea contentArea;
    private JEditorPane previewPane;
    private JTabbedPane contentTabbedPane;
    private JButton createButton;
    private JButton updateButton;
    private JButton deleteButton;
    private JButton clearButton;
    private String selectedTopicId;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public TopicManagementApp() {
        this.topicService = new TopicService();
        initializeGUI();
        loadTopics();
    }

    private void initializeGUI() {
        setTitle("Topic Management - CRUD Operations");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));

        // Create main panel
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // Left panel - Topic list
        mainPanel.add(createTopicListPanel(), BorderLayout.CENTER);

        // Right panel - Form
        mainPanel.add(createFormPanel(), BorderLayout.EAST);

        add(mainPanel, BorderLayout.CENTER);

        // Status bar
        add(createStatusBar(), BorderLayout.SOUTH);

        pack();
        setLocationRelativeTo(null);
        setMinimumSize(new Dimension(900, 600));
        setSize(1000, 650);
    }

    private JPanel createTopicListPanel() {
        JPanel panel = new JPanel(new BorderLayout(5, 5));
        panel.setBorder(BorderFactory.createTitledBorder("Topics List"));

        // Table model
        String[] columnNames = {"ID", "Title", "Content Preview", "Created", "Updated"};
        tableModel = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        topicTable = new JTable(tableModel);
        topicTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        topicTable.getSelectionModel().addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                handleTableSelection();
            }
        });
        topicTable.setRowHeight(25);
        topicTable.getColumnModel().getColumn(0).setPreferredWidth(100);
        topicTable.getColumnModel().getColumn(1).setPreferredWidth(150);
        topicTable.getColumnModel().getColumn(2).setPreferredWidth(200);
        topicTable.getColumnModel().getColumn(3).setPreferredWidth(150);
        topicTable.getColumnModel().getColumn(4).setPreferredWidth(150);

        JScrollPane scrollPane = new JScrollPane(topicTable);
        scrollPane.setPreferredSize(new Dimension(600, 500));
        panel.add(scrollPane, BorderLayout.CENTER);

        // Refresh button
        JButton refreshButton = new JButton("Refresh List");
        refreshButton.addActionListener(e -> loadTopics());
        panel.add(refreshButton, BorderLayout.SOUTH);

        return panel;
    }

    private JPanel createFormPanel() {
        JPanel panel = new JPanel(new BorderLayout(5, 5));
        panel.setBorder(BorderFactory.createTitledBorder("Topic Details"));
        panel.setPreferredSize(new Dimension(400, 0));

        // Form fields
        JPanel formPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.anchor = GridBagConstraints.WEST;

        // Title field
        gbc.gridx = 0;
        gbc.gridy = 0;
        formPanel.add(new JLabel("Title:"), gbc);

        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;
        titleField = new JTextField(20);
        formPanel.add(titleField, gbc);

        // Content area with Markdown support
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.NONE;
        gbc.weightx = 0;
        formPanel.add(new JLabel("Content (Markdown):"), gbc);

        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.weightx = 1.0;
        gbc.weighty = 1.0;
        
        // Create tabbed pane for Edit and Preview
        contentTabbedPane = new JTabbedPane();
        
        // Edit tab - Text area for markdown input
        contentArea = new JTextArea(10, 20);
        contentArea.setLineWrap(true);
        contentArea.setWrapStyleWord(true);
        contentArea.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 12));
        JScrollPane editScroll = new JScrollPane(contentArea);
        contentTabbedPane.addTab("Edit", editScroll);
        
        // Preview tab - HTML renderer for markdown preview
        previewPane = new JEditorPane();
        previewPane.setContentType("text/html");
        previewPane.setEditable(false);
        JScrollPane previewScroll = new JScrollPane(previewPane);
        contentTabbedPane.addTab("Preview", previewScroll);
        
        // Add document listener to update preview in real-time
        contentArea.getDocument().addDocumentListener(new DocumentListener() {
            @Override
            public void insertUpdate(DocumentEvent e) {
                updatePreview();
            }

            @Override
            public void removeUpdate(DocumentEvent e) {
                updatePreview();
            }

            @Override
            public void changedUpdate(DocumentEvent e) {
                updatePreview();
            }
        });
        
        formPanel.add(contentTabbedPane, gbc);

        panel.add(formPanel, BorderLayout.CENTER);

        // Buttons panel
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 5, 5));
        
        createButton = new JButton("Create");
        createButton.addActionListener(new CreateButtonListener());
        buttonPanel.add(createButton);

        updateButton = new JButton("Update");
        updateButton.setEnabled(false);
        updateButton.addActionListener(new UpdateButtonListener());
        buttonPanel.add(updateButton);

        deleteButton = new JButton("Delete");
        deleteButton.setEnabled(false);
        deleteButton.addActionListener(new DeleteButtonListener());
        buttonPanel.add(deleteButton);

        clearButton = new JButton("Clear");
        clearButton.addActionListener(new ClearButtonListener());
        buttonPanel.add(clearButton);

        panel.add(buttonPanel, BorderLayout.SOUTH);

        return panel;
    }

    private JPanel createStatusBar() {
        JPanel statusBar = new JPanel(new FlowLayout(FlowLayout.LEFT));
        statusBar.setBorder(BorderFactory.createLoweredBevelBorder());
        JLabel statusLabel = new JLabel("Ready");
        statusBar.add(statusLabel);
        return statusBar;
    }

    private void loadTopics() {
        List<Topic> topics = topicService.getAllTopics();
        tableModel.setRowCount(0);

        for (Topic topic : topics) {
            String contentPreview = topic.getContent() != null && topic.getContent().length() > 50
                    ? topic.getContent().substring(0, 50) + "..."
                    : (topic.getContent() != null ? topic.getContent() : "");
            
            String createdAt = topic.getCreatedAt() != null
                    ? topic.getCreatedAt().format(DATE_FORMATTER)
                    : "";
            String updatedAt = topic.getUpdatedAt() != null
                    ? topic.getUpdatedAt().format(DATE_FORMATTER)
                    : "";

            tableModel.addRow(new Object[]{
                    topic.getId(),
                    topic.getTitle(),
                    contentPreview,
                    createdAt,
                    updatedAt
            });
        }

        updateStatus("Loaded " + topics.size() + " topic(s)");
    }

    private void handleTableSelection() {
        int selectedRow = topicTable.getSelectedRow();
        if (selectedRow >= 0) {
            selectedTopicId = (String) tableModel.getValueAt(selectedRow, 0);
            String title = (String) tableModel.getValueAt(selectedRow, 1);
            
            Topic topic = topicService.getTopicById(selectedTopicId);
            if (topic != null) {
                titleField.setText(topic.getTitle());
                contentArea.setText(topic.getContent() != null ? topic.getContent() : "");
                updatePreview();
                updateButton.setEnabled(true);
                deleteButton.setEnabled(true);
                createButton.setEnabled(false);
            }
        } else {
            clearSelection();
        }
    }

    private void clearSelection() {
        selectedTopicId = null;
        titleField.setText("");
        contentArea.setText("");
        updatePreview();
        updateButton.setEnabled(false);
        deleteButton.setEnabled(false);
        createButton.setEnabled(true);
        topicTable.clearSelection();
    }
    
    /**
     * Update the markdown preview pane
     */
    private void updatePreview() {
        String markdown = contentArea.getText();
        String html = MarkdownRenderer.markdownToHtml(markdown);
        previewPane.setText(html);
        previewPane.setCaretPosition(0); // Scroll to top
    }

    private void updateStatus(String message) {
        // Status bar update can be enhanced if needed
        System.out.println("Status: " + message);
    }

    private boolean validateInput() {
        if (titleField.getText().trim().isEmpty()) {
            JOptionPane.showMessageDialog(this,
                    "Please enter a title.",
                    "Validation Error",
                    JOptionPane.WARNING_MESSAGE);
            return false;
        }
        return true;
    }

    private class CreateButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            if (!validateInput()) {
                return;
            }

            try {
                Topic newTopic = topicService.createTopic(
                        titleField.getText().trim(),
                        contentArea.getText().trim()
                );
                JOptionPane.showMessageDialog(TopicManagementApp.this,
                        "Topic created successfully!",
                        "Success",
                        JOptionPane.INFORMATION_MESSAGE);
                loadTopics();
                clearSelection();
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(TopicManagementApp.this,
                        "Error creating topic: " + ex.getMessage(),
                        "Error",
                        JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private class UpdateButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            if (selectedTopicId == null) {
                JOptionPane.showMessageDialog(TopicManagementApp.this,
                        "Please select a topic to update.",
                        "No Selection",
                        JOptionPane.WARNING_MESSAGE);
                return;
            }

            if (!validateInput()) {
                return;
            }

            try {
                boolean updated = topicService.updateTopic(
                        selectedTopicId,
                        titleField.getText().trim(),
                        contentArea.getText().trim()
                );

                if (updated) {
                    JOptionPane.showMessageDialog(TopicManagementApp.this,
                            "Topic updated successfully!",
                            "Success",
                            JOptionPane.INFORMATION_MESSAGE);
                    loadTopics();
                    clearSelection();
                } else {
                    JOptionPane.showMessageDialog(TopicManagementApp.this,
                            "Topic not found.",
                            "Error",
                            JOptionPane.ERROR_MESSAGE);
                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(TopicManagementApp.this,
                        "Error updating topic: " + ex.getMessage(),
                        "Error",
                        JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private class DeleteButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            if (selectedTopicId == null) {
                JOptionPane.showMessageDialog(TopicManagementApp.this,
                        "Please select a topic to delete.",
                        "No Selection",
                        JOptionPane.WARNING_MESSAGE);
                return;
            }

            int confirm = JOptionPane.showConfirmDialog(TopicManagementApp.this,
                    "Are you sure you want to delete this topic?",
                    "Confirm Delete",
                    JOptionPane.YES_NO_OPTION,
                    JOptionPane.QUESTION_MESSAGE);

            if (confirm == JOptionPane.YES_OPTION) {
                try {
                    boolean deleted = topicService.deleteTopic(selectedTopicId);
                    if (deleted) {
                        JOptionPane.showMessageDialog(TopicManagementApp.this,
                                "Topic deleted successfully!",
                                "Success",
                                JOptionPane.INFORMATION_MESSAGE);
                        loadTopics();
                        clearSelection();
                    } else {
                        JOptionPane.showMessageDialog(TopicManagementApp.this,
                                "Topic not found.",
                                "Error",
                                JOptionPane.ERROR_MESSAGE);
                    }
                } catch (Exception ex) {
                    JOptionPane.showMessageDialog(TopicManagementApp.this,
                            "Error deleting topic: " + ex.getMessage(),
                            "Error",
                            JOptionPane.ERROR_MESSAGE);
                }
            }
        }
    }

    private class ClearButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            clearSelection();
        }
    }

    public static void main(String[] args) {
        // Set look and feel to system default
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Create and show the GUI
        SwingUtilities.invokeLater(() -> {
            new TopicManagementApp().setVisible(true);
        });
    }
}

