package com.prem.todo.swing;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Arrays;
import java.util.List;

public class TodoApiClient {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final String baseUrl;

    public TodoApiClient(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public List<Todo> findAll() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl))
                .GET()
                .build();

        HttpResponse<String> response =
                httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        ensureSuccess(response);

        return objectMapper.readValue(
                response.body(),
                new TypeReference<List<Todo>>() {}
        );
    }

    public Todo create(Todo todo) throws Exception {
        return sendTodo("POST", baseUrl, todo);
    }

    public Todo update(Todo todo) throws Exception {
        return sendTodo(
                "PUT",
                baseUrl + "/" + todo.getId(),
                todo
        );
    }

    public void delete(String id) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/" + id))
                .DELETE()
                .build();

        HttpResponse<String> response =
                httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        ensureSuccess(response);
    }

    private Todo sendTodo(String method, String url, Todo todo)
            throws Exception {

        String json = objectMapper.writeValueAsString(todo);

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json");

        if ("POST".equals(method)) {
            builder.POST(HttpRequest.BodyPublishers.ofString(json));
        } else {
            builder.PUT(HttpRequest.BodyPublishers.ofString(json));
        }

        HttpResponse<String> response =
                httpClient.send(
                        builder.build(),
                        HttpResponse.BodyHandlers.ofString()
                );

        ensureSuccess(response);

        return objectMapper.readValue(response.body(), Todo.class);
    }

    private void ensureSuccess(HttpResponse<String> response)
            throws IOException {

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IOException(
                    "HTTP " + response.statusCode() + ": " + response.body()
            );
        }
    }
}
