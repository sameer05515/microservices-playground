package com.example.minigmail.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("emails")
public class Email {
    @Id
    private String id;

    private String threadId;
    private String fromUserId;

    @Builder.Default
    private List<String> toUserIds = new ArrayList<>();
    @Builder.Default
    private List<String> ccUserIds = new ArrayList<>();
    @Builder.Default
    private List<String> bccUserIds = new ArrayList<>();

    private String subject;
    private String body;

    @Builder.Default
    private List<Attachment> attachments = new ArrayList<>();

    @Builder.Default
    private List<String> labels = new ArrayList<>();

    private boolean read;
    private boolean draft;
    private boolean starred;
    private boolean important;
    private Instant createdAt;
    private Instant deletedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Attachment {
        private String originalName;
        private String filename;
        private String path;
        private String contentType;
        private long size;
    }
}
