# OAuth2 Microservices Demo

## Projects

```text
oauth2-microservices/
│
├── product-service/       # Spring Boot OAuth2 Resource Server
├── oauth2-ui/             # React + Vite frontend
├── docker-compose.yml     # Keycloak
└── README.md
```

## Run backend

```bash
cd product-service
mvn spring-boot:run
```

Backend:

http://localhost:8081

## Run frontend

```bash
cd oauth2-ui
npm install
npm run dev
```

Frontend:

http://localhost:5174

## Current flow

```text
React
  |
  | GET /public
  v
Product Service
  |
  | 200
  v

React
  |
  | GET /products
  v
Product Service
  |
  | no token
  v
401 Unauthorized
```

For the protected flow:

```text
React
   |
   | access token
   v
Product Service
   |
   | JWT validation
   v
Keycloak
   |
   | valid
   v
200 OK
```

## Important

The current React UI deliberately does NOT implement OAuth2 login yet.

This keeps the first demonstration focused on:

1. OAuth2 Authorization Server
2. OAuth2 Resource Server
3. JWT access token
4. Spring Security automatic JWT validation

Next iteration can add:

```text
React
  |
  | Login
  v
Keycloak
  |
  | Authorization Code + PKCE
  v
React
  |
  | Bearer token
  v
product-service
```
