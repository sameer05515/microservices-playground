# Example Base 18 - Directory/Sub-Directory/Topic Hierarchy Management

This example demonstrates a full-stack application for managing hierarchical directory structures with nested sub-directories and topics. It includes a Spring Boot REST API backend and a Next.js React frontend.

---

## 📋 User Story

**As a user**, I want to create and manage directories with nested sub-directories and topics inside them, so that I can organize content in a structured hierarchy.

---

## ✅ Acceptance Criteria Implementation

### 1️⃣ Create Directory ✅
- ✅ User can create a root directory
- ✅ Directory must have unique name at same level
- ✅ Mandatory fields: `name`
- ✅ Optional: `description`

**Endpoint:** `POST /api/directories`

### 2️⃣ Create Sub-Directory (Nested) ✅
- ✅ User can create unlimited levels of sub-directories
- ✅ Parent directory selection required
- ✅ Names must be unique within the same parent

**Endpoint:** `POST /api/directories` (with `parentId`)

### 3️⃣ Create Topic under any Directory/Sub-Directory ✅
- ✅ User can add topic under any level
- ✅ Topic must belong to exactly one node
- ✅ Mandatory fields: `title`
- ✅ Optional: `content`

**Endpoint:** `POST /api/topics`

### 4️⃣ View Hierarchy ✅
- ✅ System displays tree structure
- ✅ Expand/collapse support (via nested children in response)
- ✅ Shows counts: directory count, topic count

**Endpoints:**
- `GET /api/directories/{id}/hierarchy` - Single directory hierarchy
- `GET /api/directories/hierarchy/all` - Full hierarchy

### 5️⃣ Update / Rename ✅
- ✅ User can rename directory / sub-directory / topic
- ✅ Validation handled
- ✅ Hierarchy must not break

**Endpoints:**
- `PUT /api/directories/{id}`
- `PUT /api/topics/{id}`

### 6️⃣ Delete Rules ✅
- ✅ Deleting directory deletes all children + topics (after confirmation)
- ✅ Soft delete preferred

**Endpoints:**
- `DELETE /api/directories/{id}` - Cascading soft delete
- `DELETE /api/topics/{id}` - Soft delete

### 7️⃣ Search / Filter ✅
- ✅ User can search directory / topic by name
- ✅ Shows full path in result

**Endpoint:** `GET /api/search?q=query`

---

## 🏗️ Architecture

```
example-base-18/
├── backend-spring-boot/          # Spring Boot Backend (Java)
│   ├── src/main/java/com/p/backend/
│   │   ├── config/              # OpenAPI, CORS config
│   │   ├── controller/         # REST controllers
│   │   ├── dto/                # Data transfer objects
│   │   ├── entity/             # MongoDB entities
│   │   ├── repository/         # Spring Data repositories
│   │   └── service/            # Business logic
│   ├── pom.xml
│   └── README.md               # Detailed backend documentation
└── frontend-nextjs/             # Next.js Frontend (React/TypeScript)
    ├── app/                     # Next.js app router pages
    ├── components/              # React components
    ├── lib/                     # API service layer
    ├── types/                   # TypeScript types
    └── README.md                # Detailed frontend documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Maven 3.6+
- MongoDB 6+
- Node.js 18+
- npm or yarn

### Running the Application

#### Option 1: Using Batch Files (Windows) ⚡

1. **Check Prerequisites**:
   ```cmd
   check-prerequisites.bat
   ```

2. **Install Dependencies** (first time only):
   ```cmd
   install-dependencies.bat
   ```

3. **Start MongoDB** (if not running as a service):
   ```cmd
   mongod
   ```

4. **Start Everything**:
   ```cmd
   start-all.bat
   ```
   This will start both backend and frontend in separate windows.

   Or start individually:
   - `start-backend.bat` - Backend only
   - `start-frontend.bat` - Frontend only

See [README-BATCH-FILES.md](README-BATCH-FILES.md) for detailed batch file documentation.

#### Option 2: Manual Commands

1. **Start MongoDB** (if not already running):
   ```bash
   mongod
   ```

2. **Start the Backend**:
   ```bash
   cd backend-spring-boot
   mvn spring-boot:run
   ```
   Backend will run on `http://localhost:8080`

3. **Start the Frontend** (in a new terminal):
   ```bash
   cd frontend-nextjs
   npm install
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

4. **Access the Application**:
   - Frontend UI: `http://localhost:3000`
   - API Base URL: `http://localhost:8080/api`
   - Swagger UI: `http://localhost:8080/swagger-ui.html`
   - Health Check: `http://localhost:8080/api/health`

---

## 📚 API Documentation

Full API documentation is available via Swagger UI at:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

---

## 🧪 Example Usage

### 1. Create Root Directory
```bash
POST /api/directories
{
  "name": "Documents",
  "description": "Main documents folder"
}
```

### 2. Create Sub-Directory
```bash
POST /api/directories
{
  "name": "Projects",
  "description": "Project files",
  "parentId": "documents-id"
}
```

### 3. Create Topic
```bash
POST /api/topics
{
  "title": "Spring Boot Guide",
  "content": "Complete guide to Spring Boot framework",
  "directoryId": "projects-id"
}
```

### 4. Get Full Hierarchy
```bash
GET /api/directories/hierarchy/all
```

### 5. Search
```bash
GET /api/search?q=spring
```

---

## 📊 Data Model

### Directory
- Self-referencing entity (parent-child relationship)
- Unique name constraint at same level
- Soft delete with cascading

### Topic
- Belongs to exactly one directory
- Soft delete
- Full path tracking

---

## 🔑 Key Features

- ✅ Unlimited nesting levels
- ✅ Unique name validation at same level
- ✅ Soft delete with cascading
- ✅ Full hierarchy viewing
- ✅ Search with path display
- ✅ RESTful API design
- ✅ OpenAPI documentation
- ✅ Input validation
- ✅ MongoDB persistence

---

## 📖 Detailed Documentation

- **Backend**: See [backend-spring-boot/README.md](backend-spring-boot/README.md) for detailed backend documentation
- **Frontend**: See [frontend-nextjs/README.md](frontend-nextjs/README.md) for detailed frontend documentation

---

## 🎯 Next Steps

Potential enhancements:
- [ ] Add authentication/authorization
- [ ] Add file upload support
- [ ] Add pagination for large hierarchies
- [ ] Add bulk operations
- [ ] Add export/import functionality
- [ ] Add drag-and-drop for reorganizing hierarchy

---

## 📄 License

This project is part of the microservices-playground examples.

