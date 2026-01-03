# Todo Fullstack — Spring Boot + MySQL + JWT + Refresh Token + RBAC + React + TanStack Query

## Backend
Java 17 / Spring Boot / JPA / MySQL / Spring Security / JWT / Refresh Token / JPA Specifications.

### Run MySQL
```bash
cd backend
docker compose up -d
```

Or configure `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.

### Run API
```bash
mvn spring-boot:run
```

Default users:
- `demo / password` → USER
- `admin / admin123` → ADMIN

Access token: 15 minutes.
Refresh token: 7 days and rotated on refresh.

## API
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/refresh?token=...`
- POST `/api/auth/logout?token=...`
- GET `/api/todos?page=0&size=5&search=java&completed=false&sort=title`
- POST `/api/todos`
- PUT `/api/todos/{id}`
- PATCH `/api/todos/{id}/complete`
- DELETE `/api/todos/{id}`
- GET `/api/admin/users` (ADMIN)

## Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Learning additions in this version
1. MySQL instead of PostgreSQL
2. JWT access token
3. Refresh token rotation + revocation
4. USER / ADMIN RBAC
5. JPA Specifications for search/filter
6. Pagination + sorting
7. Optimistic locking with `@Version`
8. Global API error model
9. TanStack Query cache invalidation
10. Axios 401 → refresh → retry flow
11. Docker Compose for MySQL

### Production notes
For a real production system, store a hash of refresh tokens rather than raw tokens, use secure HttpOnly/SameSite cookie strategy where appropriate, add rate limiting, audit logging, secret management, migrations (Flyway/Liquibase), tests/Testcontainers, and observability.
