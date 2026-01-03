# iAgent V4

A Spring Boot + MongoDB + React/Vite recreation of the iAgent workflow.

## V4 focus

V4 adds a **JavaService Test Console**. A JavaService created from a method can now be executed from the UI.

```text
Upload JAR
   ↓
Uploaded JARs
   ↓
Public Classes
   ↓
Public Methods
   ↓
Configure JavaService
   ↓
JavaServices
   ↓
Test
   ↓
Enter Arguments
   ↓
Execute JavaService
   ↓
View Result + Execution Time
```

## Project structure

```text
iagent-v2-work/
├── backend/
│   ├── pom.xml
│   ├── docker-compose.yml
│   └── src/
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
```

## Backend stack

- Java 17
- Spring Boot 3.3.6
- Spring Web
- Spring Data MongoDB
- MongoDB 8 Docker
- Jackson
- Maven

## Frontend stack

- React 18
- Vite
- Axios

## Start MongoDB

From `backend/`:

```bash
docker compose up -d
```

MongoDB runs on:

```text
mongodb://localhost:27017
```

Database:

```text
iagent
```

## Run backend

```bash
cd backend
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

JAR files are stored on the server under:

```text
backend/jar-storage/
```

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## APIs

### Upload JAR

```http
POST /api/jars
Content-Type: multipart/form-data
```

### List JARs

```http
GET /api/jars
```

### Get public classes

```http
GET /api/jars/{jarId}/classes
```

### Get public methods

```http
GET /api/jars/{jarId}/methods?className=com.example.service.ArithmeticService
```

### Create JavaService

```http
POST /api/java-services
```

Example:

```json
{
  "serviceName": "sumService",
  "description": "Adds two numbers",
  "enabled": true,
  "jarId": "...",
  "className": "com.example.service.ArithmeticService",
  "methodName": "sum",
  "returnType": "int",
  "parameters": [
    { "name": "arg0", "type": "int" },
    { "name": "arg1", "type": "int" }
  ]
}
```

### List JavaServices

```http
GET /api/java-services
```

### Execute JavaService

```http
POST /api/java-services/{serviceId}/execute
Content-Type: application/json
```

Example for an arithmetic service:

```json
{
  "arguments": [10, 5]
}
```

Example response:

```json
{
  "serviceId": "...",
  "serviceName": "sumService",
  "className": "com.example.service.ArithmeticService",
  "methodName": "sum",
  "result": 15,
  "resultType": "java.lang.Integer",
  "executionTimeMs": 2
}
```

## UI JavaService Test Console

The JavaServices page has a **Test** button for enabled services.

The test dialog reads the saved method parameter metadata and creates inputs automatically.

Supported simple inputs include:

- byte / Byte
- short / Short
- int / Integer
- long / Long
- float / Float
- double / Double
- boolean / Boolean
- char / Character
- String

For other Java types, the UI accepts JSON.

The UI shows:

- method name
- parameter name and Java type
- request argument preview
- execution result
- result type from backend
- execution time
- backend execution errors

## Execution behavior

The backend:

1. Loads the selected JAR using a dedicated `URLClassLoader`.
2. Loads the configured public class without running its static initialization during class lookup.
3. Resolves the stored parameter types.
4. Finds the configured public method.
5. Converts JSON arguments to the Java parameter types using Jackson.
6. Creates an object using a public no-argument constructor for instance methods.
7. Invokes the method.
8. Returns the method result and execution time.

Static methods do not require object construction.

## Important local-development security note

This V4 test feature intentionally executes code from uploaded JAR files. Therefore it should be treated as a **trusted-development-environment feature**.

Do not expose this implementation directly to untrusted users or the public internet. A production implementation should isolate JAR execution in a sandbox/container with resource limits, network restrictions, filesystem restrictions, timeouts, and an explicit allow-list of permitted operations.

## Example test flow

Use the `ArithmeticService` sample JAR containing:

```java
public int sum(int a, int b)
public int subtraction(int a, int b)
public int multiplication(int a, int b)
public int division(int a, int b)
```

Then:

```text
Upload arithmetic-service.jar
        ↓
Select ArithmeticService
        ↓
Select sum(int, int)
        ↓
Create JavaService: sumService
        ↓
JavaServices → Test
        ↓
a = 10
b = 5
        ↓
Execute
        ↓
Result = 15
```
