package com.example.restclient;

import javax.swing.*;
import java.awt.*;
import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

public class OAuth2PkceFrame extends JFrame {
    private final JTextField authUrl = new JTextField();
    private final JTextField clientId = new JTextField();
    private final JTextField redirectUri = new JTextField("http://localhost:8080/callback");
    private final JTextField scope = new JTextField("openid profile");
    private final JTextField tokenUrl = new JTextField();
    private final JTextField code = new JTextField();
    private final JTextArea output = new JTextArea();

    private String verifier;

    public OAuth2PkceFrame() {
        setTitle("OAuth2 Authorization Code + PKCE");
        setSize(950, 700);
        setLocationRelativeTo(null);

        JPanel form = new JPanel(new GridLayout(0, 2, 6, 6));
        form.add(new JLabel("Authorization URL")); form.add(authUrl);
        form.add(new JLabel("Client ID")); form.add(clientId);
        form.add(new JLabel("Redirect URI")); form.add(redirectUri);
        form.add(new JLabel("Scope")); form.add(scope);
        form.add(new JLabel("Token URL")); form.add(tokenUrl);
        form.add(new JLabel("Authorization Code")); form.add(code);

        JButton authorize = new JButton("Open Authorization URL");
        authorize.addActionListener(e -> authorize());

        JButton exchange = new JButton("Exchange Code");
        exchange.addActionListener(e -> exchange());

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.LEFT));
        buttons.add(authorize);
        buttons.add(exchange);

        output.setEditable(false);
        output.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));

        setContentPane(new JPanel(new BorderLayout(8, 8)));
        ((JPanel)getContentPane()).setBorder(
                BorderFactory.createEmptyBorder(8, 8, 8, 8));
        getContentPane().add(form, BorderLayout.NORTH);
        getContentPane().add(new JScrollPane(output), BorderLayout.CENTER);
        getContentPane().add(buttons, BorderLayout.SOUTH);
    }

    private void authorize() {
        try {
            verifier = randomVerifier();
            String challenge = challenge(verifier);

            String separator = authUrl.getText().contains("?") ? "&" : "?";
            String url = authUrl.getText() + separator
                    + "response_type=code"
                    + "&client_id=" + enc(clientId.getText())
                    + "&redirect_uri=" + enc(redirectUri.getText())
                    + "&scope=" + enc(scope.getText())
                    + "&code_challenge=" + enc(challenge)
                    + "&code_challenge_method=S256";

            Desktop.getDesktop().browse(URI.create(url));
            output.setText(
                    "Browser opened.\n\nPKCE verifier generated locally.\n"
                            + "Complete login, then paste the authorization code.");
        } catch (Exception e) {
            output.setText("OAuth error: " + e.getMessage());
        }
    }

    private void exchange() {
        if (verifier == null) {
            output.setText("Start authorization first.");
            return;
        }

        try {
            String form = "grant_type=authorization_code"
                    + "&code=" + enc(code.getText())
                    + "&client_id=" + enc(clientId.getText())
                    + "&redirect_uri=" + enc(redirectUri.getText())
                    + "&code_verifier=" + enc(verifier);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(tokenUrl.getText().trim()))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(form))
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            output.setText(
                    "HTTP " + response.statusCode() + "\n\n"
                            + response.body());
        } catch (Exception e) {
            output.setText("Token exchange error: " + e.getMessage());
        }
    }

    private static String randomVerifier() {
        byte[] b = new byte[32];
        new SecureRandom().nextBytes(b);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(b);
    }

    private static String challenge(String verifier) throws Exception {
        byte[] digest = MessageDigest.getInstance("SHA-256")
                .digest(verifier.getBytes(StandardCharsets.US_ASCII));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
    }

    private static String enc(String value) {
        return java.net.URLEncoder.encode(
                value,
                StandardCharsets.UTF_8);
    }
}
