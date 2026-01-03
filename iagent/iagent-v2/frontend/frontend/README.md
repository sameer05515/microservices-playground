# iAgent Frontend V2

React + Vite frontend for the iAgent V2 Spring Boot backend.

## Features

- Upload JAR
- Upload progress
- Duplicate JAR error handling
- Uploaded JARs page
- Click JAR to load public classes
- Click class to load public methods
- Responsive three-panel browser

## Backend

```text
http://localhost:8080
```

Override with `VITE_API_BASE_URL` if required.

## APIs Used

```text
POST /api/jars
GET  /api/jars
GET  /api/jars/{jarId}/classes
GET  /api/jars/{jarId}/methods?className={className}
```

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## UI Flow

```text
Upload JAR
    |
    v
Uploaded JARs
    |
    v
Click JAR
    |
    v
Public Classes
    |
    v
Click Class
    |
    v
Public Methods
```

If a JAR with the same original file name already exists, the backend returns HTTP `409 Conflict` and the UI displays the message.
