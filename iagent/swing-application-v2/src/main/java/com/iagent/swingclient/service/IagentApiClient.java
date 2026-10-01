package com.iagent.swingclient.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iagent.swingclient.model.InvocationRequest;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

public class IagentApiClient {
    private final HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
    private final ObjectMapper mapper = new ObjectMapper();

    public String invokeJavaService(String url, String method, List<Object> arguments) throws Exception {
        return send(url, method, mapper.writeValueAsString(new InvocationRequest(arguments)));
    }

    public String invokeDbService(String url, String method, Map<String, Object> parameters) throws Exception {
        return send(url, method, mapper.writeValueAsString(parameters));
    }

    private String send(String url, String method, String body) throws Exception {
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(30))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json");
        switch (method.toUpperCase()) {
            case "POST" -> builder.POST(HttpRequest.BodyPublishers.ofString(body));
            case "PUT" -> builder.PUT(HttpRequest.BodyPublishers.ofString(body));
            case "PATCH" -> builder.method("PATCH", HttpRequest.BodyPublishers.ofString(body));
            default -> throw new IllegalArgumentException("Supported methods: POST, PUT, PATCH");
        }
        HttpResponse<String> response = client.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        String formatted = prettyJsonIfPossible(response.body());
        return "HTTP " + response.statusCode() + "\n\n" + formatted;
    }

    private String prettyJsonIfPossible(String body) {
        try { return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(mapper.readTree(body)); }
        catch (Exception ignored) { return body == null ? "" : body; }
    }
}
