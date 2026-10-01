package com.prem.todo.ui;

import com.prem.todo.model.Todo;
import com.prem.todo.service.TodoService;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class TodoFrame extends JFrame {

    private static final Color BG = new Color(22, 24, 29);
    private static final Color PANEL = new Color(30, 33, 40);
    private static final Color FIELD = new Color(40, 44, 53);
    private static final Color TEXT = new Color(235, 238, 245);
    private static final Color MUTED = new Color(155, 163, 177);
    private static final Color ACCENT = new Color(92, 125, 255);

    private final TodoService service;

    private final JTextField title = new JTextField();
    private final JTextField search = new JTextField();
    private final JTextField dueDate = new JTextField();
    private final JTextArea description = new JTextArea(3, 25);
    private final JComboBox<String> priority = new JComboBox<>(
            new String[]{"LOW", "MEDIUM", "HIGH"});
    private final JComboBox<String> filter = new JComboBox<>(
            new String[]{"ALL", "PENDING", "COMPLETED"});

    private final DefaultTableModel model = new DefaultTableModel(
            new Object[]{"ID", "TITLE", "DESCRIPTION", "PRIORITY", "DUE DATE", "STATUS"}, 0) {
        public boolean isCellEditable(int r, int c) { return false; }
    };

    private final JTable table = new JTable(model);

    public TodoFrame(TodoService service) {
        this.service = service;
        setTitle("Todo Manager V2");
        setSize(1100, 680);
        setMinimumSize(new Dimension(900, 580));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        buildUI();
        loadTable();
    }

    private void buildUI() {
        JPanel root = new JPanel(new BorderLayout(14, 14));
        root.setBackground(BG);
        root.setBorder(new EmptyBorder(18, 18, 18, 18));
        setContentPane(root);

        JPanel header = new JPanel(new BorderLayout(12, 8));
        header.setOpaque(false);

        JLabel titleLabel = new JLabel("Todo Manager");
        titleLabel.setForeground(TEXT);
        titleLabel.setFont(new Font("SansSerif", Font.BOLD, 28));

        JLabel subtitle = new JLabel("JSON-powered desktop task manager");
        subtitle.setForeground(MUTED);
        subtitle.setFont(new Font("SansSerif", Font.PLAIN, 13));

        JPanel heading = new JPanel();
        heading.setOpaque(false);
        heading.setLayout(new BoxLayout(heading, BoxLayout.Y_AXIS));
        heading.add(titleLabel);
        heading.add(Box.createVerticalStrut(3));
        heading.add(subtitle);

        header.add(heading, BorderLayout.WEST);

        JPanel searchPanel = new JPanel(new GridLayout(1, 2, 8, 0));
        searchPanel.setOpaque(false);
        styleField(search);
        search.setToolTipText("Search title or description");
        search.getDocument().addDocumentListener((SimpleDocumentListener) e -> loadTable());
        styleCombo(filter);
        filter.addActionListener(e -> loadTable());
        searchPanel.add(search);
        searchPanel.add(filter);
        header.add(searchPanel, BorderLayout.EAST);

        root.add(header, BorderLayout.NORTH);

        JPanel center = new JPanel(new BorderLayout(12, 12));
        center.setOpaque(false);

        JPanel form = new JPanel(new GridBagLayout());
        form.setBackground(PANEL);
        form.setBorder(new EmptyBorder(12, 14, 12, 14));

        GridBagConstraints g = new GridBagConstraints();
        g.insets = new Insets(5, 6, 5, 6);
        g.fill = GridBagConstraints.HORIZONTAL;

        addLabel(form, "Title", 0, 0, g);
        addComponent(form, title, 1, 0, 1, g);

        addLabel(form, "Priority", 2, 0, g);
        styleCombo(priority);
        addComponent(form, priority, 3, 0, 1, g);

        addLabel(form, "Due Date", 0, 1, g);
        dueDate.setToolTipText("YYYY-MM-DD");
        styleField(dueDate);
        addComponent(form, dueDate, 1, 1, 1, g);

        addLabel(form, "Description", 2, 1, g);
        description.setLineWrap(true);
        description.setWrapStyleWord(true);
        description.setBackground(FIELD);
        description.setForeground(TEXT);
        description.setCaretColor(TEXT);
        JScrollPane descScroll = new JScrollPane(description);
        descScroll.setBorder(BorderFactory.createEmptyBorder());
        addComponent(form, descScroll, 3, 1, 1, g);

        center.add(form, BorderLayout.NORTH);

        styleTable();
        center.add(new JScrollPane(table), BorderLayout.CENTER);

        root.add(center, BorderLayout.CENTER);

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 0));
        buttons.setOpaque(false);

        JButton add = button("＋ Add", ACCENT);
        JButton update = button("✎ Update", new Color(70, 150, 105));
        JButton toggle = button("✓ Toggle", new Color(115, 90, 180));
        JButton delete = button("✕ Delete", new Color(190, 75, 75));
        JButton clear = button("Clear", new Color(70, 76, 88));
        JButton refresh = button("↻ Refresh", new Color(70, 76, 88));

        add.addActionListener(e -> addTodo());
        update.addActionListener(e -> updateTodo());
        toggle.addActionListener(e -> toggleTodo());
        delete.addActionListener(e -> deleteTodo());
        clear.addActionListener(e -> clearForm());
        refresh.addActionListener(e -> loadTable());

        buttons.add(add);
        buttons.add(update);
        buttons.add(toggle);
        buttons.add(delete);
        buttons.add(clear);
        buttons.add(refresh);

        root.add(buttons, BorderLayout.SOUTH);
    }

    private void styleTable() {
        table.setRowHeight(34);
        table.setBackground(PANEL);
        table.setForeground(TEXT);
        table.setGridColor(new Color(55, 59, 69));
        table.setSelectionBackground(new Color(55, 75, 125));
        table.setSelectionForeground(Color.WHITE);
        table.setFont(new Font("SansSerif", Font.PLAIN, 13));
        table.getTableHeader().setBackground(new Color(37, 41, 49));
        table.getTableHeader().setForeground(TEXT);
        table.getTableHeader().setFont(new Font("SansSerif", Font.BOLD, 12));
        table.getTableHeader().setReorderingAllowed(false);

        table.getColumnModel().getColumn(0).setPreferredWidth(45);
        table.getColumnModel().getColumn(1).setPreferredWidth(170);
        table.getColumnModel().getColumn(2).setPreferredWidth(350);
        table.getColumnModel().getColumn(3).setPreferredWidth(90);
        table.getColumnModel().getColumn(4).setPreferredWidth(100);
        table.getColumnModel().getColumn(5).setPreferredWidth(100);

        DefaultTableCellRenderer center = new DefaultTableCellRenderer();
        center.setHorizontalAlignment(SwingConstants.CENTER);
        table.getColumnModel().getColumn(0).setCellRenderer(center);
        table.getColumnModel().getColumn(3).setCellRenderer(center);
        table.getColumnModel().getColumn(4).setCellRenderer(center);
        table.getColumnModel().getColumn(5).setCellRenderer(center);

        table.getSelectionModel().addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) loadSelected();
        });
    }

    private void loadTable() {
        model.setRowCount(0);
        String q = search.getText().trim().toLowerCase();
        String f = (String) filter.getSelectedItem();

        for (Todo t : service.findAll()) {
            boolean matchesText = q.isEmpty()
                    || t.getTitle().toLowerCase().contains(q)
                    || t.getDescription().toLowerCase().contains(q);

            boolean matchesFilter = "ALL".equals(f)
                    || ("PENDING".equals(f) && !t.isCompleted())
                    || ("COMPLETED".equals(f) && t.isCompleted());

            if (matchesText && matchesFilter) {
                model.addRow(new Object[]{
                        t.getId(), t.getTitle(), t.getDescription(),
                        t.getPriority(), t.getDueDate(),
                        t.isCompleted() ? "COMPLETED" : "PENDING"
                });
            }
        }
    }

    private Todo selected() {
        int row = table.getSelectedRow();
        if (row < 0) return null;
        long id = ((Number) model.getValueAt(row, 0)).longValue();
        return service.findAll().stream()
                .filter(t -> t.getId() == id)
                .findFirst().orElse(null);
    }

    private void loadSelected() {
        Todo t = selected();
        if (t == null) return;
        title.setText(t.getTitle());
        description.setText(t.getDescription());
        priority.setSelectedItem(t.getPriority());
        dueDate.setText(t.getDueDate());
    }

    private boolean validateInput() {
        if (title.getText().trim().isEmpty()) {
            JOptionPane.showMessageDialog(this, "Title is required.");
            return false;
        }
        return true;
    }

    private void addTodo() {
        if (!validateInput()) return;
        service.add(title.getText().trim(), description.getText().trim(),
                (String) priority.getSelectedItem(), dueDate.getText().trim());
        loadTable();
        clearForm();
    }

    private void updateTodo() {
        Todo t = selected();
        if (t == null) {
            JOptionPane.showMessageDialog(this, "Select a todo first.");
            return;
        }
        if (!validateInput()) return;
        service.update(t.getId(), title.getText().trim(), description.getText().trim(),
                (String) priority.getSelectedItem(), dueDate.getText().trim(), t.isCompleted());
        loadTable();
        clearForm();
    }

    private void toggleTodo() {
        Todo t = selected();
        if (t == null) {
            JOptionPane.showMessageDialog(this, "Select a todo first.");
            return;
        }
        service.toggle(t.getId());
        loadTable();
    }

    private void deleteTodo() {
        Todo t = selected();
        if (t == null) {
            JOptionPane.showMessageDialog(this, "Select a todo first.");
            return;
        }
        if (JOptionPane.showConfirmDialog(this,
                "Delete \"" + t.getTitle() + "\"?",
                "Confirm Delete", JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION) {
            service.delete(t.getId());
            loadTable();
            clearForm();
        }
    }

    private void clearForm() {
        title.setText("");
        description.setText("");
        priority.setSelectedItem("MEDIUM");
        dueDate.setText("");
        table.clearSelection();
        title.requestFocus();
    }

    private JButton button(String text, Color color) {
        JButton b = new JButton(text);
        b.setForeground(Color.WHITE);
        b.setBackground(color);
        b.setFocusPainted(false);
        b.setBorder(new EmptyBorder(9, 16, 9, 16));
        b.setFont(new Font("SansSerif", Font.BOLD, 12));
        return b;
    }

    private void styleField(JTextField f) {
        f.setBackground(FIELD);
        f.setForeground(TEXT);
        f.setCaretColor(TEXT);
        f.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(65, 70, 82)),
                new EmptyBorder(7, 9, 7, 9)));
    }

    private void styleCombo(JComboBox<String> c) {
        c.setBackground(FIELD);
        c.setForeground(TEXT);
        c.setBorder(BorderFactory.createLineBorder(new Color(65, 70, 82)));
    }

    private void addLabel(JPanel p, String s, int x, int y, GridBagConstraints g) {
        g.gridx = x; g.gridy = y; g.weightx = 0;
        JLabel l = new JLabel(s);
        l.setForeground(MUTED);
        l.setFont(new Font("SansSerif", Font.BOLD, 12));
        p.add(l, g);
    }

    private void addComponent(JPanel p, Component c, int x, int y, int width, GridBagConstraints g) {
        g.gridx = x; g.gridy = y; g.gridwidth = width;
        g.weightx = 1;
        p.add(c, g);
        g.gridwidth = 1;
    }

    @FunctionalInterface
    interface SimpleDocumentListener extends javax.swing.event.DocumentListener {
        void update(javax.swing.event.DocumentEvent e);
        default void insertUpdate(javax.swing.event.DocumentEvent e) { update(e); }
        default void removeUpdate(javax.swing.event.DocumentEvent e) { update(e); }
        default void changedUpdate(javax.swing.event.DocumentEvent e) { update(e); }
    }
}
