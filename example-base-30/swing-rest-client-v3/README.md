# Swing REST Client V3

Postman-like Java Swing REST client.

## Features
- GET, POST, PUT, PATCH, DELETE
- Query params and headers
- JSON request/response
- Request history
- Saved collections
- Import/export collections
- Environment variables: `{{baseUrl}}`, `{{token}}`
- local/dev/prod environments
- No Auth / Bearer / Basic / OAuth2 Bearer Token modes
- OAuth client/token fields
- Dark theme
- Custom application icon
- Non-blocking Java 17 HttpClient
- Jackson JSON formatting

## Run

```powershell
mvn clean compile
mvn exec:java
```

## Package

```powershell
mvn clean package
java -jar target/swing-rest-client-v3-3.0.0.jar
```

## Environment example

```json
{
  "local": {"baseUrl":"http://localhost:8080","token":""},
  "dev": {"baseUrl":"https://dev.example.com","token":""},
  "prod": {"baseUrl":"https://api.example.com","token":""}
}
```

Use `{{baseUrl}}/api/todos`.

## Windows EXE

```powershell
jpackage --type exe --name "Swing REST Client" --input target --main-jar swing-rest-client-v3-3.0.0.jar --main-class com.example.restclient.Main --win-menu --win-shortcut
```
