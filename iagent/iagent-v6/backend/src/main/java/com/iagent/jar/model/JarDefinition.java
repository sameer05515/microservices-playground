package com.iagent.jar.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "jar_definitions")
public class JarDefinition {
    @Id
    private String id;

    @Indexed(unique = true)
    private String fileName;

    private String storagePath;
    private long size;
    private Instant uploadedAt;

    public JarDefinition() {}

    public JarDefinition(String id, String fileName, String storagePath, long size, Instant uploadedAt) {
        this.id = id;
        this.fileName = fileName;
        this.storagePath = storagePath;
        this.size = size;
        this.uploadedAt = uploadedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getStoragePath() { return storagePath; }
    public void setStoragePath(String storagePath) { this.storagePath = storagePath; }
    public long getSize() { return size; }
    public void setSize(long size) { this.size = size; }
    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }
}
