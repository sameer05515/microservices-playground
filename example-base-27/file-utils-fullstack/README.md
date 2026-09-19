# File Utils Full Stack

React + Vite frontend and Spring Boot backend for common file/folder utilities.

## Services

- Zip
- Unzip
- Copy
- Move
- Delete
- Find
- FileCounter
- EmptyFolderFinder
- DuplicateFileFinder
- List directory
- Create directory

## Architecture

```text
React + Vite
    |
    | REST / JSON
    v
Spring Boot
    |
    v
Java NIO Files API
```

## Requirements

- Java 17+
- Maven 3.8+
- Node.js 18+
- npm 9+

## Backend

```bash
cd backend
mvn spring-boot:run
```

Default port:

```text
http://localhost:8080
```

The backend operates inside a configurable root directory.

Default:

```text
./workspace
```

You can configure it:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--file-utils.root=C:/file-utils-workspace"
```

Or edit:

```text
backend/src/main/resources/application.properties
```

### API

```text
GET    /api/files/list
POST   /api/files/directory
POST   /api/files/copy
POST   /api/files/move
DELETE /api/files
POST   /api/files/zip
POST   /api/files/unzip
GET    /api/files/find
GET    /api/files/count
GET    /api/files/empty-folders
GET    /api/files/duplicates
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

The Vite development server proxies `/api` requests to Spring Boot.

## Example workflow

Create:

```text
workspace/
├── documents/
│   ├── a.txt
│   ├── b.txt
│   └── reports/
│       └── report.txt
└── backup/
```

Use the UI to:

1. Browse directories.
2. Create directories.
3. Copy or move files/folders.
4. Delete files/folders.
5. Zip a folder.
6. Unzip an archive.
7. Find files by name.
8. Count files/folders.
9. Find empty folders.
10. Find duplicate files by SHA-256.

## Security

The backend resolves all user supplied paths against the configured root directory.

Paths that escape the root directory are rejected.

For example:

```text
../../secret.txt
```

is rejected.

This application is intended as a local-development / learning project. If exposed outside localhost, add authentication, authorization, rate limiting, audit logging and stronger operational controls.
