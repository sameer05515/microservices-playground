# iAgent Frontend V1

React + Vite frontend for the iAgent Spring Boot V1 backend.

## Backend expected

```text
http://localhost:8080
```

The frontend uses:

```text
POST /api/jars
GET  /api/jars/{jarId}/classes
GET  /api/jars/{jarId}/methods?className={className}
```

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Workflow

1. Select a `.jar` file.
2. Upload it.
3. Backend returns `jarId`.
4. Frontend loads public classes.
5. Select a class.
6. Frontend loads public methods.
