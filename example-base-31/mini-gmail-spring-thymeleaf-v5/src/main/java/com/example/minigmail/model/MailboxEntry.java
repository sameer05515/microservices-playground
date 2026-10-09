package com.example.minigmail.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document("mailbox_entries")
public class MailboxEntry {
    @Id private String id;
    private String emailId;
    private String userId;
    private String folder; // INBOX, SENT, TRASH
    private boolean read;
    private boolean starred;
    private boolean important;
    private Instant createdAt;
    private Instant deletedAt;

    public MailboxEntry() {}
    public MailboxEntry(String emailId, String userId, String folder, boolean read, Instant createdAt) {
        this.emailId=emailId; this.userId=userId; this.folder=folder;
        this.read=read; this.createdAt=createdAt;
    }
    public String getId(){return id;} public void setId(String v){id=v;}
    public String getEmailId(){return emailId;} public void setEmailId(String v){emailId=v;}
    public String getUserId(){return userId;} public void setUserId(String v){userId=v;}
    public String getFolder(){return folder;} public void setFolder(String v){folder=v;}
    public boolean isRead(){return read;} public void setRead(boolean v){read=v;}
    public boolean isStarred(){return starred;} public void setStarred(boolean v){starred=v;}
    public boolean isImportant(){return important;} public void setImportant(boolean v){important=v;}
    public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
    public Instant getDeletedAt(){return deletedAt;} public void setDeletedAt(Instant v){deletedAt=v;}
}
