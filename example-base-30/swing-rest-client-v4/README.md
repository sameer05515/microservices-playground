# Swing REST Client V4

A developer-focused Postman-style REST client built with Java 17 + Swing.

## V4 features

### REST
- GET / POST / PUT / PATCH / DELETE
- Query parameters
- Headers
- JSON body
- Multipart/form-data
- Pretty JSON / Raw response
- Request history
- Saved collections
- Import/export collections
- Environment variables
- Dark theme
- Custom application icon

### Authentication
- No Auth
- Bearer Token
- Basic Auth
- OAuth2 Bearer Token
- OAuth2 Authorization Code + PKCE helper

### Developer Tools
- JWT Decoder
- cURL import
- cURL export
- WebSocket client
- Request code snippets
- Environment variable resolution

## Run

```powershell
mvn clean compile
mvn exec:java
```

## Package

```powershell
mvn clean package
java -jar target/swing-rest-client-v4-4.0.0.jar
```

## OAuth2 PKCE

The OAuth2 helper generates a PKCE verifier/challenge and opens the authorization URL in the system browser. The returned authorization code can be exchanged for tokens using the configured token endpoint.

## JWT

Paste a JWT into the JWT Decoder tool. The header and payload are decoded locally without sending the token to a server.

## cURL

Example:

```bash
curl -X POST "https://example.com/api/todos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Learn Java"}'
```

Use **Tools → cURL Import** to populate the request.

## WebSocket

Use **Tools → WebSocket Client**, enter:

```text
wss://echo.websocket.events
```

Connect, send a message, and view received messages.

## Windows EXE

```powershell
jpackage `
  --type exe `
  --name "Swing REST Client" `
  --input target `
  --main-jar swing-rest-client-v4-4.0.0.jar `
  --main-class com.example.restclient.Main `
  --win-menu `
  --win-shortcut
```
