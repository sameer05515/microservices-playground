# Duplicate File Finder v4 — Production-Oriented

## Highlights

- Spring Boot REST API
- Persistent scan-job metadata with JPA + H2
- Bounded async executor
- SSE real-time progress
- Cooperative cancellation
- Size-first + SHA-256 duplicate detection
- Configurable ignored folders
- Server-side pagination and sorting
- Selected-file delete/move
- Collision-safe moves
- Folder browser
- Actuator health/metrics
- Validation and global error handling
- React + Vite + Material UI

## Run

Backend:

```bash
cd backend
mvn clean test
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080
Health:   http://localhost:8080/actuator/health
```

## API

```http
POST /api/duplicates/scan
Content-Type: application/json

{
  "rootPath": "C:\\Projects",
  "ignoredFolders": [".git", "node_modules", ".idea", "target", "build"]
}
```

```http
GET /api/duplicates/scan/{jobId}
GET /api/duplicates/scan/{jobId}/events
POST /api/duplicates/scan/{jobId}/cancel
GET /api/duplicates/scan/{jobId}/groups?page=0&size=10&sortBy=wastedBytes&direction=desc
```

File operations:

```http
GET /api/files/browse?path=C:\\Projects
DELETE /api/files
POST /api/files/move
```

## Production architecture

```text
React/Vite
   |
 REST + SSE
   |
Spring Boot
   +-- bounded scan executor
   +-- JPA/H2 scan metadata
   +-- in-memory duplicate result store
   +-- local filesystem
   +-- Actuator
```

## Security hardening before public deployment

This sample is production-oriented, not an internet-facing file-management service. Before exposing it to untrusted users:

- add authentication + RBAC
- restrict scans and file operations to an allow-listed filesystem root
- add audit logging
- use HTTPS
- add rate limiting
- run with least-privilege OS permissions
- persist scan results in PostgreSQL/Redis for multi-instance deployment
- use a distributed job queue for large workloads
- add explicit approval/confirmation workflows for destructive operations

H2 persists job lifecycle metadata locally. Detailed duplicate groups remain in memory in v4 to keep the project compact.
