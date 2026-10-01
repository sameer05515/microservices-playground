package com.example.restclient;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

public class CurlFrame extends JFrame {
    private final JTextArea input = new JTextArea();
    private final JTextArea output = new JTextArea();

    public CurlFrame() {
        setTitle("cURL Import / Export");
        setSize(950, 650);
        setLocationRelativeTo(null);

        JButton parse = new JButton("Parse cURL");
        parse.addActionListener(e -> parseCurl());

        JPanel top = new JPanel(new BorderLayout(5, 5));
        top.add(new JLabel("cURL command"), BorderLayout.NORTH);
        top.add(new JScrollPane(input), BorderLayout.CENTER);
        top.add(parse, BorderLayout.SOUTH);

        output.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));

        setContentPane(new JPanel(new BorderLayout(8, 8)));
        ((JPanel)getContentPane()).setBorder(
                BorderFactory.createEmptyBorder(8, 8, 8, 8));
        getContentPane().add(top, BorderLayout.NORTH);
        getContentPane().add(new JScrollPane(output), BorderLayout.CENTER);
    }

    private void parseCurl() {
        String c = input.getText().trim();
        if (!c.startsWith("curl")) {
            output.setText("Command must start with curl.");
            return;
        }

        String method = "GET";
        if (c.matches("(?s).*\\s-X\\s+['\"]?[A-Z]+['\"]?.*")) {
            String x = c.replaceFirst("(?s).*\\s-X\\s+['\"]?([A-Z]+)['\"]?.*", "$1");
            method = x;
        }

        String url = extractUrl(c);
        List<String> headers = extractHeaders(c);
        String body = extractBody(c);

        StringBuilder result = new StringBuilder();
        result.append("Method: ").append(method).append('\n');
        result.append("URL: ").append(url).append('\n');
        result.append("\nHeaders:\n");
        for (String h : headers) result.append("  ").append(h).append('\n');
        result.append("\nBody:\n").append(body);

        output.setText(result.toString());
    }

    private String extractUrl(String c) {
        String cleaned = c.replace("\\\n", " ");
        String[] tokens = cleaned.split("\\s+");
        for (String token : tokens) {
            String t = token.replace("\"", "").replace("'", "");
            if (t.startsWith("http://") || t.startsWith("https://")) return t;
        }
        return "(URL not found)";
    }

    private List<String> extractHeaders(String c) {
        List<String> result = new ArrayList<>();
        java.util.regex.Matcher m =
                java.util.regex.Pattern.compile(
                        "(?:-H|--header)\\s+['\"]([^'\"]+)['\"]")
                        .matcher(c);

        while (m.find()) result.add(m.group(1));
        return result;
    }

    private String extractBody(String c) {
        java.util.regex.Matcher m =
                java.util.regex.Pattern.compile(
                        "(?:-d|--data|--data-raw)\\s+['\"](.+)['\"]")
                        .matcher(c);

        return m.find() ? m.group(1) : "";
    }
}
