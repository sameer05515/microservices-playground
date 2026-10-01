# Todo Swing + Spring Boot + MongoDB

A desktop Todo application with:

- Backend: Spring Boot REST API
- Database: MongoDB
- Frontend: Java Swing desktop application
- Communication: HTTP/JSON REST endpoints

## Architecture

Swing Client -> REST/JSON -> Spring Boot -> Spring Data MongoDB -> MongoDB

## Requirements

- Java 21+
- Maven 3.9+
- Docker Desktop (recommended for MongoDB)

## 1. Start MongoDB

From the project root:

```bash
docker compose up -d
```

MongoDB:
- host: localhost
- port: 27017
- database: todo_db

## 2. Start Backend

```bash
cd todo-backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

Health/test endpoint:

```text
GET http://localhost:8080/api/todos
```

## 3. Start Swing Client

Open another terminal:

```bash
cd todo-swing-client
mvn clean package
mvn exec:java
```

The Swing application connects to:

```text
http://localhost:8080/api/todos
```

## REST API

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/todos | Get all todos |
| GET | /api/todos/{id} | Get one todo |
| POST | /api/todos | Create todo |
| PUT | /api/todos/{id} | Update todo |
| DELETE | /api/todos/{id} | Delete todo |

Example POST:

```json
{
  "title": "Learn Spring Boot",
  "description": "Revise REST APIs",
  "completed": false
}
```

## MongoDB document

```json
{
  "_id": "ObjectId(...)",
  "title": "Learn Spring Boot",
  "description": "Revise REST APIs",
  "completed": false
}
```
