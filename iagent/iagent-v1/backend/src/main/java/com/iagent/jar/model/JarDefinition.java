package com.iagent.jar.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "jar_definitions")
public class JarDefinition {
    @Id
    private String id;
    private String fileName;
    private String storagePath;
    private long size;
    private Instant uploadedAt;

    public JarDefinition() {
    }

    public JarDefinition(String id, String fileName, String storagePath, long size, Instant uploadedAt) {
        this.id = id;
        this.fileName = fileName;
        this.storagePath = storagePath;
        this.size = size;
        this.uploadedAt = uploadedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String v) {
        id = v;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String v) {
        fileName = v;
    }

    public String getStoragePath() {
        return storagePath;
    }

    public void setStoragePath(String v) {
        storagePath = v;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long v) {
        size = v;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Instant v) {
        uploadedAt = v;
    }
}
