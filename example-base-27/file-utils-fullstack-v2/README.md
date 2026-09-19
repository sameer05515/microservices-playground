# File Utils Full Stack V2

React + Vite + Material UI frontend and Spring Boot backend for file/folder operations.

## V2 Features

- Upload files
- Multi-file upload
- Drag & drop upload
- Upload progress bar
- Download files
- File preview
  - Text
  - Images
  - PDF/browser-supported files
- Zip
- Unzip
- Copy
- Move
- Delete
- Find
- File counter
- Empty folder finder
- Duplicate finder using SHA-256
- Server-side pagination
- Server-side sorting
- Async ZIP / UNZIP jobs
- Job status polling
- Progress reporting for async archive operations
- Material UI dashboard
- Path traversal protection
- ZIP Slip protection
- JUnit tests

## Run Backend

```bash
cd backend
mvn clean test
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

Default workspace:

```text
./workspace
```

Change it with:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--file-utils.root=C:/file-utils-workspace"
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Vite proxies `/api` to Spring Boot.

## V2 API

```text
GET    /api/files/list
POST   /api/files/directory
POST   /api/files/upload
GET    /api/files/download
GET    /api/files/preview
POST   /api/files/copy
POST   /api/files/move
DELETE /api/files
POST   /api/files/zip
POST   /api/files/unzip
GET    /api/files/jobs/{jobId}
GET    /api/files/find
GET    /api/files/count
GET    /api/files/empty-folders
GET    /api/files/duplicates
```

## Async ZIP / UNZIP

ZIP and UNZIP operations are submitted as jobs.

Example:

```http
POST /api/files/zip
Content-Type: application/json

{
  "source": "documents",
  "destination": "documents.zip"
}
```

Response:

```json
{
  "jobId": "..."
}
```

Poll:

```http
GET /api/files/jobs/{jobId}
```

Example:

```json
{
  "jobId": "...",
  "type": "ZIP",
  "status": "RUNNING",
  "processed": 12,
  "total": 20,
  "progress": 60,
  "message": "Zipping files"
}
```

## Upload

The frontend uses `XMLHttpRequest` so upload progress can be displayed.

Uploaded files are placed under the selected workspace directory.

## Security

All paths are resolved against the configured root directory.

Path traversal such as:

```text
../../secret.txt
```

is rejected.

ZIP extraction validates every ZIP entry before writing it.

## Note

This project is intended for local development / learning. If exposed to a network, add authentication, authorization, rate limiting, audit logging, quotas and production-grade storage controls.
