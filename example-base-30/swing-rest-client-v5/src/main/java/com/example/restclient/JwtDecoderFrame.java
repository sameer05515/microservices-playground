package com.example.restclient;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.swing.*;
import java.awt.*;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class JwtDecoderFrame extends JFrame {
    private final JTextArea token = new JTextArea(5, 80);
    private final JTextArea header = new JTextArea();
    private final JTextArea payload = new JTextArea();

    public JwtDecoderFrame() {
        setTitle("JWT Decoder");
        setSize(900, 650);
        setLocationRelativeTo(null);

        JButton decode = new JButton("Decode JWT");
        decode.addActionListener(e -> decode());

        token.setLineWrap(true);
        header.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));
        payload.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));

        JPanel top = new JPanel(new BorderLayout(5, 5));
        top.add(new JLabel("JWT Token"), BorderLayout.NORTH);
        top.add(new JScrollPane(token), BorderLayout.CENTER);
        top.add(decode, BorderLayout.SOUTH);

        JTabbedPane tabs = new JTabbedPane();
        tabs.addTab("Header", new JScrollPane(header));
        tabs.addTab("Payload", new JScrollPane(payload));

        setContentPane(new JPanel(new BorderLayout(8, 8)));
        ((JPanel)getContentPane()).setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 8));
        getContentPane().add(top, BorderLayout.NORTH);
        getContentPane().add(tabs, BorderLayout.CENTER);
    }

    private void decode() {
        try {
            String[] parts = token.getText().trim().split("\\.");
            if (parts.length != 3) throw new IllegalArgumentException("JWT must have 3 parts");

            ObjectMapper mapper = new ObjectMapper();

            String h = new String(
                    Base64.getUrlDecoder().decode(parts[0]),
                    StandardCharsets.UTF_8);

            String p = new String(
                    Base64.getUrlDecoder().decode(parts[1]),
                    StandardCharsets.UTF_8);

            header.setText(mapper.writerWithDefaultPrettyPrinter()
                    .writeValueAsString(mapper.readTree(h)));

            payload.setText(mapper.writerWithDefaultPrettyPrinter()
                    .writeValueAsString(mapper.readTree(p)));
        } catch (Exception e) {
            JOptionPane.showMessageDialog(
                    this,
                    "Invalid JWT:\n" + e.getMessage(),
                    "JWT Decoder",
                    JOptionPane.ERROR_MESSAGE);
        }
    }
}
