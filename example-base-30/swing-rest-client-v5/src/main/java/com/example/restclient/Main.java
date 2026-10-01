package com.example.restclient;

import javax.swing.*;
import java.awt.*;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            RestClientFrame frame = new RestClientFrame();

            JMenuBar bar = new JMenuBar();
            JMenu tools = new JMenu("Tools");

            JMenuItem jwt = new JMenuItem("JWT Decoder");
            jwt.addActionListener(e -> new JwtDecoderFrame().setVisible(true));

            JMenuItem curl = new JMenuItem("cURL Import / Export");
            curl.addActionListener(e -> new CurlFrame().setVisible(true));

            JMenuItem ws = new JMenuItem("WebSocket Client");
            ws.addActionListener(e -> new WebSocketFrame().setVisible(true));

            JMenuItem oauth = new JMenuItem("OAuth2 + PKCE");
            oauth.addActionListener(e -> new OAuth2PkceFrame().setVisible(true));

            tools.add(jwt);
            tools.add(curl);
            tools.add(ws);
            tools.add(oauth);

            bar.add(tools);
            frame.setJMenuBar(bar);
            frame.setVisible(true);
        });
    }
}
