# iAgent V3

V3 extends the iAgent JAR browser with JavaService configuration and a separate JavaServices catalog.

## Architecture

```text
React + Vite
     |
     | REST
     v
Spring Boot 3.3.6
     |
     +---- JAR APIs ------------ MongoDB: jar_definitions
     |
     +---- JavaService APIs ---- MongoDB: java_services
     |
     +---- jar-storage/          Physical JAR files
```

## V3 workflow

```text
Upload JAR
   |
   v
Uploaded JARs
   |
   v
Select JAR
   |
   v
Public Classes
   |
   v
Public Methods
   |
   v
Select Method
   |
   v
Configure JavaService popup
   |
   v
Create JavaService
   |
   v
JavaServices list
```

## Backend

- Java 17
- Spring Boot 3.3.6
- Spring Web
- Spring Data MongoDB
- Spring Validation
- MongoDB 8 Docker
- Java Reflection / URLClassLoader

### Start MongoDB

```bash
docker compose up -d
```

### Run backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

## Frontend

- React 18
- Vite
- Axios

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## APIs

### JAR APIs

```http
POST /api/jars
GET  /api/jars
GET  /api/jars/{jarId}/classes
GET  /api/jars/{jarId}/methods?className=com.example.service.ArithmeticService
```

### JavaService APIs

Create a JavaService:

```http
POST /api/java-services
Content-Type: application/json
```

Example:

```json
{
  "serviceName": "arithmeticSumService",
  "description": "Exposes the sum method as a JavaService",
  "enabled": true,
  "jarId": "<jar-id>",
  "className": "com.example.service.ArithmeticService",
  "methodName": "sum",
  "returnType": "int",
  "parameters": [
    {
      "name": "arg0",
      "type": "int"
    },
    {
      "name": "arg1",
      "type": "int"
    }
  ]
}
```

List JavaServices:

```http
GET /api/java-services
```

## JavaService configuration popup

When a public method is selected in the Uploaded JARs page, V3 opens a popup containing:

- Source JAR
- Selected class
- Selected method
- Service Name
- Description
- Enabled/Disabled option
- Create JavaService action

The selected method metadata is stored with the JavaService definition.

## MongoDB collections

### `jar_definitions`

Stores uploaded JAR metadata:

- id
- fileName
- storagePath
- size
- uploadedAt

The JAR filename is unique.

### `java_services`

Stores JavaService definitions:

- id
- serviceName
- description
- enabled
- jarId
- jarFileName
- className
- methodName
- returnType
- parameters
- createdAt

## UI navigation

```text
Upload JAR
Uploaded JARs
JavaServices
```

The **Uploaded JARs** page provides the JAR → class → method navigation. Selecting a method opens the JavaService configuration popup.

The **JavaServices** page shows all created JavaServices in a separate list.

## Current scope

V3 creates and persists the JavaService definition. It does not yet execute the selected Java method or expose a runtime HTTP endpoint for the created service.
