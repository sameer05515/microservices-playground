package com.p.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {
    @Id
    private String id;

    @Builder.Default
    private String questionText = "";

    private String description;

    private String answer;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    // Parent can be Directory or Topic
    @DBRef(lazy = true)
    private Directory directory;

    private String directoryId; // For easier querying

    @DBRef(lazy = true)
    private Topic topic;

    private String topicId; // For easier querying

    // Type of parent: "directory" or "topic"
    private String parentType;

    // Combined parent ID for easier querying
    private String parentId;

    @Builder.Default
    private boolean deleted = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;
}

