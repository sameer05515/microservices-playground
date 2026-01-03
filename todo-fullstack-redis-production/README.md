# Todo Fullstack — Production Learning Version

Spring Boot + MySQL + JWT/Refresh Token + RBAC + JPA Specifications + React/Vite + TanStack Query.

## Incremental production improvements
- MySQL 8.4 + Flyway migrations; Hibernate `ddl-auto=validate`
- JWT access token + refresh-token rotation/revocation + scheduled cleanup
- BCrypt + USER/ADMIN RBAC + method security
- Pagination, sorting, search/filter with JPA Specifications
- Optimistic locking with `@Version`
- Consistent validation/API errors
- OpenAPI/Swagger UI
- Actuator health/info/metrics
- Basic in-memory rate limiting (learning implementation; use Redis at scale)
- Dockerfile + Docker Compose
- GitHub Actions Maven CI
- React/TanStack Query + Axios refresh/retry + debounced search

## Run locally
```bash
cd backend
docker compose up -d
mvn spring-boot:run
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Demo: `demo/password` (USER), `admin/admin123` (ADMIN).

Swagger: http://localhost:8080/swagger-ui.html
Health: http://localhost:8080/actuator/health

## Next production layers
Redis cache → distributed rate limiting/locking → hashed refresh tokens + secure cookie strategy → structured logging/correlation ID → Testcontainers integration tests → Micrometer/Prometheus/Grafana → Kafka → API Gateway/Eureka/Resilience4j → Kubernetes/AWS.

This is a production-oriented learning project, not a claim that every production hardening measure is complete.
