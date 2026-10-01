package com.example.restclient;

import javax.swing.*;
import java.awt.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.util.concurrent.CompletionStage;

public class WebSocketFrame extends JFrame {
    private final JTextField url = new JTextField("wss://echo.websocket.events");
    private final JTextField message = new JTextField();
    private final JTextArea log = new JTextArea();
    private WebSocket socket;

    public WebSocketFrame() {
        setTitle("WebSocket Client");
        setSize(900, 650);
        setLocationRelativeTo(null);

        JButton connect = new JButton("Connect");
        connect.addActionListener(e -> connect());

        JButton send = new JButton("Send");
        send.addActionListener(e -> send());

        JPanel top = new JPanel(new BorderLayout(5, 5));
        top.add(url, BorderLayout.CENTER);
        top.add(connect, BorderLayout.EAST);

        JPanel bottom = new JPanel(new BorderLayout(5, 5));
        bottom.add(message, BorderLayout.CENTER);
        bottom.add(send, BorderLayout.EAST);

        log.setEditable(false);
        log.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));

        setContentPane(new JPanel(new BorderLayout(8, 8)));
        ((JPanel)getContentPane()).setBorder(
                BorderFactory.createEmptyBorder(8, 8, 8, 8));
        getContentPane().add(top, BorderLayout.NORTH);
        getContentPane().add(new JScrollPane(log), BorderLayout.CENTER);
        getContentPane().add(bottom, BorderLayout.SOUTH);
    }

    private void connect() {
        try {
            socket = HttpClient.newHttpClient()
                    .newWebSocketBuilder()
                    .buildAsync(
                            URI.create(url.getText().trim()),
                            new WebSocket.Listener() {
                                public void onOpen(WebSocket webSocket) {
                                    log("CONNECTED");
                                    WebSocket.Listener.super.onOpen(webSocket);
                                }

                                public CompletionStage<?> onText(
                                        WebSocket webSocket,
                                        CharSequence data,
                                        boolean last) {
                                    log("RECEIVED: " + data);
                                    return WebSocket.Listener.super
                                            .onText(webSocket, data, last);
                                }

                                public void onError(
                                        WebSocket webSocket,
                                        Throwable error) {
                                    log("ERROR: " + error.getMessage());
                                }
                            })
                    .join();
        } catch (Exception e) {
            log("CONNECT ERROR: " + e.getMessage());
        }
    }

    private void send() {
        if (socket == null) {
            log("Not connected.");
            return;
        }
        socket.sendText(message.getText(), true);
        log("SENT: " + message.getText());
        message.setText("");
    }

    private void log(String text) {
        SwingUtilities.invokeLater(() ->
                log.append(text + System.lineSeparator()));
    }
}
