# Mini Gmail — Spring Boot + Thymeleaf v4.2

Spring Boot MVC version of the Mini Gmail v4.2 application.

## Stack

- Java 17
- Spring Boot 3.5.6
- Spring MVC
- Thymeleaf
- Spring Security
- Spring Data MongoDB
- MongoDB
- Lombok

## Features

- Registration/login/logout
- BCrypt password hashing
- Spring Security form authentication
- Inbox / Sent / Drafts / Starred / Important / Trash
- Search
- Pagination
- Read/unread
- Star/unstar
- Important
- Reply / Forward
- To / CC / BCC
- File attachments
- Contacts
- Docker Compose MongoDB
- Same v4.2 recipient model: sent messages contain SENT + INBOX labels
- Demo users are automatically seeded

## Run

```bash
docker compose up -d
mvn spring-boot:run
```

Open:

http://localhost:8080

Demo accounts:

```text
prem@gmail.com / 123456
rahul@gmail.com / 123456
demo@gmail.com / 123456
```

## Test mail delivery

1. Login as `prem@gmail.com`.
2. Send mail to `rahul@gmail.com`.
3. Logout.
4. Login as `rahul@gmail.com`.
5. Open Inbox.

The message will be visible in Rahul's Inbox.

## MongoDB

Default:

```text
mongodb://localhost:27017/mini_gmail
```

Override:

```text
MONGODB_URI=mongodb://localhost:27017/mini_gmail
```

## Important note

This version intentionally uses Spring Security's standard server-side form authentication rather than JWT cookies. For a Thymeleaf MVC application this is simpler and more idiomatic; the MongoDB mail model and v4.2 features remain the same.
