# 03 — Todo Fullstack JWT + PostgreSQL

## Focus
PostgreSQL version of the authenticated Todo application.

### Stack
- Spring Boot
- Spring Security + JWT / refresh token
- Spring Data JPA
- PostgreSQL
- React + Vite
- TanStack Query

## What changed from previous version
- Database layer is changed from **MySQL to PostgreSQL**.
- The authentication, RBAC and Todo API concepts from version 02 are retained.
- This snapshot is useful for comparing datasource configuration, SQL behavior and PostgreSQL-specific operational considerations.

## Run
Check the backend `application.properties` / `application.yml` and Docker configuration in this project for the configured PostgreSQL connection, then run the backend and frontend as in version 02.
