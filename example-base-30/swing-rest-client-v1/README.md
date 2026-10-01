# Swing REST Client V1

A small Postman-like REST API client built with Java Swing.

## Features

- GET, POST, PUT, PATCH, DELETE
- URL input
- Enable/disable custom HTTP headers
- JSON request body
- Pretty-printed JSON responses
- HTTP status
- Response time
- Response size
- Non-blocking requests using `SwingWorker`
- Java 17 `HttpClient`
- Jackson JSON parsing
- Maven `exec:java` support
- Fat JAR packaging

## Run

```powershell
mvn clean compile
mvn exec:java
```

## Package

```powershell
mvn clean package
java -jar target/swing-rest-client-v1-1.0.0.jar
```

## Default API

```text
GET https://jsonplaceholder.typicode.com/todos/1
```

## Project structure

```text
swing-rest-client-v1
├── pom.xml
├── README.md
└── src/main/java/com/example/restclient
    ├── Main.java
    └── RestClientFrame.java
```
