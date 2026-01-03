# Spring Cloud + Keycloak + OAuth2/JWT + RBAC

This version combines the previous reactive microservices stack with Keycloak authentication and USER/ADMIN authorization.

## Architecture

```text
React / Postman
      |
      | Authorization: Bearer JWT
      v
+---------------------------+
| API Gateway :8080         |
| OAuth2 Resource Server    |
| JWT validation            |
| USER / ADMIN RBAC         |
+-------------+-------------+
              |
              | Eureka + LoadBalancer
              v
+---------------------------+
| Order Service :8082       |
| OAuth2 Resource Server    |
| USER / ADMIN RBAC         |
+-------------+-------------+
              |
              | WebClient + forwarded JWT
              | Retry + Timeout + CB
              v
+---------------------------+
| Product Service :8081     |
| OAuth2 Resource Server    |
| USER / ADMIN RBAC         |
+---------------------------+

              ^
              |
+---------------------------+
| Keycloak :8089            |
| realm: microservices      |
| roles: USER, ADMIN        |
+---------------------------+
```

Spring Security Resource Server validates JWTs using the configured Keycloak issuer; Keycloak exposes the OIDC discovery metadata for the realm. The backend services also validate tokens independently (defense in depth).

## 1. Start Keycloak

From project root:

```bash
docker compose up -d
```

Keycloak:

```text
http://localhost:8089
```

Admin:

```text
username: admin
password: admin
```

The imported realm creates:

```text
Realm: microservices
Roles: USER, ADMIN

prem-user  / user123   -> USER
prem-admin / admin123  -> USER + ADMIN
```

These credentials are for local demo use only.

## 2. Build

```bash
mvn clean install
```

## 3. Start services

```bash
cd eureka-server && mvn spring-boot:run
cd product-service && mvn spring-boot:run
cd order-service && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run
```

Eureka:

```text
http://localhost:8761
```

## 4. Get a development token

For a quick local Postman/curl test, the imported public client has direct access grants enabled:

```bash
curl -X POST \
  http://localhost:8089/realms/microservices/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=microservices-ui" \
  -d "grant_type=password" \
  -d "username=prem-user" \
  -d "password=user123"
```

For a browser application, use Authorization Code + PKCE instead of the password grant.

## 5. USER test

Use `access_token` from the response:

```http
GET http://localhost:8080/api/orders/100?productId=1
Authorization: Bearer <USER_TOKEN>
```

Also:

```http
GET http://localhost:8080/api/products/1
Authorization: Bearer <USER_TOKEN>
```

USER is allowed to access normal application APIs.

## 6. ADMIN test

Get a token for `prem-admin` and call:

```http
GET http://localhost:8080/api/admin/orders/admin/report
Authorization: Bearer <ADMIN_TOKEN>
```

Only ADMIN can access `/api/admin/**`.

A USER token receives `403 Forbidden`.

## Role mapping

Keycloak's JWT contains:

```json
{
  "realm_access": {
    "roles": ["USER", "ADMIN"]
  }
}
```

The custom converter maps:

```text
USER  -> ROLE_USER
ADMIN -> ROLE_ADMIN
```

Therefore Spring Security rules can use:

```java
.hasRole("USER")
.hasRole("ADMIN")
```

## Token propagation

Gateway receives the Bearer token and routes the request downstream. Order Service is also a resource server and uses:

```java
new ServerBearerExchangeFilterFunction()
```

to propagate the current bearer token when Order Service calls Product Service with WebClient.

Therefore the complete chain is:

```text
Client JWT
   |
   v
Gateway validates JWT
   |
   v
Order validates JWT
   |
   | WebClient forwards JWT
   v
Product validates JWT
```

## Resilience remains enabled

The previous stack is unchanged:

```text
Eureka
  |
LoadBalancer
  |
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

Failure test:

```http
GET http://localhost:8080/api/orders/100?productId=999
Authorization: Bearer <TOKEN>
```

Timeout test:

```http
GET http://localhost:8080/api/orders/100?productId=888
Authorization: Bearer <TOKEN>
```

Product `888` intentionally sleeps for 5 seconds; Order Service times out after 2 seconds.

## Direct service security

Even if someone bypasses the Gateway, Product and Order services validate JWTs themselves:

```text
http://localhost:8082/orders/100?productId=1
http://localhost:8081/products/1
```

Both require a valid bearer token.

## Production notes

The included Keycloak realm is a local demo configuration.

For production:

- use Authorization Code + PKCE for browser clients
- use HTTPS
- don't use demo passwords
- don't expose Keycloak admin publicly
- use secrets management
- restrict CORS/web origins
- configure token audiences/scopes explicitly
- use short-lived access tokens
- configure refresh tokens appropriately
- consider Kubernetes/service-mesh discovery where appropriate
- don't rely only on Gateway authorization; keep service-level authorization

## Official documentation

Spring Boot OAuth2 Resource Server: https://docs.spring.io/spring-boot/3.5/reference/web/spring-security.html

Spring Security reactive JWT: https://docs.spring.io/spring-security/reference/reactive/oauth2/resource-server/jwt.html

Keycloak OpenID Connect: https://www.keycloak.org/securing-apps/oidc-layers

Keycloak application security: https://www.keycloak.org/securing-apps/overview
