# 06 — Todo Fullstack Observability

## Focus
Make the application testable and observable.

### Added
- Testcontainers MySQL and Redis
- Spring Boot integration tests with `@SpringBootTest`
- MockMvc API tests
- Flyway execution against real database containers
- Structured JSON logging
- Correlation ID and Request ID
- Actuator + Micrometer Prometheus metrics
- Redis cache hit/miss and lock-contention metrics
- Prometheus + Grafana support

## What changed from previous version
- Added real infrastructure integration tests instead of relying only on mocks/local services.
- Added structured logs that carry correlation/request identifiers.
- Added application and JVM metrics for monitoring.
- Added Prometheus/Grafana integration for operational visibility.

## Run tests
```bash
cd backend
mvn test
```
Docker must be available because Testcontainers starts real containers.
