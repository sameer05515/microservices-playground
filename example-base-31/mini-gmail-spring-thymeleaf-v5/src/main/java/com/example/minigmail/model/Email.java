package com.example.minigmail.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document("emails")
public class Email {
    @Id private String id;
    private String threadId;
    private String fromUserId;
    private List<String> toUserIds = new ArrayList<>();
    private List<String> ccUserIds = new ArrayList<>();
    private List<String> bccUserIds = new ArrayList<>();
    private String subject = "";
    private String body = "";
    private List<Attachment> attachments = new ArrayList<>();
    private List<String> labels = new ArrayList<>();
    private boolean read;
    private boolean draft;
    private boolean starred;
    private boolean important;
    private Instant createdAt;
    private Instant deletedAt;

    public Email() {}

    public String getId() { return id; }
    public void setId(String v) { id=v; }
    public String getThreadId() { return threadId; }
    public void setThreadId(String v) { threadId=v; }
    public String getFromUserId() { return fromUserId; }
    public void setFromUserId(String v) { fromUserId=v; }
    public List<String> getToUserIds() { return toUserIds; }
    public void setToUserIds(List<String> v) { toUserIds=v; }
    public List<String> getCcUserIds() { return ccUserIds; }
    public void setCcUserIds(List<String> v) { ccUserIds=v; }
    public List<String> getBccUserIds() { return bccUserIds; }
    public void setBccUserIds(List<String> v) { bccUserIds=v; }
    public String getSubject() { return subject; }
    public void setSubject(String v) { subject=v; }
    public String getBody() { return body; }
    public void setBody(String v) { body=v; }
    public List<Attachment> getAttachments() { return attachments; }
    public void setAttachments(List<Attachment> v) { attachments=v; }
    public List<String> getLabels() { return labels; }
    public void setLabels(List<String> v) { labels=v; }
    public boolean isRead() { return read; }
    public void setRead(boolean v) { read=v; }
    public boolean isDraft() { return draft; }
    public void setDraft(boolean v) { draft=v; }
    public boolean isStarred() { return starred; }
    public void setStarred(boolean v) { starred=v; }
    public boolean isImportant() { return important; }
    public void setImportant(boolean v) { important=v; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant v) { createdAt=v; }
    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant v) { deletedAt=v; }

    public static class Attachment {
        private String originalName, filename, path, contentType;
        private long size;
        public Attachment() {}
        public Attachment(String originalName, String filename, String path, String contentType, long size) {
            this.originalName=originalName; this.filename=filename; this.path=path;
            this.contentType=contentType; this.size=size;
        }
        public String getOriginalName(){return originalName;}
        public void setOriginalName(String v){originalName=v;}
        public String getFilename(){return filename;}
        public void setFilename(String v){filename=v;}
        public String getPath(){return path;}
        public void setPath(String v){path=v;}
        public String getContentType(){return contentType;}
        public void setContentType(String v){contentType=v;}
        public long getSize(){return size;}
        public void setSize(long v){size=v;}
    }
}
