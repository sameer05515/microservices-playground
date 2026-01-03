# Todo Full Stack v2

Features: Spring Boot REST API, PostgreSQL, JWT authentication, BCrypt, user-owned Todos, pagination, title search, active/completed filtering, React/Vite, Axios and TanStack Query.

## Start PostgreSQL
```bash
docker compose up -d
```
Or configure `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.

## Backend
```bash
cd backend
mvn clean spring-boot:run
```

## Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

Demo: `demo / password`

## APIs
`POST /api/auth/register`
`POST /api/auth/login`
`GET /api/todos?page=0&size=5&search=spring&completed=false`
`GET /api/todos/{id}`
`POST /api/todos`
`PUT /api/todos/{id}`
`PATCH /api/todos/{id}/complete`
`DELETE /api/todos/{id}`

Todo endpoints require `Authorization: Bearer <JWT>`.
