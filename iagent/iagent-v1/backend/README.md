# iAgent Backend V1

Spring Boot backend recreating the first iAgent capabilities.

## Features
- Upload a JAR; save physical file under `jar-storage/` and metadata in MongoDB.
- Return generated JAR ID.
- Discover public classes.
- Discover public methods declared directly by a selected class.

## Stack
Java 17, Spring Boot 3.3.6, Spring Web, Spring Data MongoDB, MongoDB 8, Maven.

## Start MongoDB
```bash
docker compose up -d
```

## Run
```bash
mvn spring-boot:run
```

## APIs
### Upload
`POST /api/jars` multipart field `file`

### Public classes
`GET /api/jars/{jarId}/classes`

### Public methods
`GET /api/jars/{jarId}/methods?className=com.example.UserService`

Example method response:
```json
{
  "jarId": "...",
  "className": "com.example.UserService",
  "methods": [
    {"name":"createUser","returnType":"com.example.User","parameters":[{"name":"User","type":"com.example.User"}]}
  ]
}
```

The implementation does not instantiate discovered classes.
