package com.prem.quesui.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.prem.quesui.model.*;

import java.io.IOException;
import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class ApiClient {
    private final ObjectMapper mapper;
    private final HttpClient httpClient;
    private String baseUrl;

    public ApiClient(String baseUrl) {
        this.baseUrl = normalize(baseUrl);
        this.httpClient = HttpClient.newHttpClient();
        this.mapper = new ObjectMapper();
        // Spring Data Page responses can contain extra fields such as "empty".
        // Ignore fields not represented by the Swing DTOs.
        this.mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        this.mapper.registerModule(new JavaTimeModule());
    }

    public String getBaseUrl() { return baseUrl; }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = normalize(baseUrl);
    }

    private String normalize(String value) {
        value = value == null ? "" : value.trim();
        while (value.endsWith("/")) value = value.substring(0, value.length() - 1);
        return value;
    }

    public PageResponse<Question> getQuestions(int page, int size, String search) throws Exception {
        String url = baseUrl + "/api/questions?page=" + page + "&size=" + size
                + "&search=" + java.net.URLEncoder.encode(search == null ? "" : search, StandardCharsets.UTF_8);
        return request("GET", url, null, new TypeReference<>() {});
    }

    public Question getQuestion(String id) throws Exception {
        return request("GET", baseUrl + "/api/questions/" + id, null, new TypeReference<>() {});
    }

    public Question createQuestion(Question q) throws Exception {
        return request("POST", baseUrl + "/api/questions", q, new TypeReference<>() {});
    }

    public Question updateQuestion(String id, Question q) throws Exception {
        return request("PUT", baseUrl + "/api/questions/" + id, q, new TypeReference<>() {});
    }

    public void deleteQuestion(String id) throws Exception {
        requestVoid("DELETE", baseUrl + "/api/questions/" + id);
    }

    public List<Tag> getTags() throws Exception {
        return request("GET", baseUrl + "/api/tags", null, new TypeReference<>() {});
    }

    public Tag createTag(String name) throws Exception {
        return request("POST", baseUrl + "/api/tags",
                java.util.Map.of("name", name), new TypeReference<>() {});
    }

    public Tag updateTag(String id, String name) throws Exception {
        return request("PUT", baseUrl + "/api/tags/" + id,
                java.util.Map.of("name", name), new TypeReference<>() {});
    }

    public void deleteTag(String id) throws Exception {
        requestVoid("DELETE", baseUrl + "/api/tags/" + id);
    }

    public String exportAll() throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create(baseUrl + "/api/export"))
                .header("Accept", "application/json")
                .GET().build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
        check(response);
        JsonNode pretty = mapper.readTree(response.body());
        return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(pretty);
    }

    private <T> T request(String method, String url, Object body, TypeReference<T> type) throws Exception {
        HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(url))
                .header("Accept", "application/json");

        if (body != null) {
            builder.header("Content-Type", "application/json");
        }

        HttpRequest request = switch (method) {
            case "POST" -> builder.POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body))).build();
            case "PUT" -> builder.PUT(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body))).build();
            default -> builder.GET().build();
        };

        HttpResponse<String> response = httpClient.send(
                request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

        check(response);
        return mapper.readValue(response.body(), type);
    }

    private void requestVoid(String method, String url) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                .header("Accept", "application/json")
                .method(method, HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response = httpClient.send(
                request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
        check(response);
    }

    private void check(HttpResponse<String> response) throws IOException {
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            String body = response.body();
            throw new IOException("HTTP " + response.statusCode()
                    + (body == null || body.isBlank() ? "" : ": " + body));
        }
    }
}
