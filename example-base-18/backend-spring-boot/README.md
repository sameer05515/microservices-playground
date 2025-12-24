# Backend - Example Base 18 (Spring Boot, MongoDB)

This is the Spring Boot backend component for **Directory/Sub-Directory/Topic Hierarchy Management** — a REST API for managing hierarchical directory structures with nested sub-directories and topics.

---

## 🚀 Prerequisites

- **Java 21+**
- **Maven 3.6+** (or Maven wrapper)
- **MongoDB 6+** running locally or remotely
- **Port 8080** available

---

## ⚙️ Configuration

All configuration is handled in [`src/main/resources/application.properties`](src/main/resources/application.properties).  
Default MongoDB connection string (update for your environment if needed):

```
spring.data.mongodb.uri=mongodb://localhost:27017/ex_base_18_directory_topic_db
```

> **Tip:** No manual collection/table creation is necessary. Spring Data MongoDB creates collections automatically as needed.

---

## ▶️ Running the Backend

### Using Maven
```bash
mvn spring-boot:run
```

### Using the Packaged JAR
```bash
mvn clean package
java -jar target/backend-spring-boot-*.jar
```

---

## 📝 API Overview

### 🟢 Public Endpoints

#### Health Check
- **Health**:  
  `GET /api/health`

#### Directory Management

- **Create Directory**:  
  `POST /api/directories`  
  ```json
  {
    "name": "Documents",
    "description": "Main documents folder",
    "parentId": null
  }
  ```
  Creates a root directory. Set `parentId` to create a sub-directory.

- **Get Directory by ID**:  
  `GET /api/directories/{id}`

- **Get Root Directories**:  
  `GET /api/directories/roots`  
  Returns all directories with no parent.

- **Get Sub-Directories**:  
  `GET /api/directories/{parentId}/children`  
  Returns all sub-directories under a parent.

- **Get Directory Hierarchy**:  
  `GET /api/directories/{id}/hierarchy`  
  Returns directory with full nested children structure.

- **Get Full Hierarchy**:  
  `GET /api/directories/hierarchy/all`  
  Returns all root directories with complete nested structure.

- **Update Directory**:  
  `PUT /api/directories/{id}`  
  ```json
  {
    "name": "Updated Name",
    "description": "Updated description"
  }
  ```

- **Delete Directory**:  
  `DELETE /api/directories/{id}`  
  Soft deletes directory and all its children and topics.

#### Topic Management

- **Create Topic**:  
  `POST /api/topics`  
  ```json
  {
    "title": "Introduction to Spring Boot",
    "content": "Spring Boot is a framework...",
    "directoryId": "directory-id-here"
  }
  ```

- **Get Topic by ID**:  
  `GET /api/topics/{id}`

- **Get Topics by Directory**:  
  `GET /api/topics/directory/{directoryId}`  
  Returns all topics under a specific directory.

