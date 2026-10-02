package com.prem.quesui.ui;

import com.prem.quesui.api.ApiClient;
import com.prem.quesui.model.Tag;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.List;
import java.util.function.Consumer;

public class TagPanel extends JPanel {
    private final ApiClient api;
    private final Consumer<String> status;
    private final DefaultListModel<Tag> model = new DefaultListModel<>();
    private final JList<Tag> list = new JList<>(model);

    public TagPanel(ApiClient api, Consumer<String> status) {
        this.api = api;
        this.status = status;

        setLayout(new BorderLayout(8, 8));
        setBorder(new EmptyBorder(10, 10, 10, 10));

        JButton add = new JButton("New Tag");
        JButton edit = new JButton("Edit");
        JButton delete = new JButton("Delete");
        JButton refresh = new JButton("Refresh");

        add.addActionListener(e -> create());
        edit.addActionListener(e -> edit());
        delete.addActionListener(e -> delete());
        refresh.addActionListener(e -> refresh());

        JPanel toolbar = new JPanel(new FlowLayout(FlowLayout.LEFT));
        toolbar.add(add);
        toolbar.add(edit);
        toolbar.add(delete);
        toolbar.add(refresh);

        list.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

        add(toolbar, BorderLayout.NORTH);
        add(new JScrollPane(list), BorderLayout.CENTER);
    }

    public void refresh() {
        SwingUtilities.invokeLater(() -> {
            try {
                List<Tag> tags = api.getTags();
                model.clear();
                tags.forEach(model::addElement);
                status.accept("Loaded " + tags.size() + " tags.");
            } catch (Exception ex) {
                status.accept("Unable to load tags.");
                JOptionPane.showMessageDialog(this, ex.getMessage(), "API Error", JOptionPane.ERROR_MESSAGE);
            }
        });
    }

    private void create() {
        String name = JOptionPane.showInputDialog(this, "Tag name:");
        if (name == null || name.isBlank()) return;

        try {
            api.createTag(name.trim());
            refresh();
        } catch (Exception ex) {
            showError(ex);
        }
    }

    private void edit() {
        Tag tag = list.getSelectedValue();
        if (tag == null) {
            JOptionPane.showMessageDialog(this, "Select a tag first.");
            return;
        }

        String name = JOptionPane.showInputDialog(this, "Tag name:", tag.getName());
        if (name == null || name.isBlank()) return;

        try {
            api.updateTag(tag.getId(), name.trim());
            refresh();
        } catch (Exception ex) {
            showError(ex);
        }
    }

    private void delete() {
        Tag tag = list.getSelectedValue();
        if (tag == null) {
            JOptionPane.showMessageDialog(this, "Select a tag first.");
            return;
        }

        int answer = JOptionPane.showConfirmDialog(
                this, "Delete tag '" + tag.getName() + "'?",
                "Confirm", JOptionPane.YES_NO_OPTION);

        if (answer != JOptionPane.YES_OPTION) return;

        try {
            api.deleteTag(tag.getId());
            refresh();
        } catch (Exception ex) {
            showError(ex);
        }
    }

    private void showError(Exception ex) {
        JOptionPane.showMessageDialog(this, ex.getMessage(), "API Error", JOptionPane.ERROR_MESSAGE);
    }
}
