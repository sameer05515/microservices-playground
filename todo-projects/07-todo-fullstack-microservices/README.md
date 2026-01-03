# 07 — Todo Fullstack Microservices

## Focus
Split the application into independently deployable services.

### Architecture
- Eureka Server: `8761`
- API Gateway: `8088`
- Auth Service: `8081`
- Todo Service: `8080`
- Separate `auth_db` and `todo_db`
- Spring Cloud LoadBalancer
- Resilience4j Circuit Breaker / TimeLimiter / fallback
- Redis and observability layers retained

## What changed from previous version
- Replaced the single backend with `auth-service` and `todo-service`.
- Added Eureka service discovery.
- Added API Gateway as the client entry point.
- Added client-side load balancing.
- Added Resilience4j fault-tolerance patterns.
- Split persistence into separate service databases.

## Learning goal
Understand service boundaries, discovery, gateway routing, failure isolation and independent database ownership.
