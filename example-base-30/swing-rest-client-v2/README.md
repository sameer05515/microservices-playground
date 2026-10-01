# Swing REST Client V2

Postman-like REST client built with Java Swing.

## V2 Features

- GET / POST / PUT / PATCH / DELETE
- Query parameters
- Custom headers
- JSON request body
- Pretty JSON response
- Request history (up to 50 requests)
- Saved request collections
- Save request to JSON file
- Load request from JSON file
- Copy response
- HTTP status
- Response time
- Response size
- Non-blocking HTTP calls with SwingWorker
- Java 17 HttpClient
- Jackson
- Maven exec plugin
- Fat JAR

## Run

```powershell
mvn clean compile
mvn exec:java
```

## Package

```powershell
mvn clean package
java -jar target/swing-rest-client-v2-2.0.0.jar
```

## Example

```text
GET
https://jsonplaceholder.typicode.com/todos/1
```

Query parameters can be added from:

```text
Query Params → + Add
```

Example:

```text
userId = 1
```

Saved requests can be persisted as JSON using **Save** and loaded later using **Load**.

## Planned V3

- Basic Auth
- Bearer Token
- OAuth2
- Environment variables
- Import/export collections
- JSON syntax highlighting
- Dark theme
- Custom application icon
- Windows EXE via jpackage
