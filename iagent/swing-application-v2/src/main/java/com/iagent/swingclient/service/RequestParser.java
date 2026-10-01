package com.iagent.swingclient.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class RequestParser {
    private final ObjectMapper mapper;

    public RequestParser(ObjectMapper mapper) { this.mapper = mapper; }

    public List<Object> parseJavaArguments(String text) {
        List<Object> result = new ArrayList<>();
        for (String line : text.split("\\R")) {
            String value = line.trim();
            if (value.isEmpty()) continue;
            result.add(parseScalar(value));
        }
        return result;
    }

    public Map<String, Object> parseDbParameters(String json) throws Exception {
        if (json == null || json.isBlank()) return new LinkedHashMap<>();
        JsonNode node = mapper.readTree(json);
        if (!node.isObject()) throw new IllegalArgumentException("DbService parameters must be a JSON object, e.g. {\"status\":true}");
        return mapper.convertValue(node, new TypeReference<Map<String, Object>>() {});
    }

    private Object parseScalar(String value) {
        if (value.equalsIgnoreCase("true") || value.equalsIgnoreCase("false")) return Boolean.parseBoolean(value);
        try { return Integer.valueOf(value); } catch (NumberFormatException ignored) {}
        try { return Long.valueOf(value); } catch (NumberFormatException ignored) {}
        try { return Double.valueOf(value); } catch (NumberFormatException ignored) {}
        return value;
    }
}
