package com.example.swing.service;

import com.example.swing.model.Topic;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service class for managing Topic CRUD operations with JSON file storage
 */
public class TopicService {
    private static final String DATA_FILE = "topics.json";
    private static final String RESOURCES_DIR = "src/main/resources";
    private final Gson gson;
    private final Path dataFilePath;

    public TopicService() {
        // Configure Gson with LocalDateTime adapter
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter());
        gsonBuilder.setPrettyPrinting();
        this.gson = gsonBuilder.create();

        // Determine the data file path
        Path resourcesPath = Paths.get(RESOURCES_DIR);
        this.dataFilePath = resourcesPath.resolve(DATA_FILE);

        // Create resources directory if it doesn't exist
        try {
            if (!Files.exists(resourcesPath)) {
                Files.createDirectories(resourcesPath);
            }
            // Create empty JSON file if it doesn't exist
            if (!Files.exists(dataFilePath)) {
                saveTopics(new ArrayList<>());
            }
        } catch (IOException e) {
            System.err.println("Error initializing data file: " + e.getMessage());
        }
    }

    /**
     * Get all topics
     */
    public List<Topic> getAllTopics() {
        try {
            if (!Files.exists(dataFilePath)) {
                return new ArrayList<>();
            }
            String json = new String(Files.readAllBytes(dataFilePath));
            if (json.trim().isEmpty()) {
                return new ArrayList<>();
            }
            return gson.fromJson(json, new TypeToken<List<Topic>>() {}.getType());
        } catch (IOException e) {
            System.err.println("Error reading topics: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Get topic by ID
     */
    public Topic getTopicById(String id) {
        return getAllTopics().stream()
                .filter(topic -> topic.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    /**
     * Create a new topic
     */
    public Topic createTopic(String title, String content) {
        List<Topic> topics = getAllTopics();
        Topic newTopic = new Topic(UUID.randomUUID().toString(), title, content);
        topics.add(newTopic);
        saveTopics(topics);
        return newTopic;
    }

    /**
     * Update an existing topic
     */
    public boolean updateTopic(String id, String title, String content) {
        List<Topic> topics = getAllTopics();
        Topic topicToUpdate = topics.stream()
                .filter(t -> t.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (topicToUpdate != null) {
            topicToUpdate.setTitle(title);
            topicToUpdate.setContent(content);
            topicToUpdate.setUpdatedAt(LocalDateTime.now());
            saveTopics(topics);
            return true;
        }
        return false;
    }

    /**
     * Delete a topic by ID
     */
    public boolean deleteTopic(String id) {
        List<Topic> topics = getAllTopics();
        boolean removed = topics.removeIf(topic -> topic.getId().equals(id));
        if (removed) {
            saveTopics(topics);
        }
        return removed;
    }

    /**
     * Save topics to JSON file
     */
    private void saveTopics(List<Topic> topics) {
        try {
            String json = gson.toJson(topics);
            Files.write(dataFilePath, json.getBytes());
        } catch (IOException e) {
            System.err.println("Error saving topics: " + e.getMessage());
            throw new RuntimeException("Failed to save topics", e);
        }
    }

    /**
     * Custom adapter for LocalDateTime serialization/deserialization
     */
    private static class LocalDateTimeAdapter implements com.google.gson.JsonSerializer<LocalDateTime>,
            com.google.gson.JsonDeserializer<LocalDateTime> {
        private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

        @Override
        public com.google.gson.JsonElement serialize(LocalDateTime src, java.lang.reflect.Type typeOfSrc,
                                                      com.google.gson.JsonSerializationContext context) {
            return new com.google.gson.JsonPrimitive(src.format(FORMATTER));
        }

        @Override
        public LocalDateTime deserialize(com.google.gson.JsonElement json, java.lang.reflect.Type typeOfT,
                                          com.google.gson.JsonDeserializationContext context)
                throws com.google.gson.JsonParseException {
            return LocalDateTime.parse(json.getAsString(), FORMATTER);
        }
    }
}

