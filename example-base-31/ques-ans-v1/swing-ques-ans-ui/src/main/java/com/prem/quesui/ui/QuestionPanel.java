package com.prem.quesui.ui;

import com.prem.quesui.api.ApiClient;
import com.prem.quesui.model.*;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

public class QuestionPanel extends JPanel {
    private final ApiClient api;
    private final Consumer<String> status;

    private final JTextField search = new JTextField();
    private final JSpinner pageSize = new JSpinner(new SpinnerNumberModel(10, 1, 100, 1));
    private final JLabel pageInfo = new JLabel("Page 1");
    private final JButton prev = new JButton("Previous");
    private final JButton next = new JButton("Next");

    private final DefaultListModel<Question> model = new DefaultListModel<>();
    private final JList<Question> list = new JList<>(model);

    private int page = 0;
    private PageResponse<Question> current;

    public QuestionPanel(ApiClient api, Consumer<String> status) {
        this.api = api;
        this.status = status;

        setLayout(new BorderLayout(8, 8));
        setBorder(new EmptyBorder(10, 10, 10, 10));

        add(createToolbar(), BorderLayout.NORTH);
        add(createList(), BorderLayout.CENTER);
        add(createPager(), BorderLayout.SOUTH);

        list.addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                Question q = list.getSelectedValue();
                if (q != null) showDetails(q);
            }
        });
    }

    private JComponent createToolbar() {
        JPanel p = new JPanel(new BorderLayout(8, 8));
        JPanel left = new JPanel(new BorderLayout(5, 5));
        left.add(new JLabel("Search:"), BorderLayout.WEST);
        left.add(search, BorderLayout.CENTER);

        JButton go = new JButton("Search");
        go.addActionListener(e -> { page = 0; refresh(); });

        JButton add = new JButton("New Question");
        add.addActionListener(e -> edit(null));

        JButton refresh = new JButton("Refresh");
        refresh.addActionListener(e -> refresh());

        JPanel right = new JPanel(new FlowLayout(FlowLayout.RIGHT, 5, 0));
        right.add(go);
        right.add(refresh);
        right.add(add);

        p.add(left, BorderLayout.CENTER);
        p.add(right, BorderLayout.EAST);
        return p;
    }

    private JComponent createList() {
        list.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        list.setCellRenderer(new DefaultListCellRenderer() {
            @Override
            public Component getListCellRendererComponent(
                    JList<?> l, Object value, int index,
                    boolean selected, boolean focus) {
                Question q = (Question) value;
                String tags = q.getTags().isEmpty() ? "" : "  [" + String.join(", ", q.getTags()) + "]";
                return super.getListCellRendererComponent(
                        l, q.getQuestion() + tags, index, selected, focus);
            }
        });
        return new JScrollPane(list);
    }

    private JComponent createPager() {
        JPanel p = new JPanel(new BorderLayout());

        JPanel left = new JPanel(new FlowLayout(FlowLayout.LEFT));
        left.add(new JLabel("Page size:"));
        left.add(pageSize);
        pageSize.addChangeListener(e -> { page = 0; refresh(); });

        JPanel right = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        prev.addActionListener(e -> { if (page > 0) { page--; refresh(); }});
        next.addActionListener(e -> { if (current != null && !current.isLast()) { page++; refresh(); }});
        right.add(prev);
        right.add(pageInfo);
        right.add(next);

        p.add(left, BorderLayout.WEST);
        p.add(right, BorderLayout.EAST);
        return p;
    }

    public void refresh() {
        SwingUtilities.invokeLater(() -> {
            try {
                current = api.getQuestions(page, (Integer) pageSize.getValue(), search.getText());
                model.clear();
                current.getContent().forEach(model::addElement);

                pageInfo.setText("Page " + (current.getNumber() + 1)
                        + " / " + Math.max(1, current.getTotalPages())
                        + "   (" + current.getTotalElements() + " questions)");
                prev.setEnabled(!current.isFirst());
                next.setEnabled(!current.isLast());
                status.accept("Loaded " + current.getContent().size() + " questions.");
            } catch (Exception ex) {
                status.accept("Unable to load questions.");
                JOptionPane.showMessageDialog(this, ex.getMessage(), "API Error", JOptionPane.ERROR_MESSAGE);
            }
        });
    }

    private void showDetails(Question q) {
        JTextArea text = new JTextArea();
        text.setEditable(false);
        text.setLineWrap(true);
        text.setWrapStyleWord(true);
        text.setText(format(q));
        text.setCaretPosition(0);

        JButton edit = new JButton("Edit");
        JButton delete = new JButton("Delete");
        JButton close = new JButton("Close");

        JPanel buttons = new JPanel();
        buttons.add(edit);
        buttons.add(delete);
        buttons.add(close);

        JDialog dialog = new JDialog(
                SwingUtilities.getWindowAncestor(this),
                "Question", Dialog.ModalityType.APPLICATION_MODAL);
        dialog.setLayout(new BorderLayout(8, 8));
        dialog.add(new JScrollPane(text), BorderLayout.CENTER);
        dialog.add(buttons, BorderLayout.SOUTH);
        dialog.setSize(700, 500);
        dialog.setLocationRelativeTo(this);

        close.addActionListener(e -> dialog.dispose());
        edit.addActionListener(e -> {
            dialog.dispose();
            edit(q);
        });
        delete.addActionListener(e -> {
            int result = JOptionPane.showConfirmDialog(
                    dialog, "Delete this question?", "Confirm",
                    JOptionPane.YES_NO_OPTION);
            if (result == JOptionPane.YES_OPTION) {
                try {
                    api.deleteQuestion(q.getId());
                    status.accept("Question deleted.");
                    dialog.dispose();
                    refresh();
                } catch (Exception ex) {
                    JOptionPane.showMessageDialog(dialog, ex.getMessage(), "API Error", JOptionPane.ERROR_MESSAGE);
                }
            }
        });

        dialog.setVisible(true);
    }

    private String format(Question q) {
        return "ID: " + q.getId()
                + "\\n\\nQUESTION\\n" + q.getQuestion()
                + "\\n\\nANSWERS\\n- " + String.join("\\n- ", q.getAnswers())
                + "\\n\\nTAGS\\n" + String.join(", ", q.getTags());
    }

    private void edit(Question existing) {
        QuestionDialog dialog = new QuestionDialog(
                SwingUtilities.getWindowAncestor(this), api, existing);

        dialog.setVisible(true);

        if (dialog.isSaved()) {
            refresh();
        }
    }
}

