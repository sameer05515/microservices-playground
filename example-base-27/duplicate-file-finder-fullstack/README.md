# Duplicate File Finder — Spring Boot + React

A full-stack duplicate-file finder.

## Architecture

```text
React + Vite + Material UI
          |
          | POST /api/duplicates/scan
          v
Spring Boot REST API
          |
          v
File system -> size grouping -> SHA-256 -> duplicate groups
```

## Backend

Requirements:
- Java 17+
- Maven 3.9+

Run:

```bash
cd backend
mvn spring-boot:run
```

API:

```http
POST http://localhost:8080/api/duplicates/scan
Content-Type: application/json

{
  "rootPath": "C:\Users\Prem\Downloads"
}
```

Linux example:

```json
{
  "rootPath": "/home/prem/Downloads"
}
```

## Frontend

Requirements:
- Node.js 20+

Run:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Algorithm

The implementation is more efficient than hashing every file:

1. Walk the directory tree.
2. Group regular files by size.
3. Ignore sizes that occur only once.
4. SHA-256 hash only files sharing a size.
5. Group equal `size + SHA-256`.
6. Return groups containing at least two files.

`wastedBytes = fileSize * (duplicateCount - 1)`

## REST response

Example:

```json
{
  "rootPath": "C:\\data",
  "duplicateGroups": 2,
  "duplicateFiles": 5,
  "wastedBytes": 10485760,
  "scanDurationMs": 143,
  "groups": [
    {
      "groupNumber": 1,
      "fileSize": 5242880,
      "sha256": "....",
      "wastedBytes": 5242880,
      "files": [
        {
          "path": "C:\\data\\a.txt",
          "fileName": "a.txt",
          "size": 5242880,
          "lastModified": "2026-09-19T06:00:00Z"
        }
      ]
    }
  ]
}
```

## Notes

The API intentionally does not delete files. This version is read-only and is suitable as a foundation for later adding:
- progress reporting
- async scan jobs
- cancellation
- pagination
- sorting/filtering
- file preview
- delete/move selected duplicates
- WebSocket/SSE progress
- exclusion rules
- configurable hash algorithms
- authentication/authorization
