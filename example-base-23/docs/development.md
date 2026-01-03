# Development guide

This guide explains how to run **example-base-23** on your machine: dependencies, ports, configuration, and where todo data is stored.

For a **step-by-step “run and open in the browser”** checklist (including Kubernetes), see **[run-and-access.md](run-and-access.md)**.

## Prerequisites

Install **Node.js** (version **20 or newer** is sufficient; the Dockerfiles use Node **22**). Verify:

```bash
node --version
npm --version
```

## Install dependencies

Each package has its own `package.json`. Install from the **`backend`** and **`frontend`** directories:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Run locally (two processes)

The backend and frontend are separate processes during development.

### Backend (Express)

From **`backend/`**:

```bash
npm start
```

This starts the HTTP server on port **3401** (unless overridden by **`PORT`**).

Health check:

```bash
curl -s http://localhost:3401/health
```

Expected JSON: `{ "ok": true }`.

### Frontend (Vite)

From **`frontend/`**:

```bash
npm run dev
```

The dev server listens on port **3402** (configured in `vite.config.ts`). Open:

**http://localhost:3402**

### Access checklist (local)

| Step | Action |
|------|--------|
| 1 | Backend running: **`npm start`** in **`backend/`** (port **3401**) |
| 2 | Frontend running: **`npm run dev`** in **`frontend/`** (port **3402**) |
| 3 | Browser URL: **http://localhost:3402** |
| 4 | API is reached via **`/api/...`** on the same host (Vite proxy); do not open **3401** in the browser for normal use |

### Why two ports?

- **3402** serves the React application and the Vite development features (hot reload).
- **3401** serves the REST API.

The frontend uses relative URLs such as **`/api/todos`**. Vite’s **`server.proxy`** forwards any request whose path begins with **`/api`** to **`http://localhost:3401`**. That avoids browser CORS issues during development and avoids hard-coding an API origin in the React code.

## Environment variables (backend)

| Variable | Purpose | Default |
|----------|---------|---------|
| **`PORT`** | TCP port for the HTTP server | **`3401`** |
| **`TODO_FILE`** | Absolute or relative path to the JSON store file | **`backend/todo.json`** next to `server.js` when unset |

Examples:

```bash
# Custom port (Unix-style shells)
PORT=3500 npm start

# Custom data file location
TODO_FILE=/tmp/my-todos.json npm start
```

On Windows PowerShell:

```powershell
$env:PORT = "3500"; npm start
```

```powershell
$env:TODO_FILE = "D:\data\todo.json"; npm start
```

## Data file format (`todo.json`)

The backend persists a single JSON document with this shape:

```json
{
  "todos": [
    {
      "id": "uuid-string",
      "title": "Buy milk",
      "done": false
    }
  ]
}
```

- **`id`**: Generated with **`crypto.randomUUID()`** when a todo is created.
- **`title`**: Non-empty string after trimming whitespace.
- **`done`**: Boolean.

If the file is missing, the API behaves as if **`todos`** is an empty array and will create the file on first write. If the JSON is malformed or **`todos`** is not an array, the reader normalizes to an empty list where appropriate.

## Production build (frontend only)

To produce static assets under **`frontend/dist/`**:

```bash
cd frontend
npm run build
```

Preview the production bundle locally:

```bash
npm run preview
```

For container images, the frontend Dockerfile builds these assets and serves them with **nginx** (see [Kubernetes guide](kubernetes.md)).

## Troubleshooting

### Empty list or errors in the UI

1. Confirm the backend is running on **3401** (`curl http://localhost:3401/health`).
2. Confirm the frontend dev server is on **3402** and that **`vite.config.ts`** still proxies **`/api`** to **`http://localhost:3401`**.
3. Check the browser developer tools **Network** tab for failed **`/api/...`** requests.

### Port already in use

Change **`PORT`** for the backend or adjust **`server.port`** / proxy target in **`vite.config.ts`** consistently.

### Permission errors writing `todo.json`

Ensure the process can write to **`TODO_FILE`**’s directory. The backend creates the parent directory when saving if needed (`fs.mkdir` with **`recursive: true`**).
