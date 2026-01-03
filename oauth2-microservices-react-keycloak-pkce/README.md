# OAuth2 Microservices Demo

Minimal end-to-end OAuth2 flow:

```text
React + Vite
     |
     | Authorization Code + PKCE
     v
Keycloak
     |
     | Access Token (JWT)
     v
React
     |
     | Authorization: Bearer <JWT>
     v
Spring Boot Resource Server
     |
     | JWT validation
     v
Keycloak issuer
```

## 1. Start Keycloak

From the project root:

```bash
docker compose up -d
```

Keycloak:

http://localhost:8080

The realm is automatically imported from:

```text
keycloak/demo-realm.json
```

Preconfigured:

```text
Realm:       demo
Client:      react-client
Client type: Public
Flow:        Authorization Code
PKCE:        S256
Redirect:    http://localhost:5174/*
User:        demo
Password:    demo
```

Admin console:

```text
http://localhost:8080/admin
```

Admin:

```text
admin / admin
```

## 2. Start Spring Boot

```bash
cd product-service
mvn spring-boot:run
```

Service:

```text
http://localhost:8081
```

## 3. Start React

```bash
cd oauth2-ui
npm install
npm run dev
```

Frontend:

```text
http://localhost:5174
```

## 4. Test the complete flow

Open:

```text
http://localhost:5174
```

Click:

```text
Login with Keycloak
```

Login:

```text
username: demo
password: demo
```

After successful login, React receives an authorization-code callback and `keycloak-js` exchanges the code for tokens using PKCE.

Then click:

```text
GET /products
```

React sends:

```http
GET http://localhost:8081/products
Authorization: Bearer <ACCESS_TOKEN>
```

Spring Security validates the JWT using:

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/realms/demo
```

## 5. What is handled by what?

### React / keycloak-js

```text
Login redirect
Authorization Code
PKCE
Token exchange
Access token storage
Token refresh
Logout
```

### Keycloak

```text
Authentication
Authorization endpoint
Token endpoint
JWT generation
User management
OIDC discovery
JWKS/public keys
```

### Spring Boot

```text
Bearer token extraction
JWT signature validation
Issuer validation
Token expiry validation
Authentication context
Protected endpoint authorization
```

No custom:

```text
JwtService
JwtAuthenticationFilter
TokenProvider
UserDetailsService
```

## 6. Important browser flow

```text
1. React
   |
   | GET /realms/demo/protocol/openid-connect/auth
   | response_type=code
   | client_id=react-client
   | code_challenge=...
   | code_challenge_method=S256
   v
2. Keycloak login
   |
   v
3. Keycloak
   |
   | redirect_uri?code=AUTH_CODE
   v
4. React
   |
   | POST /token
   | code + code_verifier
   v
5. Keycloak
   |
   | access_token
   v
6. React
   |
   | Authorization: Bearer JWT
   v
7. Spring Boot
   |
   | validate JWT
   v
8. /products
   |
   v
   200 OK
```

## 7. Recreate Keycloak realm

If you change `demo-realm.json`, recreate the Keycloak container:

```bash
docker compose down
docker compose up -d
```

For a clean reset including the container filesystem:

```bash
docker compose down -v
docker compose up -d
```
