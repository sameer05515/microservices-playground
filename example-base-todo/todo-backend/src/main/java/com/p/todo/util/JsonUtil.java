package com.p.todo.util;

import com.p.todo.model.Todo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class JsonUtil {
    private static final String FILE_PATH = "src/main/resources/data.json";
    private static final ObjectMapper mapper = new ObjectMapper();

    public static List<Todo> readTodos() throws IOException {
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            file.createNewFile();
            mapper.writeValue(file, List.of());
        }
        return mapper.readValue(file, new TypeReference<List<Todo>>() {});
    }

    public static void writeTodos(List<Todo> todos) throws IOException {
        mapper.writerWithDefaultPrettyPrinter().writeValue(new File(FILE_PATH), todos);
    }
}
