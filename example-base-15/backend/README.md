# Backend - Spring Boot Application

A Spring Boot backend application.

## Prerequisites

- Java 21 or higher
- Maven 3.6+ (or use Maven wrapper)

## Running the Application

### Using Maven
```bash
mvn spring-boot:run
```

### Using Java directly
```bash
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

## Endpoints

- Health Check: `GET http://localhost:8080/api/health`

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/p/backend/
│   │   │   ├── BackendApplication.java
│   │   │   └── controller/
│   │   │       └── HealthController.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/p/backend/
│           └── BackendApplicationTests.java
└── pom.xml
```

