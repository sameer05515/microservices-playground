# Mini Gmail Spring Boot + Thymeleaf v5

## Stack
- Java 17
- Spring Boot 3.5.6
- Thymeleaf
- Spring Security + BCrypt
- MongoDB / Spring Data MongoDB
- Multipart attachments
- Docker Compose

## What's new in v5
- Per-user `mailbox_entries` collection
- Read/unread is independent for each recipient
- Star/unstar is independent for each user
- Important is independent for each user
- Trash/restore is independent for each mailbox
- Sender has SENT entry; each recipient gets its own INBOX entry
- Existing v4 email documents are migrated automatically at startup
- Drafts remain sender-owned
- Permanent delete removes the shared email only for the sender; recipients can delete their own mailbox entry

## Run
```bash
docker compose up -d
mvn clean
mvn spring-boot:run
```

Open: http://localhost:8080/auth/login

Demo:
- prem@gmail.com / 123456
- rahul@gmail.com / 123456
- demo@gmail.com / 123456

## MongoDB
The application continues using the existing `mini_gmail` database. On startup, v5 creates missing `mailbox_entries` for existing non-draft emails.
