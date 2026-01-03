# example-base-05 — Docker Compose micro-demo

Two small **Express** services orchestrated with **Docker Compose**: a JSON **API** (`backend-app`) and an **EJS** UI (`backend-ejs-app`) that proxies topic/book lists from the API.

---

## What’s in the repo

| Path | Role |
|------|------|
| `backend-app/` | REST API on **3001** — JSON only |
| `backend-ejs-app/` | Server-rendered **EJS** page + JSON routes on **3002** that call the API |
| `docker-compose.yml` | Builds both images, shared **bridge** network, port mappings |

---

## Architecture

```
Host browser
     │
     ├─► http://localhost:3002  →  backend-ejs-app (Express + EJS)
     │         │  GET /topics, /books  ──axios──►  BACKEND_URL (see below)
     │
     └─► http://localhost:3001  →  backend-app (Express JSON API)
```

- **Docker:** `BACKEND_URL` is set to `http://backend-app:3001` so the EJS service reaches the API by **Compose service name** (not `localhost`, which would point at the wrong container).
- **Local (no Docker):** Run both apps on the host; default `BACKEND_URL` falls back to `http://localhost:3001`.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) + [Docker Compose](https://docs.docker.com/compose/) (Compose V2: `docker compose`)

---

## Run with Docker Compose

From this directory:

```bash
docker compose up --build
```

Then open:

- **UI:** http://localhost:3002  
- **API:** http://localhost:3001  

Stop: `Ctrl+C` or `docker compose down`.

---

## API (`backend-app` — port 3001)

| Method | Path | Response |
|--------|------|----------|
| GET | `/` | `{ "message": "success" }` |
| GET | `/topics` | JSON array of Java topic names |
| GET | `/books` | JSON array of Java book titles |

---

## EJS app (`backend-ejs-app` — port 3002)

| Method | Path | Behavior |
|--------|------|----------|
| GET | `/` | Renders `views/index.ejs` (buttons that `fetch` JSON from this same origin) |
| GET | `/success` | Proxies to API `GET /` → `{ "message": "success" }` |
| GET | `/topics` | Proxies to API → returns same array as API `/topics` |
| GET | `/books` | Proxies to API → returns same array as API `/books` |

---

## Run without Docker (optional)

**Terminal 1 — API**

```bash
cd backend-app
npm install
node server.js
```

**Terminal 2 — EJS app**

```bash
cd backend-ejs-app
npm install
node server.js
```

Ensure nothing else uses ports **3001** and **3002**.

---

## Environment variables

| Variable | Where | Default | Purpose |
|----------|--------|---------|---------|
| `BACKEND_URL` | `backend-ejs-app` | `http://localhost:3001` | Base URL for axios calls to the JSON API |

Compose sets `BACKEND_URL=http://backend-app:3001` for container-to-container calls.

---

## Maintenance notes (review)

- **Node base image:** Dockerfiles use `node:14` (EOL). Consider upgrading to `node:20` or `node:22` LTS when you next touch builds.
- **`package.json`:** Each app has `"start": "node server.js"`.
- **Depends on:** `depends_on` does not wait for the API to be “ready” — only for the container to start. For a demo this is usually enough; for production you’d add retries or a healthcheck.

---

## License

ISC (see each app’s `package.json`).
