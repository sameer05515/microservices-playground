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

    public String invoke(String url, String method, List<Object> arguments) throws Exception {
        String body = mapper.writeValueAsString(new InvocationRequest(arguments));
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(30))
                .header("Content-Type", "application/json");
        switch (method.toUpperCase()) {
            case "POST" -> builder.POST(HttpRequest.BodyPublishers.ofString(body));
            case "PUT" -> builder.PUT(HttpRequest.BodyPublishers.ofString(body));
            case "PATCH" -> builder.method("PATCH", HttpRequest.BodyPublishers.ofString(body));
            default -> throw new IllegalArgumentException("V1 supports POST, PUT and PATCH for JSON-body invocation");
        }
        HttpResponse<String> response = client.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        return "HTTP " + response.statusCode() + "\n\n" + prettyJsonIfPossible(response.body());
    }

    private String prettyJsonIfPossible(String body) {
        try { return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(mapper.readTree(body)); }
        catch (Exception ignored) { return body; }
    }
}
