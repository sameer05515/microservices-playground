# 04 — Todo Fullstack Production

## Focus
Production-oriented monolith hardening before introducing distributed infrastructure.

### Added / hardened
- MySQL 8.4 + Flyway migrations
- Hibernate `ddl-auto=validate`
- JWT access token + refresh-token rotation/revocation
- BCrypt + USER/ADMIN method security
- Pagination, sorting, search/filter with JPA Specifications
- Optimistic locking with `@Version`
- Consistent validation and API errors
- OpenAPI / Swagger UI
- Actuator health/info/metrics
- Dockerfile + Docker Compose
- GitHub Actions Maven CI
- React/TanStack Query + Axios refresh/retry + debounced search

## What changed from previous version
- Converted the authenticated application into a more production-oriented monolith.
- Added Flyway-managed database migrations.
- Added optimistic locking to protect concurrent updates.
- Added standardized API error handling and validation.
- Added OpenAPI, Actuator, containerization and CI.
- Added safer refresh-token lifecycle handling and cleanup.
