package com.iagent.swingclient.ui;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iagent.swingclient.model.ServiceType;
import com.iagent.swingclient.service.IagentApiClient;
import com.iagent.swingclient.service.RequestParser;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.List;
import java.util.Map;

public class MainFrame extends JFrame {
    private final JComboBox<ServiceType> serviceTypeBox = new JComboBox<>(ServiceType.values());
    private final JTextField urlField = new JTextField("http://localhost:8080/api/java-services/runtime/calculate-sum");
    private final JComboBox<String> methodBox = new JComboBox<>(new String[]{"POST", "PUT", "PATCH"});
    private final JLabel inputLabel = new JLabel("Arguments (one per line):");
    private final JTextArea inputArea = new JTextArea("10\n20", 8, 50);
    private final JTextArea responseArea = new JTextArea(12, 50);
    private final JButton executeButton = new JButton("Execute Service");
    private final JLabel statusLabel = new JLabel("Ready");
    private final IagentApiClient apiClient = new IagentApiClient();
    private final RequestParser parser = new RequestParser(new ObjectMapper());

    public MainFrame() {
        setTitle("iAgent Swing Client - V2");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(850, 700);
        setLocationRelativeTo(null);
        buildUi();
        serviceTypeBox.addActionListener(e -> updateServiceTypeUi());
    }

    private void buildUi() {
        JPanel root = new JPanel(new BorderLayout(10, 10));
        root.setBorder(new EmptyBorder(15, 15, 15, 15));
        root.add(header(), BorderLayout.NORTH);

        JPanel form = new JPanel(new GridBagLayout());
        GridBagConstraints c = new GridBagConstraints();
        c.insets = new Insets(5, 5, 5, 5); c.fill = GridBagConstraints.HORIZONTAL;
        c.gridx=0; c.gridy=0; form.add(new JLabel("Service Type:"), c);
        c.gridx=1; c.weightx=1; form.add(serviceTypeBox, c);
        c.gridx=0; c.gridy=1; c.weightx=0; form.add(new JLabel("Service URL:"), c);
        c.gridx=1; c.weightx=1; form.add(urlField, c);
        c.gridx=0; c.gridy=2; c.weightx=0; form.add(new JLabel("HTTP Method:"), c);
        c.gridx=1; form.add(methodBox, c);
        c.gridx=0; c.gridy=3; c.anchor=GridBagConstraints.NORTHWEST; form.add(inputLabel, c);
        c.gridx=1; c.weightx=1; c.fill=GridBagConstraints.BOTH; form.add(new JScrollPane(inputArea), c);
        c.gridx=1; c.gridy=4; c.weightx=0; c.weighty=0; c.anchor=GridBagConstraints.WEST; c.fill=GridBagConstraints.NONE; form.add(executeButton, c);

        responseArea.setEditable(false);
        responseArea.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));
        JPanel center = new JPanel(new BorderLayout(5,5));
        center.add(form, BorderLayout.NORTH);
        JPanel responsePanel = new JPanel(new BorderLayout(5, 5));
        responsePanel.add(new JLabel("Response:"), BorderLayout.NORTH);
        responsePanel.add(new JScrollPane(responseArea), BorderLayout.CENTER);
        center.add(responsePanel, BorderLayout.CENTER);
        root.add(center, BorderLayout.CENTER);
        root.add(statusLabel, BorderLayout.SOUTH);
        setContentPane(root);
        executeButton.addActionListener(e -> execute());
        updateServiceTypeUi();
    }

    private JPanel header() {
        JPanel p = new JPanel(new BorderLayout());
        JLabel title = new JLabel("iAgent Runtime Service Client");
        title.setFont(title.getFont().deriveFont(Font.BOLD, 20f));
        p.add(title, BorderLayout.WEST);
        p.add(new JLabel("V2 - JavaService + DbService"), BorderLayout.EAST);
        return p;
    }

    private void updateServiceTypeUi() {
        ServiceType type = (ServiceType) serviceTypeBox.getSelectedItem();
        if (type == ServiceType.DB_SERVICE) {
            urlField.setText("http://localhost:8080/api/db-services/runtime/select-query");
            inputLabel.setText("Parameters (JSON object):");
            inputArea.setText("{\n  \"status\": true\n}");
        } else {
            urlField.setText("http://localhost:8080/api/java-services/runtime/calculate-sum");
            inputLabel.setText("Arguments (one per line):");
            inputArea.setText("10\n20");
        }
    }

    private void execute() {
        String url = urlField.getText().trim();
        String method = (String) methodBox.getSelectedItem();
        ServiceType type = (ServiceType) serviceTypeBox.getSelectedItem();
        if (url.isBlank()) { JOptionPane.showMessageDialog(this, "Please enter service URL."); return; }

        try {
            if (type == ServiceType.DB_SERVICE) executeDb(url, method);
            else executeJava(url, method);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Invalid request: " + ex.getMessage(), "Validation Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void executeJava(String url, String method) throws Exception {
        List<Object> args = parser.parseJavaArguments(inputArea.getText());
        runAsync(() -> apiClient.invokeJavaService(url, method, args));
    }

    private void executeDb(String url, String method) throws Exception {
        Map<String, Object> parameters = parser.parseDbParameters(inputArea.getText());
        runAsync(() -> apiClient.invokeDbService(url, method, parameters));
    }

    private void runAsync(ThrowingSupplier<String> action) {
        executeButton.setEnabled(false);
        statusLabel.setText("Calling service...");
        responseArea.setText("");
        new SwingWorker<String, Void>() {
            protected String doInBackground() throws Exception { return action.get(); }
            protected void done() {
                try { responseArea.setText(get()); statusLabel.setText("Execution completed"); }
                catch (Exception ex) { responseArea.setText(rootCause(ex).toString()); statusLabel.setText("Execution failed"); }
                finally { executeButton.setEnabled(true); }
            }
        }.execute();
    }

    private Throwable rootCause(Throwable t) { Throwable x=t; while(x.getCause()!=null) x=x.getCause(); return x; }
    @FunctionalInterface private interface ThrowingSupplier<T> { T get() throws Exception; }
}