class QuestionDialog extends JDialog {
    private final ApiClient api;
    private final Question existing;
    private boolean saved;

    private final JTextArea question = new JTextArea(6, 60);
    private final JTextArea answers = new JTextArea(8, 60);
    private final JTextField tags = new JTextField();

    QuestionDialog(Window owner, ApiClient api, Question existing) {
        super(owner, existing == null ? "New Question" : "Edit Question",
                ModalityType.APPLICATION_MODAL);
        this.api = api;
        this.existing = existing;

        if (existing != null) {
            question.setText(existing.getQuestion());
            answers.setText(String.join("\\n", existing.getAnswers()));
            tags.setText(String.join(", ", existing.getTags()));
        }

        question.setLineWrap(true);
        question.setWrapStyleWord(true);
        answers.setLineWrap(true);
        answers.setWrapStyleWord(true);

        JPanel form = new JPanel(new GridBagLayout());
        form.setBorder(new EmptyBorder(12, 12, 5, 12));
        GridBagConstraints c = new GridBagConstraints();
        c.insets = new Insets(5, 5, 5, 5);
        c.fill = GridBagConstraints.BOTH;
        c.weightx = 1;

        addRow(form, c, 0, "Question:", new JScrollPane(question), 0.35);
        addRow(form, c, 1, "Answers:", new JScrollPane(answers), 0.45);
        addRow(form, c, 2, "Tags:", tags, 0.1);

        JButton save = new JButton("Save");
        JButton cancel = new JButton("Cancel");
        save.addActionListener(e -> save());
        cancel.addActionListener(e -> dispose());

        JPanel buttons = new JPanel();
        buttons.add(save);
        buttons.add(cancel);

        setLayout(new BorderLayout());
        add(form, BorderLayout.CENTER);
        add(buttons, BorderLayout.SOUTH);
        setSize(800, 560);
        setLocationRelativeTo(owner);
    }

    private void addRow(JPanel p, GridBagConstraints c, int row,
                        String label, Component component, double weighty) {
        c.gridx = 0; c.gridy = row; c.weighty = weighty; c.weightx = 0;
        c.anchor = GridBagConstraints.NORTHWEST;
        p.add(new JLabel(label), c);

        c.gridx = 1; c.weightx = 1;
        p.add(component, c);
    }

    private void save() {
        if (question.getText().isBlank()) {
            JOptionPane.showMessageDialog(this, "Question is required.");
            return;
        }

        List<String> answerList = Arrays.stream(answers.getText().split("\\R"))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        if (answerList.isEmpty()) {
            JOptionPane.showMessageDialog(this, "At least one answer is required.");
            return;
        }

        List<String> tagList = Arrays.stream(tags.getText().split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        Question q = new Question();
        q.setQuestion(question.getText().trim());
        q.setAnswers(new ArrayList<>(answerList));
        q.setTags(new ArrayList<>(tagList));

        try {
            if (existing == null) {
                api.createQuestion(q);
            } else {
                api.updateQuestion(existing.getId(), q);
            }
            saved = true;
            dispose();
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "API Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    boolean isSaved() {
        return saved;
    }
}
