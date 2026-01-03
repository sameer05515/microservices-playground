# Todo Projects — Progressive Learning Series

This repository contains 9 incremental versions of the same Todo full-stack application.

## Recommended progression

1. `01-todo-fullstack` — basic full-stack CRUD
2. `02-todo-fullstack-jwt-mysql` — JWT, refresh token, RBAC, MySQL
3. `03-todo-fullstack-jwt-postgres` — PostgreSQL variant
4. `04-todo-fullstack-production` — production-oriented monolith hardening
5. `05-todo-fullstack-redis-production` — Redis caching, distributed locking/rate limiting
6. `06-todo-fullstack-observability` — integration testing and observability
7. `07-todo-fullstack-microservices` — Eureka, Gateway, LoadBalancer, Resilience4j, service split
8. `08-todo-fullstack-kafka-k8s` — Kafka events and Kubernetes deployment
9. `09-todo-fullstack-kafka-reliability` — Outbox, idempotent consumer, retry and DLT

The projects are intentionally kept as separate snapshots so each step can be studied independently.

## Common stack

- Java / Spring Boot
- Spring Data JPA
- Spring Security / JWT
- React + Vite
- Axios + TanStack Query
- Docker / Docker Compose
- MySQL or PostgreSQL depending on the snapshot

## Final architecture progression

```text
Monolith
  -> Authentication + RBAC
  -> Production hardening
  -> Redis
  -> Observability + integration tests
  -> Microservices
  -> Kafka + Kubernetes
  -> Outbox + Idempotency + Retry + DLT
```

Each project README contains its focus and a **What changed from previous version** section.
