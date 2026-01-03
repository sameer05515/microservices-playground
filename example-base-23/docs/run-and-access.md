# Run and access the application

This guide walks through **starting** the stack and **opening the UI** in the browser for both **local development** (Node + Vite) and **Kubernetes**. The React app talks to the API using relative paths under **`/api`**, so you normally use **one base URL** for both the page and API calls.

| Environment | Typical application URL |
|---------------|-------------------------|
| Local dev (Vite) | **http://localhost:3402** |
| Kubernetes (NodePort) | `http://<node-ip>:30402` (replace with your node’s address) |
| Kubernetes (port-forward) | **http://localhost:3402** |

---

## Part 1: Local development (no Docker / no Kubernetes)

### 1. Prerequisites

- **Node.js** 20+ and **npm**
- Two terminal windows (or tabs), both with working directory **`example-base-23`**

### 2. Install dependencies (once per clone)

```bash
cd backend
npm install

cd ../frontend
npm install
```

On Windows PowerShell you can run the same commands; use **`cd`** paths that match your machine (for example **`D:\GIT\microservices-playground\example-base-23\backend`**).

### 3. Start the backend (terminal 1)

```bash
cd backend
npm start
```

- Listens on **http://localhost:3401**
- Writes data to **`backend/todo.json`** by default

**Sanity check** (optional, second shell):

```bash
curl -s http://localhost:3401/health
```

Expect: `{"ok":true}`

### 4. Start the frontend (terminal 2)

```bash
cd frontend
npm run dev
```

- Vite dev server listens on **http://localhost:3402**
- **`vite.config.ts`** proxies **`/api`** → **http://localhost:3401**

### 5. Access the application

Open a browser to:

**http://localhost:3402**

Use the todo UI (add, toggle, delete). Requests from the page go to **`http://localhost:3402/api/...`**, and Vite forwards them to the API on port **3401**.

### 6. If the page loads but todos fail

- Confirm the backend is still running and **`curl http://localhost:3401/health`** works
- In the browser **Network** tab, look for failed **`/api/...`** requests
- See **[development.md](development.md)** for ports, **`PORT`**, **`TODO_FILE`**, and troubleshooting

---

## Part 2: Kubernetes

You need a running cluster, **`kubectl`** pointed at it, and container images that match the Deployments (**`example-base-23/todo-backend:latest`** and **`example-base-23/todo-frontend:latest`**). Image build/load details are in **[kubernetes.md](kubernetes.md)**.

### 1. Confirm the cluster and context

```bash
kubectl cluster-info
kubectl get nodes
```

If this errors (connection refused), start your cluster (for example **Docker Desktop → Kubernetes**, or **`minikube start`**) and fix **`kubectl`** context before continuing.

### 2. Build images and make them visible to the cluster

- **Docker Desktop Kubernetes:** build with the same Docker Desktop engine; images often appear to the cluster automatically:

  ```bash
  cd example-base-23
  docker build -t example-base-23/todo-backend:latest ./backend
  docker build -t example-base-23/todo-frontend:latest ./frontend
  ```

- **Minikube:** build **inside Minikube’s Docker** so images exist on the node:

  ```powershell
  minikube start
  minikube docker-env --shell powershell | Invoke-Expression
  cd D:\GIT\microservices-playground\example-base-23
  docker build -t example-base-23/todo-backend:latest ./backend
  docker build -t example-base-23/todo-frontend:latest ./frontend
  ```

If pods show **ImagePullBackOff**, the cluster cannot see those tags—fix image availability first (see **[kubernetes.md](kubernetes.md)** troubleshooting).

### 3. Deploy manifests

From **`example-base-23`**:

```bash
kubectl apply -f k8s
```

Wait until workloads are ready:

```bash
kubectl rollout status deployment/todo-backend
kubectl rollout status deployment/todo-frontend
kubectl get pods
```

Both Pods should eventually show **READY `1/1`** and **STATUS `Running`**.

### 4. Access the application — Option A: NodePort

The **frontend** `Service` is **NodePort** **`30402`** (maps to container port **3402**).

**URL pattern:**

```text
http://<node-ip>:30402
```

**Minikube**

```bash
minikube ip
```

Open **`http://<printed-ip>:30402`** in the browser (for example **`http://192.168.49.2:30402`**).

**Docker Desktop Kubernetes**

Try:

- **http://localhost:30402**
- **http://127.0.0.1:30402**

**Other clusters**

Use any node IP that routes to the cluster NodePort firewall rules allowing **30402/tcp**.

### 5. Access the application — Option B: `kubectl port-forward`

Use this when NodePort is blocked, inconvenient, or you prefer **localhost**.

**Bash / zsh:**

```bash
kubectl port-forward service/todo-frontend 3402:3402
```

**Windows PowerShell:**

```powershell
kubectl port-forward service/todo-frontend 3402:3402
```

Leave the command running. In the browser open:

**http://localhost:3402**

This forwards your machine’s **3402** to the **todo-frontend** Service port **3402** inside the cluster.

### 6. How API calls work in the browser (Kubernetes)

The frontend pod runs **nginx** on port **3402**. It serves the React build and proxies **`/api`** to the **`todo-backend`** Service (**ClusterIP**, port **3401**). You do **not** need a second browser URL for the API: call **`/api/todos`** on the **same** origin you used to load the UI.

### 7. Optional: reach only the backend (debugging)

The backend Service is **ClusterIP** only (not exposed by default). To hit the API from your host:

```bash
kubectl port-forward service/todo-backend 3401:3401
```

Then:

```bash
curl -s http://localhost:3401/health
curl -s http://localhost:3401/api/todos
```

---

## Quick reference

| What | Port / value |
|------|----------------|
| Backend (local Node) | **3401** |
| Frontend dev server (Vite) | **3402** |
| Frontend Service (cluster) | **3402** (target) |
| NodePort on host | **30402** |
| Port-forward UI to localhost | **`kubectl port-forward service/todo-frontend 3402:3402`** → **http://localhost:3402** |

For REST details (paths, bodies, curl), see **[api.md](api.md)**.
