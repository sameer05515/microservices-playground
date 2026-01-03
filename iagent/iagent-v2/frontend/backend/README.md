# iAgent Backend V2

Spring Boot backend for the iAgent JAR integration platform.

## Features

- Upload a JAR and save the physical file under `jar-storage/`.
- Store JAR metadata in MongoDB.
- Return a generated JAR ID.
- Prevent duplicate JAR file names.
- List all uploaded JARs.
- Discover public classes for a selected JAR.
- Discover public methods declared directly by a selected public class.
- Central CORS configuration.
- Central API error handling.

## Stack

- Java 17
- Spring Boot 3.3.6
- Spring Web
- Spring Data MongoDB
- MongoDB 8 Docker
- Maven
- Java Reflection / URLClassLoader

## Start MongoDB

```bash
docker compose up -d
```

MongoDB is available at `mongodb://localhost:27017`, database `iagent`.

## Run

```bash
mvn spring-boot:run
```

Backend: `http://localhost:8080`

## APIs

### Upload

```http
POST /api/jars
Content-Type: multipart/form-data
```

Form field: `file`

### List all JARs

```http
GET /api/jars
```

### Public classes

```http
GET /api/jars/{jarId}/classes
```

### Public methods

```http
GET /api/jars/{jarId}/methods?className=com.example.service.ArithmeticService
```

## Duplicate JAR Name Restriction

The original uploaded file name is stored with a MongoDB unique index. For example, after uploading `arithmetic-service.jar`, another upload with the same original file name is rejected with HTTP `409 Conflict`.

The service also performs an early `existsByFileName` check for a friendly response. The MongoDB unique index is the final protection against concurrent duplicate uploads.

## Storage

Physical files are stored under:

```text
jar-storage/
```

The physical file is named using the generated ID:

```text
{jarId}.jar
```

MongoDB stores the original file name and physical storage path.

## Class and Method Discovery

The backend scans class entries in the uploaded JAR and uses Java reflection to determine public classes. `module-info.class` and `package-info.class` are ignored.

The method API returns public methods declared directly by the selected class. Discovered classes are not instantiated.
