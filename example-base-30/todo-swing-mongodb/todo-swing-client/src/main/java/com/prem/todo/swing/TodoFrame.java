package com.prem.todo.swing;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JSplitPane;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.SwingWorker;
import javax.swing.table.DefaultTableModel;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.List;

public class TodoFrame extends JFrame {

    private final TodoApiClient apiClient =
            new TodoApiClient("http://localhost:8080/api/todos");

    private final DefaultTableModel tableModel =
            new DefaultTableModel(
                    new Object[]{"ID", "Title", "Description", "Completed"},
                    0
            ) {
                @Override
                public boolean isCellEditable(int row, int column) {
                    return false;
                }
            };

    private final JTable table = new JTable(tableModel);

    private final JTextField idField = new JTextField();
    private final JTextField titleField = new JTextField();
    private final JTextArea descriptionArea = new JTextArea(5, 30);
    private final JCheckBox completedCheck = new JCheckBox("Completed");

    private final JButton saveButton = new JButton("Save");
    private final JButton updateButton = new JButton("Update");
    private final JButton deleteButton = new JButton("Delete");
    private final JButton clearButton = new JButton("Clear");
    private final JButton refreshButton = new JButton("Refresh");

    public TodoFrame() {
        setTitle("Todo Manager - Swing + Spring Boot + MongoDB");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setMinimumSize(new Dimension(1000, 650));
        setLocationRelativeTo(null);

        buildUi();
        loadTodos();
    }

