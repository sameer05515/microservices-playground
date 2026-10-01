package com.iagent.swingclient.ui;

import com.iagent.swingclient.service.IagentApiClient;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

public class MainFrame extends JFrame {
    private final JTextField urlField = new JTextField("http://localhost:8080/api/java-services/runtime/calculate-sum");
    private final JComboBox<String> methodBox = new JComboBox<>(new String[]{"POST", "PUT", "PATCH"});
    private final JTextArea argumentsArea = new JTextArea("10\n20", 8, 50);
    private final JTextArea responseArea = new JTextArea(12, 50);
    private final JButton executeButton = new JButton("Execute Service");
    private final JLabel statusLabel = new JLabel("Ready");
    private final IagentApiClient apiClient = new IagentApiClient();

    public MainFrame() {
        setTitle("iAgent Swing Client - V1");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(800, 650);
        setLocationRelativeTo(null);
        buildUi();
    }

    private void buildUi() {
        JPanel root = new JPanel(new BorderLayout(10, 10));
        root.setBorder(new EmptyBorder(15, 15, 15, 15));
        root.add(header(), BorderLayout.NORTH);

        JPanel form = new JPanel(new GridBagLayout());
        GridBagConstraints c = new GridBagConstraints();
        c.insets = new Insets(5, 5, 5, 5); c.fill = GridBagConstraints.HORIZONTAL;
        c.gridx=0; c.gridy=0; form.add(new JLabel("Service URL:"), c);
        c.gridx=1; c.weightx=1; form.add(urlField, c);
        c.gridx=0; c.gridy=1; c.weightx=0; form.add(new JLabel("HTTP Method:"), c);
        c.gridx=1; form.add(methodBox, c);
        c.gridx=0; c.gridy=2; c.anchor=GridBagConstraints.NORTHWEST; form.add(new JLabel("Arguments:"), c);
        c.gridx=1; form.add(new JScrollPane(argumentsArea), c);
        c.gridx=1; c.gridy=3; c.anchor=GridBagConstraints.WEST; c.fill=GridBagConstraints.NONE; form.add(executeButton, c);

        responseArea.setEditable(false); responseArea.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));
        JPanel center = new JPanel(new BorderLayout(5,5));
        center.add(form, BorderLayout.NORTH);
        center.add(new JLabel("Response:"), BorderLayout.CENTER);
        JPanel responsePanel = new JPanel(new BorderLayout()); responsePanel.add(new JScrollPane(responseArea));
        center.add(responsePanel, BorderLayout.SOUTH);
        root.add(center, BorderLayout.CENTER);
        root.add(statusLabel, BorderLayout.SOUTH);
        setContentPane(root);
        executeButton.addActionListener(e -> execute());
    }

    private JPanel header() {
        JPanel p = new JPanel(new BorderLayout());
        JLabel title = new JLabel("iAgent Runtime JavaService Client"); title.setFont(title.getFont().deriveFont(Font.BOLD, 20f));
        p.add(title, BorderLayout.WEST);
        p.add(new JLabel("V1"), BorderLayout.EAST); return p;
    }

    private void execute() {
        String url = urlField.getText().trim();
        String method = (String) methodBox.getSelectedItem();
        if (url.isBlank()) { JOptionPane.showMessageDialog(this, "Please enter service URL."); return; }
        List<Object> args;
        try { args = parseArguments(argumentsArea.getText()); }
        catch (Exception ex) { JOptionPane.showMessageDialog(this, "Invalid arguments: " + ex.getMessage(), "Validation Error", JOptionPane.ERROR_MESSAGE); return; }

        executeButton.setEnabled(false); statusLabel.setText("Calling service..."); responseArea.setText("");
        new SwingWorker<String, Void>() {
            protected String doInBackground() throws Exception { return apiClient.invoke(url, method, args); }
            protected void done() {
                try { responseArea.setText(get()); statusLabel.setText("Execution completed"); }
                catch (Exception ex) { responseArea.setText(rootCause(ex).toString()); statusLabel.setText("Execution failed"); }
                finally { executeButton.setEnabled(true); }
            }
        }.execute();
    }

    private List<Object> parseArguments(String text) {
        List<Object> result = new ArrayList<>();
        for (String line : text.split("\\R")) {
            String v = line.trim(); if (v.isEmpty()) continue;
            if (v.equalsIgnoreCase("true") || v.equalsIgnoreCase("false")) result.add(Boolean.parseBoolean(v));
            else { try { result.add(Integer.valueOf(v)); } catch (NumberFormatException e) { try { result.add(Double.valueOf(v)); } catch (NumberFormatException ignored) { result.add(v); } } }
        }
        return result;
    }

    private Throwable rootCause(Throwable t) { Throwable x=t; while(x.getCause()!=null) x=x.getCause(); return x; }
}