- **Update Topic**:  
  `PUT /api/topics/{id}`  
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content"
  }
  ```

- **Delete Topic**:  
  `DELETE /api/topics/{id}`  
  Soft deletes a topic.

#### Search

- **Search All**:  
  `GET /api/search?q=query`  
  Searches both directories and topics by name/title. Returns full path for each result.

---

## 📖 API Documentation

Fully interactive documentation & OpenAPI specs are available:

- [Swagger UI](http://localhost:8080/swagger-ui.html)
  - Browse and test API endpoints
- [Redoc](http://localhost:8080/redoc)
  - Clean, readable auto-generated API docs
- [OpenAPI JSON](http://localhost:8080/v3/api-docs)
  - Download/open the full OpenAPI 3.0 schema (for Postman, Insomnia, etc)

---

## 📁 Project Structure Overview

```
backend-spring-boot/
├── src/
│   ├── main/
│   │   ├── java/com/p/backend/
│   │   │   ├── BackendApplication.java
│   │   │   ├── config/              # OpenAPI, CORS config
│   │   │   ├── controller/          # REST controllers
│   │   │   │   ├── DirectoryController.java
│   │   │   │   ├── TopicController.java
│   │   │   │   ├── SearchController.java
│   │   │   │   └── HealthController.java
│   │   │   ├── dto/                 # Data transfer objects
│   │   │   │   ├── DirectoryRequest.java
│   │   │   │   ├── DirectoryResponse.java
│   │   │   │   ├── TopicRequest.java
│   │   │   │   ├── TopicResponse.java
│   │   │   │   ├── UpdateDirectoryRequest.java
│   │   │   │   ├── UpdateTopicRequest.java
│   │   │   │   └── SearchResponse.java
│   │   │   ├── entity/              # MongoDB entities
│   │   │   │   ├── Directory.java
│   │   │   │   └── Topic.java
│   │   │   ├── repository/          # Spring Data repositories
│   │   │   │   ├── DirectoryRepository.java
│   │   │   │   └── TopicRepository.java
│   │   │   └── service/             # Business logic
│   │   │       ├── DirectoryService.java
│   │   │       ├── TopicService.java
│   │   │       └── SearchService.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/p/backend/
└── pom.xml
```

---

## 🎯 Key Features

- ✅ Hierarchical directory structure (unlimited nesting levels)
- ✅ Unique directory names at the same level
- ✅ Topic management under any directory/sub-directory
- ✅ Soft delete (cascading for directories)
- ✅ Full hierarchy viewing with expand/collapse support
- ✅ Search functionality with full path display
- ✅ RESTful API design
- ✅ Input validation
- ✅ MongoDB persistence
- ✅ OpenAPI/Swagger documentation
- ✅ CORS enabled

---

## 📊 Database Schema

### Directory Collection
- `id` (String, Primary Key)
- `name` (String, Required)
- `description` (String, Optional)
- `parent` (DBRef to Directory, Optional)
- `parentId` (String, Optional - for easier querying)
- `deleted` (Boolean, Default: false)
- `createdAt` (LocalDateTime)
- `updatedAt` (LocalDateTime)
- `deletedAt` (LocalDateTime)

**Indexes:**
- Compound unique index on `(parentId, name)` to ensure uniqueness at same level

### Topic Collection
- `id` (String, Primary Key)
- `title` (String, Required)
- `content` (String, Optional)
- `directory` (DBRef to Directory, Required)
- `directoryId` (String, Required - for easier querying)
- `deleted` (Boolean, Default: false)
- `createdAt` (LocalDateTime)
- `updatedAt` (LocalDateTime)
- `deletedAt` (LocalDateTime)

---

## 🔍 Usage Examples

### Create Root Directory
```bash
curl -X POST http://localhost:8080/api/directories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Projects",
    "description": "All my projects"
  }'
```

### Create Sub-Directory
```bash
curl -X POST http://localhost:8080/api/directories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Backend",
    "description": "Backend projects",
    "parentId": "parent-directory-id"
  }'
```

### Create Topic
```bash
curl -X POST http://localhost:8080/api/topics \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spring Boot Guide",
    "content": "Complete guide to Spring Boot...",
    "directoryId": "directory-id"
  }'
```

### Get Full Hierarchy
```bash
curl http://localhost:8080/api/directories/hierarchy/all
```

### Search
```bash
curl "http://localhost:8080/api/search?q=spring"
```

---

## 🧪 Testing

Run tests with:
```bash
mvn test
```

---

## 📝 Notes

- **Soft Delete**: All delete operations are soft deletes. Deleted items are marked with `deleted: true` and `deletedAt` timestamp.
- **Cascading Delete**: When a directory is deleted, all its sub-directories and topics are also soft-deleted recursively.
- **Uniqueness**: Directory names must be unique at the same level (same parent). Root directories must have unique names among other root directories.
- **Path Building**: The API automatically builds and returns full paths for directories and topics (e.g., "Projects / Backend / Spring Boot Guide").

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check your MongoDB service
- Verify connection string in `application.properties`
- Check MongoDB logs for connection errors

### Port Already in Use
- Change `server.port` in `application.properties`
- Or stop the process using port 8080

### Unique Constraint Violations
- Directory names must be unique at the same level
- Check if a directory with the same name already exists under the same parent

---

## 📄 License

This project is part of the microservices-playground examples.

