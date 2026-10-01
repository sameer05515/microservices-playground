package com.prem.todo.ui;

import com.prem.todo.model.Todo;
import com.prem.todo.service.TodoService;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class TodoFrame extends JFrame {

    private final TodoService service;

    private final JTextField titleField = new JTextField();
    private final JTextArea descriptionArea = new JTextArea(4, 30);

    private final DefaultTableModel tableModel = new DefaultTableModel(
            new Object[]{"ID", "Title", "Description", "Status"}, 0) {
        @Override
        public boolean isCellEditable(int row, int column) {
            return false;
        }
    };

    private final JTable table = new JTable(tableModel);

    public TodoFrame(TodoService service) {
        this.service = service;

        setTitle("Swing Todo - JSON CRUD");
        setSize(900, 600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        buildUI();
        loadTodos();
    }

    private void buildUI() {
        JPanel root = new JPanel(new BorderLayout(12, 12));
        root.setBorder(new EmptyBorder(15, 15, 15, 15));
        setContentPane(root);

        JLabel heading = new JLabel("Todo Manager");
        heading.setFont(new Font("SansSerif", Font.BOLD, 26));
        root.add(heading, BorderLayout.NORTH);

        JPanel center = new JPanel(new BorderLayout(10, 10));

        JPanel form = new JPanel(new GridBagLayout());
        form.setBorder(BorderFactory.createTitledBorder("Todo Details"));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(6, 6, 6, 6);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0; gbc.gridy = 0;
        form.add(new JLabel("Title:"), gbc);

        gbc.gridx = 1; gbc.weightx = 1;
        form.add(titleField, gbc);

        gbc.gridx = 0; gbc.gridy = 1; gbc.weightx = 0;
        form.add(new JLabel("Description:"), gbc);

        gbc.gridx = 1; gbc.weightx = 1;
        descriptionArea.setLineWrap(true);
        descriptionArea.setWrapStyleWord(true);
        form.add(new JScrollPane(descriptionArea), gbc);

        center.add(form, BorderLayout.NORTH);

        table.setRowHeight(28);
        table.getColumnModel().getColumn(0).setPreferredWidth(50);
        table.getColumnModel().getColumn(1).setPreferredWidth(180);
        table.getColumnModel().getColumn(2).setPreferredWidth(450);
        table.getColumnModel().getColumn(3).setPreferredWidth(100);

        table.getSelectionModel().addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                loadSelectedTodoIntoForm();
            }
        });

        center.add(new JScrollPane(table), BorderLayout.CENTER);
        root.add(center, BorderLayout.CENTER);

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 5));

        JButton addButton = new JButton("Add");
        JButton updateButton = new JButton("Update");
        JButton deleteButton = new JButton("Delete");
        JButton toggleButton = new JButton("Toggle Status");
        JButton clearButton = new JButton("Clear");
        JButton refreshButton = new JButton("Refresh");

        addButton.addActionListener(e -> addTodo());
        updateButton.addActionListener(e -> updateTodo());
        deleteButton.addActionListener(e -> deleteTodo());
        toggleButton.addActionListener(e -> toggleTodo());
        clearButton.addActionListener(e -> clearForm());
        refreshButton.addActionListener(e -> loadTodos());

        buttons.add(addButton);
        buttons.add(updateButton);
        buttons.add(deleteButton);
        buttons.add(toggleButton);
        buttons.add(clearButton);
        buttons.add(refreshButton);

        root.add(buttons, BorderLayout.SOUTH);
    }

    private void loadTodos() {
        tableModel.setRowCount(0);

        List<Todo> todos = service.findAll();

        for (Todo todo : todos) {
            tableModel.addRow(new Object[]{
                    todo.getId(),
                    todo.getTitle(),
                    todo.getDescription(),
                    todo.isCompleted() ? "Completed" : "Pending"
            });
        }
    }

    private void addTodo() {
        String title = titleField.getText().trim();
        String description = descriptionArea.getText().trim();

        if (title.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Title is required.");
            return;
        }

        service.add(title, description);
        loadTodos();
        clearForm();
    }

    private void updateTodo() {
        Todo todo = getSelectedTodo();

        if (todo == null) {
            JOptionPane.showMessageDialog(this, "Please select a todo.");
            return;
        }

        String title = titleField.getText().trim();
        String description = descriptionArea.getText().trim();

        if (title.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Title is required.");
            return;
        }

        service.update(todo.getId(), title, description, todo.isCompleted());
        loadTodos();
        clearForm();
    }

    private void deleteTodo() {
        Todo todo = getSelectedTodo();

        if (todo == null) {
            JOptionPane.showMessageDialog(this, "Please select a todo.");
            return;
        }

        int answer = JOptionPane.showConfirmDialog(
                this,
                "Delete '" + todo.getTitle() + "'?",
                "Confirm Delete",
                JOptionPane.YES_NO_OPTION
        );

        if (answer == JOptionPane.YES_OPTION) {
            service.delete(todo.getId());
            loadTodos();
            clearForm();
        }
    }

    private void toggleTodo() {
        Todo todo = getSelectedTodo();

        if (todo == null) {
            JOptionPane.showMessageDialog(this, "Please select a todo.");
            return;
        }

        service.toggleCompleted(todo.getId());
        loadTodos();
    }

    private Todo getSelectedTodo() {
        int row = table.getSelectedRow();

        if (row < 0) {
            return null;
        }

        long id = ((Number) tableModel.getValueAt(row, 0)).longValue();

        return service.findAll()
                .stream()
                .filter(t -> t.getId() == id)
                .findFirst()
                .orElse(null);
    }

    private void loadSelectedTodoIntoForm() {
        Todo todo = getSelectedTodo();

        if (todo != null) {
            titleField.setText(todo.getTitle());
            descriptionArea.setText(todo.getDescription());
        }
    }

    private void clearForm() {
        titleField.setText("");
        descriptionArea.setText("");
        table.clearSelection();
        titleField.requestFocus();
    }
}
