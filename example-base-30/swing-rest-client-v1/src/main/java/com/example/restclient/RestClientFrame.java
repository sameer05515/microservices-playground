package com.example.restclient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.net.URI;
import java.net.http.*;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

public class RestClientFrame extends JFrame {
    private final JComboBox<String> methodCombo =
            new JComboBox<>(new String[]{"GET","POST","PUT","PATCH","DELETE"});
    private final JTextField urlField =
            new JTextField("https://jsonplaceholder.typicode.com/todos/1");

    private final DefaultTableModel headerModel =
            new DefaultTableModel(new Object[]{"Enabled","Key","Value"}, 0) {
                public Class<?> getColumnClass(int c) { return c == 0 ? Boolean.class : String.class; }
            };
    private final JTable headerTable = new JTable(headerModel);
    private final JTextArea requestBody = new JTextArea();
    private final JTextArea responseArea = new JTextArea();
    private final JLabel statusLabel = new JLabel("Ready");
    private final JLabel timeLabel = new JLabel("-");
    private final JLabel sizeLabel = new JLabel("-");

    private final ObjectMapper mapper = new ObjectMapper()
            .enable(SerializationFeature.INDENT_OUTPUT);
    private final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    public RestClientFrame() {
        setTitle("Swing REST Client V1");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1200, 760);
        setMinimumSize(new Dimension(900, 600));
        setLocationRelativeTo(null);
        buildUi();
        headerModel.addRow(new Object[]{true, "Accept", "application/json"});
    }

    private void buildUi() {
        JPanel root = new JPanel(new BorderLayout(10,10));
        root.setBorder(new EmptyBorder(10,10,10,10));
        setContentPane(root);
        root.add(toolbar(), BorderLayout.NORTH);

        JSplitPane split = new JSplitPane(
                JSplitPane.VERTICAL_SPLIT, requestTabs(), responseTabs());
        split.setResizeWeight(0.48);
        root.add(split, BorderLayout.CENTER);
        root.add(statusBar(), BorderLayout.SOUTH);
    }

    private JPanel toolbar() {
        JPanel p = new JPanel(new BorderLayout(8,8));
        methodCombo.setPreferredSize(new Dimension(110,34));

        JButton send = new JButton("Send");
        send.setPreferredSize(new Dimension(110,34));
        send.addActionListener(e -> sendRequest());

        JButton clear = new JButton("Clear");
        clear.addActionListener(e -> {
            requestBody.setText("");
            responseArea.setText("");
            statusLabel.setText("Ready");
            timeLabel.setText("-");
            sizeLabel.setText("-");
        });

        JPanel left = new JPanel(new BorderLayout(6,0));
        left.add(methodCombo, BorderLayout.WEST);
        left.add(urlField, BorderLayout.CENTER);

        JPanel right = new JPanel(new FlowLayout(FlowLayout.RIGHT,5,0));
        right.add(send);
        right.add(clear);

        p.add(left, BorderLayout.CENTER);
        p.add(right, BorderLayout.EAST);
        return p;
    }

    private JComponent requestTabs() {
        JTabbedPane tabs = new JTabbedPane();
        tabs.addTab("Headers", headersTab());
        tabs.addTab("Body", bodyTab());
        return tabs;
    }

    private JComponent headersTab() {
        JPanel p = new JPanel(new BorderLayout(6,6));
        headerTable.setRowHeight(28);
        p.add(new JScrollPane(headerTable), BorderLayout.CENTER);

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.LEFT));
        JButton add = new JButton("+ Add Header");
        add.addActionListener(e -> headerModel.addRow(new Object[]{true,"",""}));
        JButton remove = new JButton("- Remove");
        remove.addActionListener(e -> {
            int row = headerTable.getSelectedRow();
            if (row >= 0) headerModel.removeRow(row);
        });
        buttons.add(add);
        buttons.add(remove);
        p.add(buttons, BorderLayout.SOUTH);
        return p;
    }

    private JComponent bodyTab() {
        requestBody.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 14));
        requestBody.setText("""
                {
                  "title": "Learn Spring Boot",
                  "completed": false
                }
                """);
        return new JScrollPane(requestBody);
    }

    private JComponent responseTabs() {
        JTabbedPane tabs = new JTabbedPane();
        responseArea.setEditable(false);
        responseArea.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 14));
        tabs.addTab("Response", new JScrollPane(responseArea));

        JTextArea info = new JTextArea(
                "HTTP status, response time and response size are shown in the status bar.");
        info.setEditable(false);
        info.setBorder(new EmptyBorder(10,10,10,10));
        tabs.addTab("Info", new JScrollPane(info));
        return tabs;
    }

    private JPanel statusBar() {
        JPanel p = new JPanel(new FlowLayout(FlowLayout.LEFT,15,2));
        p.add(new JLabel("Status:")); p.add(statusLabel);
        p.add(new JLabel("Time:")); p.add(timeLabel);
        p.add(new JLabel("Size:")); p.add(sizeLabel);
        return p;
    }

    private Map<String,String> headers() {
        Map<String,String> result = new LinkedHashMap<>();
        for (int i=0; i<headerModel.getRowCount(); i++) {
            Boolean enabled = (Boolean) headerModel.getValueAt(i,0);
            String key = String.valueOf(headerModel.getValueAt(i,1)).trim();
            String value = String.valueOf(headerModel.getValueAt(i,2)).trim();
            if (Boolean.TRUE.equals(enabled) && !key.isBlank()) result.put(key,value);
        }
        return result;
    }

    private void sendRequest() {
        String method = String.valueOf(methodCombo.getSelectedItem());
        String url = urlField.getText().trim();

        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            JOptionPane.showMessageDialog(this,
                    "URL must start with http:// or https://",
                    "Validation", JOptionPane.WARNING_MESSAGE);
            return;
        }

        setBusy(true);

        SwingWorker<Result,Void> worker = new SwingWorker<>() {
            protected Result doInBackground() throws Exception {
                long start = System.currentTimeMillis();
                HttpRequest.Builder b = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .timeout(Duration.ofSeconds(30));
                headers().forEach(b::header);

                String body = requestBody.getText();
                boolean hasBody = !body.isBlank();

                if ((method.equals("GET") || method.equals("DELETE")) && !hasBody) {
                    b.method(method, HttpRequest.BodyPublishers.noBody());
                } else {
                    if (hasBody) b.header("Content-Type", "application/json");
                    b.method(method, HttpRequest.BodyPublishers.ofString(body));
                }

                HttpResponse<String> r = client.send(
                        b.build(), HttpResponse.BodyHandlers.ofString());
                return new Result(r.statusCode(), r.body(),
                        System.currentTimeMillis() - start);
            }

            protected void done() {
                try {
                    Result r = get();
                    statusLabel.setText(String.valueOf(r.status));
                    timeLabel.setText(r.ms + " ms");
                    sizeLabel.setText(r.body.getBytes().length + " bytes");
                    responseArea.setText(format(r.body));
                    responseArea.setCaretPosition(0);
                } catch (Exception e) {
                    statusLabel.setText("ERROR");
                    responseArea.setText(e.getClass().getSimpleName() + ": " + e.getMessage());
                } finally {
                    setBusy(false);
                }
            }
        };
        worker.execute();
    }

    private String format(String body) {
        if (body == null || body.isBlank()) return "";
        try {
            JsonNode node = mapper.readTree(body);
            return mapper.writeValueAsString(node);
        } catch (Exception ignored) {
            return body;
        }
    }

    private void setBusy(boolean busy) {
        methodCombo.setEnabled(!busy);
        urlField.setEnabled(!busy);
        headerTable.setEnabled(!busy);
        requestBody.setEnabled(!busy);
        statusLabel.setText(busy ? "Sending..." : statusLabel.getText());
        setCursor(busy
                ? Cursor.getPredefinedCursor(Cursor.WAIT_CURSOR)
                : Cursor.getDefaultCursor());
    }

    private record Result(int status, String body, long ms) {}
}
