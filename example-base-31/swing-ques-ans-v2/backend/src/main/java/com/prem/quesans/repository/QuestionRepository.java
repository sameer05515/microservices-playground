package com.prem.quesans.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.prem.quesans.model.Question;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class QuestionRepository {
    private final Path file = Paths.get("data", "questions.json");
    private final ObjectMapper mapper =
            new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);

    public synchronized List<Question> findAll() throws IOException {
        ensureFile();
        if (Files.size(file) == 0) return new ArrayList<>();
        return mapper.readValue(file.toFile(),
                new TypeReference<List<Question>>() {});
    }

    public synchronized Question findById(long id) throws IOException {
        return findAll().stream()
                .filter(q -> q.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public synchronized Question save(Question q) throws IOException {
        List<Question> list = findAll();

        if (q.getId() == 0) {
            q.setId(list.stream().mapToLong(Question::getId).max().orElse(0) + 1);
            list.add(q);
        } else {
            boolean updated = false;
            for (int i = 0; i < list.size(); i++) {
                if (list.get(i).getId() == q.getId()) {
                    list.set(i, q);
                    updated = true;
                    break;
                }
            }
            if (!updated) list.add(q);
        }

        saveAll(list);
        return q;
    }

    public synchronized boolean delete(long id) throws IOException {
        List<Question> list = findAll();
        boolean removed = list.removeIf(q -> q.getId() == id);
        if (removed) saveAll(list);
        return removed;
    }

    private void saveAll(List<Question> list) throws IOException {
        Files.createDirectories(file.getParent());
        Path tmp = file.resolveSibling("questions.json.tmp");
        mapper.writeValue(tmp.toFile(), list);
        Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING);
    }

    private void ensureFile() throws IOException {
        if (!Files.exists(file)) {
            Files.createDirectories(file.getParent());
            mapper.writeValue(file.toFile(), new ArrayList<Question>());
        }
    }
}
