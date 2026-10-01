package com.example.restclient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.datatransfer.StringSelection;
import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

public class RestClientFrame extends JFrame {

    private final JComboBox<String> methodCombo =
            new JComboBox<>(new String[]{"GET", "POST", "PUT", "PATCH", "DELETE"});

    private final JTextField urlField =
            new JTextField("https://jsonplaceholder.typicode.com/todos/1");

    private final DefaultTableModel queryModel = tableModel();
    private final DefaultTableModel headerModel = tableModel();

    private final JTable queryTable = new JTable(queryModel);
    private final JTable headerTable = new JTable(headerModel);

    private final JTextArea requestBody = new JTextArea();
    private final JTextArea responseArea = new JTextArea();

    private final DefaultListModel<String> historyModel = new DefaultListModel<>();
    private final JList<String> historyList = new JList<>(historyModel);

    private final DefaultListModel<String> collectionModel = new DefaultListModel<>();
    private final JList<String> collectionList = new JList<>(collectionModel);

    private final JLabel statusLabel = new JLabel("Ready");
    private final JLabel timeLabel = new JLabel("-");
    private final JLabel sizeLabel = new JLabel("-");

    private final ObjectMapper mapper = new ObjectMapper()
            .enable(SerializationFeature.INDENT_OUTPUT);

    private final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    private final List<SavedRequest> savedRequests = new ArrayList<>();

    public RestClientFrame() {
        setTitle("Swing REST Client V2");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1350, 820);
        setMinimumSize(new Dimension(1000, 650));
        setLocationRelativeTo(null);

        buildUi();

        queryModel.addRow(new Object[]{true, "userId", "1"});
        headerModel.addRow(new Object[]{true, "Accept", "application/json"});

