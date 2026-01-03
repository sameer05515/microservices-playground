# React + Authorization Code + PKCE + Keycloak + Gateway + Microservices

## Full flow

React SPA (`5173`)
→ Keycloak (`8089`) Authorization Code + PKCE S256
→ JWT Access Token
→ API Gateway (`8080`) JWT validation + RBAC
→ Eureka + LoadBalancer
→ Order Service (`8082`)
→ WebClient + Retry + Timeout + CircuitBreaker
→ Product Service (`8081`) JWT validation + RBAC

## Start

### 1. Keycloak

```bash
docker compose up -d
```

Keycloak: http://localhost:8089

Admin: `admin / admin`

Realm: `microservices`

Users:

```text
prem-user / user123     USER
prem-admin / admin123   USER + ADMIN
```

### 2. Backend

```bash
mvn clean install
```

Start:

```bash
cd eureka-server
mvn spring-boot:run
```

```bash
cd product-service
mvn spring-boot:run
```

```bash
cd order-service
mvn spring-boot:run
```

```bash
cd api-gateway
mvn spring-boot:run
```

### 3. React

```bash
cd frontend
npm install
npm run dev
```

Open:

http://localhost:5173

## OAuth2 + PKCE

The React SPA is a public OAuth2 client. No client secret is stored in the browser.

```js
kc.init({
  onLoad: 'check-sso',
  pkceMethod: 'S256'
})
```

The browser gets an authorization code and exchanges it using the PKCE verifier.

## RBAC

USER:

```http
GET /api/orders/100?productId=1
GET /api/products/1
```

ADMIN:

```http
GET /api/orders/admin/report
```

A USER calling the admin endpoint receives `403 Forbidden`.

## JWT propagation

React → Gateway:

```http
Authorization: Bearer <JWT>
```

Order Service receives the JWT and forwards the same bearer token to Product Service using WebClient.

## Resilience

```text
WebClient
   |
Timeout 2s
   |
Retry
   |
Circuit Breaker
   |
Fallback
```

Product `999` intentionally fails.

Product `888` intentionally waits 5 seconds.

## Load balancing

Run a second Product Service instance:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8083"
```

Both register as `PRODUCT-SERVICE`. Order calls:

```text
http://PRODUCT-SERVICE/products/{id}
```

and `@LoadBalanced WebClient.Builder` resolves the instance.

## Production notes

This is an interview/learning project. For production add HTTPS, strict CORS, audience/scope validation, secrets management, observability, rate limiting, secure token handling, and infrastructure/service-discovery hardening.

Demo credentials are intentionally included only for local testing.