    private void buildUi() {
        setLayout(new BorderLayout(10, 10));

        JLabel header = new JLabel("Todo Manager");
        header.setFont(new Font("SansSerif", Font.BOLD, 26));
        header.setBorder(BorderFactory.createEmptyBorder(15, 15, 5, 15));

        add(header, BorderLayout.NORTH);

        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.setRowHeight(28);
        table.getColumnModel().getColumn(0).setPreferredWidth(180);
        table.getColumnModel().getColumn(1).setPreferredWidth(180);
        table.getColumnModel().getColumn(2).setPreferredWidth(350);

        table.getSelectionModel().addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                populateFormFromSelectedRow();
            }
        });

        JScrollPane tableScroll = new JScrollPane(table);
        tableScroll.setBorder(
                BorderFactory.createTitledBorder("Todos")
        );

        JPanel form = buildForm();

        JSplitPane splitPane =
                new JSplitPane(
                        JSplitPane.VERTICAL_SPLIT,
                        tableScroll,
                        form
                );

        splitPane.setResizeWeight(0.62);

        add(splitPane, BorderLayout.CENTER);
    }

    private JPanel buildForm() {
        JPanel outer = new JPanel(new BorderLayout(5, 5));
        outer.setBorder(
                BorderFactory.createTitledBorder("Todo Details")
        );

        JPanel form = new JPanel(new GridBagLayout());

        idField.setEditable(false);

        descriptionArea.setLineWrap(true);
        descriptionArea.setWrapStyleWord(true);

        GridBagConstraints c = new GridBagConstraints();
        c.insets = new Insets(5, 5, 5, 5);
        c.fill = GridBagConstraints.HORIZONTAL;
        c.anchor = GridBagConstraints.NORTHWEST;

        addRow(form, c, 0, "ID:", idField);
        addRow(form, c, 1, "Title:", titleField);

        c.gridx = 0;
        c.gridy = 2;
        c.weightx = 0;
        form.add(new JLabel("Description:"), c);

        c.gridx = 1;
        c.weightx = 1;
        c.fill = GridBagConstraints.BOTH;
        c.weighty = 1;
        form.add(new JScrollPane(descriptionArea), c);

        c.gridx = 1;
        c.gridy = 3;
        c.weighty = 0;
        c.fill = GridBagConstraints.HORIZONTAL;
        form.add(completedCheck, c);

        outer.add(form, BorderLayout.CENTER);

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.RIGHT));

        buttons.add(refreshButton);
        buttons.add(clearButton);
        buttons.add(saveButton);
        buttons.add(updateButton);
        buttons.add(deleteButton);

        outer.add(buttons, BorderLayout.SOUTH);

        saveButton.addActionListener(e -> saveTodo());
        updateButton.addActionListener(e -> updateTodo());
        deleteButton.addActionListener(e -> deleteTodo());
        clearButton.addActionListener(e -> clearForm());
        refreshButton.addActionListener(e -> loadTodos());

        return outer;
    }

    private void addRow(
            JPanel panel,
            GridBagConstraints c,
            int row,
            String label,
            JTextField field) {

        c.gridy = row;
        c.gridx = 0;
        c.weightx = 0;
        c.weighty = 0;
        c.fill = GridBagConstraints.HORIZONTAL;
        panel.add(new JLabel(label), c);

        c.gridx = 1;
        c.weightx = 1;
        panel.add(field, c);
    }

    private void loadTodos() {
        setButtonsEnabled(false);

        new SwingWorker<List<Todo>, Void>() {

            @Override
            protected List<Todo> doInBackground() throws Exception {
                return apiClient.findAll();
            }

            @Override
            protected void done() {
                try {
                    List<Todo> todos = get();

                    tableModel.setRowCount(0);

                    for (Todo todo : todos) {
                        tableModel.addRow(new Object[]{
                                todo.getId(),
                                todo.getTitle(),
                                todo.getDescription(),
                                todo.isCompleted()
                        });
                    }

                    setButtonsEnabled(true);

                } catch (Exception ex) {
                    setButtonsEnabled(true);
                    showError(ex);
                }
            }
        }.execute();
    }

    private void saveTodo() {
        String title = titleField.getText().trim();

        if (title.isEmpty()) {
            showMessage("Title is required.");
            return;
        }

        Todo todo = readForm();

        runAsync(
                () -> apiClient.create(todo),
                "Todo created successfully."
        );
    }

    private void updateTodo() {
        if (idField.getText().isBlank()) {
            showMessage("Select a todo first.");
            return;
        }

        if (titleField.getText().trim().isEmpty()) {
            showMessage("Title is required.");
            return;
        }

        Todo todo = readForm();

        runAsync(
                () -> apiClient.update(todo),
                "Todo updated successfully."
        );
    }

    private void deleteTodo() {
        String id = idField.getText();

        if (id.isBlank()) {
            showMessage("Select a todo first.");
            return;
        }

        int choice = JOptionPane.showConfirmDialog(
                this,
                "Delete selected todo?",
                "Confirm Delete",
                JOptionPane.YES_NO_OPTION
        );

        if (choice != JOptionPane.YES_OPTION) {
            return;
        }

        setButtonsEnabled(false);

        new SwingWorker<Void, Void>() {

            @Override
            protected Void doInBackground() throws Exception {
                apiClient.delete(id);
                return null;
            }

            @Override
            protected void done() {
                try {
                    get();
                    clearForm();
                    showMessage("Todo deleted successfully.");
                    loadTodos();
                } catch (Exception ex) {
                    setButtonsEnabled(true);
                    showError(ex);
                }
            }
        }.execute();
    }

    private void runAsync(
            ApiOperation operation,
            String successMessage) {

        setButtonsEnabled(false);

        new SwingWorker<Todo, Void>() {

            @Override
            protected Todo doInBackground() throws Exception {
                return operation.execute();
            }

            @Override
            protected void done() {
                try {
                    get();
                    clearForm();
                    showMessage(successMessage);
                    loadTodos();
                } catch (Exception ex) {
                    setButtonsEnabled(true);
                    showError(ex);
                }
            }
        }.execute();
    }

    private Todo readForm() {
        Todo todo = new Todo();

        todo.setId(idField.getText().isBlank()
                ? null
                : idField.getText());

        todo.setTitle(titleField.getText().trim());
        todo.setDescription(descriptionArea.getText().trim());
        todo.setCompleted(completedCheck.isSelected());

        return todo;
    }

    private void populateFormFromSelectedRow() {
        int row = table.getSelectedRow();

        if (row < 0) {
            return;
        }

        idField.setText(value(row, 0));
        titleField.setText(value(row, 1));
        descriptionArea.setText(value(row, 2));

        Object completed = tableModel.getValueAt(row, 3);
        completedCheck.setSelected(Boolean.TRUE.equals(completed));
    }

    private String value(int row, int column) {
        Object value = tableModel.getValueAt(row, column);
        return value == null ? "" : value.toString();
    }

    private void clearForm() {
        idField.setText("");
        titleField.setText("");
        descriptionArea.setText("");
        completedCheck.setSelected(false);
        table.clearSelection();
    }

    private void setButtonsEnabled(boolean enabled) {
        saveButton.setEnabled(enabled);
        updateButton.setEnabled(enabled);
        deleteButton.setEnabled(enabled);
        clearButton.setEnabled(enabled);
        refreshButton.setEnabled(enabled);
    }

    private void showMessage(String message) {
        JOptionPane.showMessageDialog(
                this,
                message,
                "Todo",
                JOptionPane.INFORMATION_MESSAGE
        );
    }

    private void showError(Exception ex) {
        Throwable cause = ex.getCause() != null
                ? ex.getCause()
                : ex;

        JOptionPane.showMessageDialog(
                this,
                cause.getMessage(),
                "Error",
                JOptionPane.ERROR_MESSAGE
        );
    }

    @FunctionalInterface
    private interface ApiOperation {
        Todo execute() throws Exception;
    }
}