        loadSampleCollections();
    }

    private DefaultTableModel tableModel() {
        return new DefaultTableModel(new Object[]{"Enabled", "Key", "Value"}, 0) {
            @Override
            public Class<?> getColumnClass(int column) {
                return column == 0 ? Boolean.class : String.class;
            }
        };
    }

    private void buildUi() {
        JPanel root = new JPanel(new BorderLayout(8, 8));
        root.setBorder(new EmptyBorder(8, 8, 8, 8));
        setContentPane(root);

        root.add(createTopBar(), BorderLayout.NORTH);

        JSplitPane center = new JSplitPane(
                JSplitPane.HORIZONTAL_SPLIT,
                createSidebar(),
                createRequestResponseArea()
        );
        center.setDividerLocation(260);

        root.add(center, BorderLayout.CENTER);
        root.add(createStatusBar(), BorderLayout.SOUTH);
    }

    private JPanel createTopBar() {
        JPanel p = new JPanel(new BorderLayout(6, 6));

        JLabel title = new JLabel("  Swing REST Client V2");
        title.setFont(new Font("SansSerif", Font.BOLD, 18));

        JButton send = new JButton("Send");
        send.setPreferredSize(new Dimension(100, 34));
        send.addActionListener(e -> sendRequest());

        JButton save = new JButton("Save");
        save.addActionListener(e -> saveCurrentRequest());

        JButton load = new JButton("Load");
        load.addActionListener(e -> loadRequestFromFile());

        JButton copy = new JButton("Copy Response");
        copy.addActionListener(e ->
                Toolkit.getDefaultToolkit().getSystemClipboard()
                        .setContents(new StringSelection(responseArea.getText()), null));

        JPanel actions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 5, 0));
        actions.add(send);
        actions.add(save);
        actions.add(load);
        actions.add(copy);

        p.add(title, BorderLayout.WEST);
        p.add(actions, BorderLayout.EAST);
        return p;
    }

    private JComponent createSidebar() {
        JTabbedPane tabs = new JTabbedPane();

        JPanel history = new JPanel(new BorderLayout(5, 5));
        historyList.setFont(new Font("SansSerif", Font.PLAIN, 12));
        historyList.addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) loadHistoryItem(historyList.getSelectedIndex());
        });
        history.add(new JScrollPane(historyList), BorderLayout.CENTER);

        JButton clearHistory = new JButton("Clear History");
        clearHistory.addActionListener(e -> historyModel.clear());
        history.add(clearHistory, BorderLayout.SOUTH);

        JPanel collections = new JPanel(new BorderLayout(5, 5));
        collectionList.setFont(new Font("SansSerif", Font.PLAIN, 12));
        collectionList.addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) loadSavedRequest(collectionList.getSelectedIndex());
        });
        collections.add(new JScrollPane(collectionList), BorderLayout.CENTER);

        JButton remove = new JButton("Remove Saved");
        remove.addActionListener(e -> {
            int i = collectionList.getSelectedIndex();
            if (i >= 0) {
                collectionModel.remove(i);
                savedRequests.remove(i);
            }
        });
        collections.add(remove, BorderLayout.SOUTH);

        tabs.addTab("History", history);
        tabs.addTab("Collections", collections);
        return tabs;
    }

    private JComponent createRequestResponseArea() {
        JPanel main = new JPanel(new BorderLayout(6, 6));

        JPanel requestLine = new JPanel(new BorderLayout(5, 5));
        methodCombo.setPreferredSize(new Dimension(105, 34));
        requestLine.add(methodCombo, BorderLayout.WEST);
        requestLine.add(urlField, BorderLayout.CENTER);

        JButton go = new JButton("Send");
        go.addActionListener(e -> sendRequest());
        requestLine.add(go, BorderLayout.EAST);

        main.add(requestLine, BorderLayout.NORTH);

        JSplitPane split = new JSplitPane(
                JSplitPane.VERTICAL_SPLIT,
                createRequestTabs(),
                createResponseTabs()
        );
        split.setResizeWeight(0.43);

        main.add(split, BorderLayout.CENTER);
        return main;
    }

    private JComponent createRequestTabs() {
        JTabbedPane tabs = new JTabbedPane();

        tabs.addTab("Query Params", createParamTable(queryTable, queryModel));
        tabs.addTab("Headers", createParamTable(headerTable, headerModel));

        requestBody.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 14));
        requestBody.setText("""
                {
                  "title": "Learn Spring Boot",
                  "completed": false
                }
                """);
        tabs.addTab("Body", new JScrollPane(requestBody));

        return tabs;
    }

    private JPanel createParamTable(JTable table, DefaultTableModel model) {
        JPanel p = new JPanel(new BorderLayout(5, 5));

        table.setRowHeight(27);
        table.getColumnModel().getColumn(0).setPreferredWidth(70);
        table.getColumnModel().getColumn(1).setPreferredWidth(280);
        table.getColumnModel().getColumn(2).setPreferredWidth(500);

        p.add(new JScrollPane(table), BorderLayout.CENTER);

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.LEFT));

        JButton add = new JButton("+ Add");
        add.addActionListener(e -> model.addRow(new Object[]{true, "", ""}));

        JButton remove = new JButton("- Remove");
        remove.addActionListener(e -> {
            int row = table.getSelectedRow();
            if (row >= 0) model.removeRow(row);
        });

        buttons.add(add);
        buttons.add(remove);
        p.add(buttons, BorderLayout.SOUTH);

        return p;
    }

    private JComponent createResponseTabs() {
        JTabbedPane tabs = new JTabbedPane();

        responseArea.setEditable(false);
        responseArea.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 14));
        responseArea.setLineWrap(false);

        tabs.addTab("Pretty JSON", new JScrollPane(responseArea));

        JTextArea raw = new JTextArea();
        raw.setEditable(false);
        raw.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));
        tabs.addTab("Raw", new JScrollPane(raw));

        responseArea.getDocument().addDocumentListener(new javax.swing.event.DocumentListener() {
            public void insertUpdate(DocumentEvent e) { syncRaw(raw); }
            public void removeUpdate(DocumentEvent e) { syncRaw(raw); }
            public void changedUpdate(DocumentEvent e) { syncRaw(raw); }
        });

        return tabs;
    }

    private void syncRaw(JTextArea raw) {
        // Raw is populated by sendRequest directly.
    }

    private JPanel createStatusBar() {
        JPanel p = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 2));
        p.add(new JLabel("Status:"));
        p.add(statusLabel);
        p.add(new JLabel("Time:"));
        p.add(timeLabel);
        p.add(new JLabel("Size:"));
        p.add(sizeLabel);
        return p;
    }

    private void loadSampleCollections() {
        saveRequestInMemory("Get Todo", "GET",
                "https://jsonplaceholder.typicode.com/todos/1",
                Map.of(), Map.of("Accept", "application/json"), "");
    }

    private Map<String, String> collect(DefaultTableModel model) {
        Map<String, String> map = new LinkedHashMap<>();

        for (int i = 0; i < model.getRowCount(); i++) {
            Boolean enabled = (Boolean) model.getValueAt(i, 0);
            String key = String.valueOf(model.getValueAt(i, 1)).trim();
            String value = String.valueOf(model.getValueAt(i, 2)).trim();

            if (Boolean.TRUE.equals(enabled) && !key.isBlank()) {
                map.put(key, value);
            }
        }
        return map;
    }

    private String buildUrl() {
        String base = urlField.getText().trim();

        Map<String, String> params = collect(queryModel);
        if (params.isEmpty()) return base;

        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, String> e : params.entrySet()) {
            if (!query.isEmpty()) query.append('&');
            query.append(java.net.URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8));
            query.append('=');
            query.append(java.net.URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8));
        }

        return base + (base.contains("?") ? "&" : "?") + query;
    }

    private void sendRequest() {
        String method = String.valueOf(methodCombo.getSelectedItem());
        String url = buildUrl();

        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            JOptionPane.showMessageDialog(this,
                    "URL must start with http:// or https://",
                    "Validation", JOptionPane.WARNING_MESSAGE);
            return;
        }

        setBusy(true);

        SwingWorker<Result, Void> worker = new SwingWorker<>() {
            @Override
            protected Result doInBackground() throws Exception {
                long start = System.currentTimeMillis();

                HttpRequest.Builder builder = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .timeout(Duration.ofSeconds(30));

                collect(headerModel).forEach(builder::header);

                String body = requestBody.getText();
                boolean bodyAllowed = !method.equals("GET") && !method.equals("DELETE");

                if (bodyAllowed) {
                    if (!body.isBlank()) builder.header("Content-Type", "application/json");
                    builder.method(method,
                            body.isBlank()
                                    ? HttpRequest.BodyPublishers.noBody()
                                    : HttpRequest.BodyPublishers.ofString(body));
                } else {
                    builder.method(method, HttpRequest.BodyPublishers.noBody());
                }

                HttpResponse<String> response =
                        client.send(builder.build(), HttpResponse.BodyHandlers.ofString());

                return new Result(
                        response.statusCode(),
                        response.body(),
                        System.currentTimeMillis() - start
                );
            }

            @Override
            protected void done() {
                try {
                    Result r = get();
                    statusLabel.setText(String.valueOf(r.status));
                    timeLabel.setText(r.elapsed + " ms");
                    sizeLabel.setText(r.body.getBytes(StandardCharsets.UTF_8).length + " bytes");
                    responseArea.setText(formatJson(r.body));
                    responseArea.setCaretPosition(0);

                    addHistory(method, url, r.status);
                } catch (Exception ex) {
                    statusLabel.setText("ERROR");
                    responseArea.setText(
                            ex.getClass().getSimpleName() + ": " + ex.getMessage());
                } finally {
                    setBusy(false);
                }
            }
        };

        worker.execute();
    }

    private String formatJson(String body) {
        if (body == null || body.isBlank()) return "";

        try {
            JsonNode node = mapper.readTree(body);
            return mapper.writeValueAsString(node);
        } catch (Exception ignored) {
            return body;
        }
    }

    private void addHistory(String method, String url, int status) {
        String item = method + "  " + url + "  [" + status + "]";
        historyModel.insertElementAt(item, 0);

        if (historyModel.size() > 50) {
            historyModel.removeElementAt(historyModel.size() - 1);
        }
    }

    private void saveCurrentRequest() {
        String name = JOptionPane.showInputDialog(
                this, "Request name:", "Save Request",
                JOptionPane.PLAIN_MESSAGE);

        if (name == null || name.isBlank()) return;

        saveRequestInMemory(
                name,
                String.valueOf(methodCombo.getSelectedItem()),
                urlField.getText().trim(),
                collect(queryModel),
                collect(headerModel),
                requestBody.getText()
        );
    }

    private void saveRequestInMemory(String name, String method, String url,
                                     Map<String, String> params,
                                     Map<String, String> headers,
                                     String body) {
        SavedRequest request = new SavedRequest(
                name, method, url,
                new LinkedHashMap<>(params),
                new LinkedHashMap<>(headers),
                body
        );
        savedRequests.add(request);
        collectionModel.addElement(name);
    }

    private void loadSavedRequest(int index) {
        if (index < 0 || index >= savedRequests.size()) return;
        applyRequest(savedRequests.get(index));
    }

    private void loadHistoryItem(int index) {
        if (index < 0) return;

        String value = historyModel.get(index);
        int firstSpace = value.indexOf("  ");
        int statusPos = value.lastIndexOf("  [");

        if (firstSpace < 0 || statusPos < 0) return;

        String method = value.substring(0, firstSpace).trim();
        String url = value.substring(firstSpace, statusPos).trim();

        methodCombo.setSelectedItem(method);
        urlField.setText(url);
    }

    private void applyRequest(SavedRequest request) {
        methodCombo.setSelectedItem(request.method);
        urlField.setText(request.url);

        queryModel.setRowCount(0);
        request.params.forEach((k, v) ->
                queryModel.addRow(new Object[]{true, k, v}));

        headerModel.setRowCount(0);
        request.headers.forEach((k, v) ->
                headerModel.addRow(new Object[]{true, k, v}));

        requestBody.setText(request.body);
    }

    private void loadRequestFromFile() {
        JFileChooser chooser = new JFileChooser();
        chooser.setDialogTitle("Load REST Request");

        if (chooser.showOpenDialog(this) != JFileChooser.APPROVE_OPTION) return;

        try {
            String json = Files.readString(
                    chooser.getSelectedFile().toPath(),
                    StandardCharsets.UTF_8);

            SavedRequest request = mapper.readValue(json, SavedRequest.class);
            applyRequest(request);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this,
                    "Unable to load request:\n" + ex.getMessage(),
                    "Load Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void setBusy(boolean busy) {
        methodCombo.setEnabled(!busy);
        urlField.setEnabled(!busy);
        queryTable.setEnabled(!busy);
        headerTable.setEnabled(!busy);
        requestBody.setEnabled(!busy);

        statusLabel.setText(busy ? "Sending..." : statusLabel.getText());
        setCursor(busy
                ? Cursor.getPredefinedCursor(Cursor.WAIT_CURSOR)
                : Cursor.getDefaultCursor());
    }

    private record Result(int status, String body, long elapsed) {}

    public static class SavedRequest {
        public String name;
        public String method;
        public String url;
        public Map<String, String> params;
        public Map<String, String> headers;
        public String body;

        public SavedRequest() {}

        public SavedRequest(String name, String method, String url,
                            Map<String, String> params,
                            Map<String, String> headers,
                            String body) {
            this.name = name;
            this.method = method;
            this.url = url;
            this.params = params;
            this.headers = headers;
            this.body = body;
        }
    }
}
