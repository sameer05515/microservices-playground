# Duplicate File Finder v3

Full-stack duplicate-file management application.

## New in v2

- Async scan jobs
- Real-time polling progress bar
- Scan cancellation
- Duplicate-group pagination
- Sorting by file size / wasted space
- Select individual duplicate files
- Delete selected files
- Move selected files to another directory
- Folder browser
- Collision-safe file moving: `file (1).ext`, `file (2).ext`, etc.
- Size-first filtering before SHA-256 hashing
- CORS and error handling
- Configurable ignored folders
- Default ignored folders: `.git`, `node_modules`, `.idea`
- Ignore matching is case-insensitive
- Ignored directories are skipped with `SKIP_SUBTREE`, so their contents are never scanned

## Backend

```bash
cd backend
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8080
```

### Scan

```http
POST /api/duplicates/scan
Content-Type: application/json

{"rootPath":"C:\Users\Prem\Downloads"}
```

Response:

```json
{"jobId":"..."}
```

Poll:

```http
GET /api/duplicates/scan/{jobId}
```

Cancel:

```http
POST /api/duplicates/scan/{jobId}/cancel
```

### Folder browser

```http
GET /api/folders?path=C:\Users\Prem\Downloads
```

### Delete

```http
DELETE /api/files
Content-Type: application/json

{
  "rootPath": "C:\Users\Prem\Downloads",
  "paths": [
    "C:\Users\Prem\Downloads\copy.txt"
  ]
}
```

### Move

```http
POST /api/files/move?paths=C:\data\copy.txt&paths=C:\data\copy2.txt
Content-Type: application/json

{"targetDirectory":"C:\data\duplicates"}
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Important implementation note

The scan is asynchronous. The browser starts a job and polls its status approximately every 700 ms. Cancellation is cooperative: directory walking and hashing check the cancellation flag/interruption between files.

For a larger production system, the next evolution should persist scan jobs/results (Redis/DB), use SSE/WebSocket instead of polling, add authentication/RBAC, server-side pagination, audit logging, and stronger path authorization before enabling destructive file operations.


## Ignored folder configuration

The frontend provides an **Ignored folders** control.

Default values:

```text
.git
node_modules
.idea
```

You can add multiple names:

```text
target, build, dist, .next
```

The backend compares directory names case-insensitively. For example, adding:

```text
node_modules
```

will skip:

```text
project/node_modules
project/frontend/node_modules
project/another/node_modules
```

The directory is skipped during `preVisitDirectory`, so the scanner does not traverse files below that directory.

Example REST request:

```http
POST /api/duplicates/scan
Content-Type: application/json

{
  "rootPath": "C:\Projects",
  "ignoredFolders": [
    ".git",
    "node_modules",
    ".idea",
    "target",
    "build"
  ]
}
```

This is **name-based ignoring**, not absolute-path ignoring. If you need to ignore only specific paths while still scanning another folder with the same name, the next version can support both folder-name patterns and exact paths.
