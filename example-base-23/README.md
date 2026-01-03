# example-base-23: Todo app (Node + React/Vite + Kubernetes)

This example is a small full-stack todo application: a **Node.js (Express) REST API** on port **3401**, a **React + Vite** single-page app on port **3402**, and **JSON file persistence** (`todo.json`). It includes **Kubernetes** manifests so you can run the same stack in-cluster with persistent storage for the data file.

## Documentation

An index of all guides: **[docs/README.md](docs/README.md)**.

| Document | Contents |
|----------|----------|
| **[Run and access](docs/run-and-access.md)** | **Step-by-step: run locally or on Kubernetes, URLs, NodePort, port-forward** |
| [Development guide](docs/development.md) | Local setup, ports, environment variables, how data is stored |
| [REST API reference](docs/api.md) | Endpoints, request and response shapes, examples |
| [Kubernetes guide](docs/kubernetes.md) | Building images, applying manifests, networking, storage, operations |

## Repository layout

```
example-base-23/
├── backend/           # Express API, writes todo.json
├── frontend/          # React + Vite UI; dev server proxies /api to the backend
├── k8s/               # PVC, backend deployment/service, frontend deployment/service
├── docs/              # Includes run-and-access.md, development, api, kubernetes; see docs/README.md
└── README.md          # This file
```

## Prerequisites

- **Node.js** 20+ (24+ used in Docker images) for local development
- **npm** for installing dependencies
- For Kubernetes: **kubectl**, a cluster (for example minikube, kind, or a managed cluster), and **Docker** (or equivalent) for building images

## Run and access the application

Full walkthroughs (commands, URLs, NodePort **30402**, **`kubectl port-forward`**, troubleshooting) are in **[docs/run-and-access.md](docs/run-and-access.md)**.

**Local (summary):** In one terminal, `cd backend && npm install && npm start` (port **3401**). In another, `cd frontend && npm install && npm run dev` (port **3402**). Open **http://localhost:3402**. Data file: **`backend/todo.json`**.

**Kubernetes (summary):** Build **`example-base-23/todo-backend:latest`** and **`example-base-23/todo-frontend:latest`** where your cluster can use them; **`kubectl apply -f k8s`**. Open the UI via NodePort **`http://<node-ip>:30402`**, or run **`kubectl port-forward service/todo-frontend 3402:3402`** and open **`http://localhost:3402`**. Details: **[Kubernetes guide](docs/kubernetes.md)** and **[run-and-access](docs/run-and-access.md)**.

## Architecture (high level)

- **Browser → frontend**: Static assets and (in-cluster) nginx on port 3402.
- **Browser → API**: During local dev, `/api/*` is proxied by Vite to Express. In Kubernetes, nginx in the frontend pod proxies `/api` to the **`todo-backend`** Service at port 3401.
- **API → disk**: JSON document `{ "todos": [...] }`; path configurable via **`TODO_FILE`** (see [Development guide](docs/development.md)).

---

For endpoint details and curl examples, use **[REST API reference](docs/api.md)**.
