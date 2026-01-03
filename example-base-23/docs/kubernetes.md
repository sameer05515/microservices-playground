# Kubernetes guide

This guide describes how to deploy **example-base-23** using the manifests in **`k8s/`**: container images, networking, persistent storage for **`todo.json`**, and day-to-day operations.

## What the manifests create

Applied in order (file name prefix **`01`** → **`03`**):

| File | Resources |
|------|-----------|
| **`01-pvc.yaml`** | **`PersistentVolumeClaim`** `todo-data` (100 Mi, **ReadWriteOnce**) |
| **`02-backend.yaml`** | **`Deployment`** `todo-backend`, **`Service`** `todo-backend` (**ClusterIP**, port **3401**) |
| **`03-frontend.yaml`** | **`Deployment`** `todo-frontend`, **`Service`** `todo-frontend` (**NodePort**, port **3402** → node port **30402**) |

The backend mounts the PVC at **`/data`** and sets **`TODO_FILE=/data/todo.json`**, so todos survive pod restarts as long as the PVC is retained.

The frontend container runs **nginx** on port **3402**. It serves the built React app and **reverse-proxies** paths starting with **`/api`** to the Kubernetes Service **`todo-backend`** on port **3401**. The browser therefore uses a **single origin** (the frontend URL) for both UI and API; no build-time API URL is required for in-cluster behavior.

## Prerequisites

- A working cluster and **`kubectl`** configured to talk to it
- **Docker** (or a compatible builder) to build images
- For **minikube** or **kind**, use the cluster’s instructions so **NodePort** services are reachable from your host

## Build container images

Image names and tags must match what the Deployments reference:

- **`example-base-23/todo-backend:latest`**
- **`example-base-23/todo-frontend:latest`**

From the **`example-base-23`** directory:

```bash
docker build -t example-base-23/todo-backend:latest ./backend
docker build -t example-base-23/todo-frontend:latest ./frontend
```

### Loading images into the cluster

Clusters do not automatically see images built on your host.

- **minikube**: build inside minikube’s Docker daemon, or load the image after building:

  ```bash
  minikube image load example-base-23/todo-backend:latest
  minikube image load example-base-23/todo-frontend:latest
  ```

  Alternatively:

  ```bash
  eval $(minikube docker-env)
  docker build -t example-base-23/todo-backend:latest ./backend
  docker build -t example-base-23/todo-frontend:latest ./frontend
  ```

- **kind**: **`kind load docker-image example-base-23/todo-backend:latest`** (and the same for the frontend image).

- **Remote registry**: push both images to your registry and change the **`image:`** fields in **`02-backend.yaml`** and **`03-frontend.yaml`** to match; set **`imagePullPolicy`** as appropriate (for example **`Always`**).

The manifests use **`imagePullPolicy: IfNotPresent`**, which suits local or single-node clusters once the image exists on the node.

## Apply manifests

From **`example-base-23`** (paths adjusted if your shell differs):

```bash
kubectl apply -f k8s/01-pvc.yaml
kubectl apply -f k8s/02-backend.yaml
kubectl apply -f k8s/03-frontend.yaml
```

Or apply the whole directory:

```bash
kubectl apply -f k8s
```

Wait until pods are ready:

```bash
kubectl rollout status deployment/todo-backend
kubectl rollout status deployment/todo-frontend
kubectl get pods
```

## Reach the application from outside the cluster

Step-by-step run, deploy, URLs, and verification are documented in **[run-and-access.md](run-and-access.md)**. Summary:

### NodePort (primary method for browser access)

The **frontend** **`Service`** is type **NodePort** with **`nodePort: 30402`** (Kubernetes forwards **host TCP 30402** → Service port **3402** → nginx in the pod).

Open:

```text
http://<node-ip>:30402
```

| Environment | How to get `<node-ip>` |
|-------------|-------------------------|
| **minikube** | Run **`minikube ip`**, then **`http://<that-ip>:30402`** |
| **Docker Desktop Kubernetes** | Often **`http://localhost:30402`** or **`http://127.0.0.1:30402`** |
| **kind / remote nodes** | Use the worker/node IP that exposes NodePorts, or port-forward below |

Confirm the Service:

```bash
kubectl get svc todo-frontend
```

Expect **`NODEPORT`** **30402** (and **`PORT(S)`** like **`3402:30402/TCP`**).

### Port-forward (alternative)

When NodePort is inconvenient or blocked, forward the frontend Service to your machine:

```bash
kubectl port-forward service/todo-frontend 3402:3402
```

**Windows PowerShell** (same command):

```powershell
kubectl port-forward service/todo-frontend 3402:3402
```

Keep the process running and open **http://localhost:3402**.

### Same origin for UI and API

The backend **`Service`** is **ClusterIP** only (no NodePort). In the browser, use **only** the frontend URL; paths **`/api/...`** are reverse-proxied by nginx to **`todo-backend:3401`**.

### Optional: reach the API from your host (debugging)

```bash
kubectl port-forward service/todo-backend 3401:3401
```

Then **http://localhost:3401/health** and **http://localhost:3401/api/todos** work from your machine.

## Networking details (in-cluster DNS)

- **Backend Service FQDN** (same namespace): **`todo-backend.default.svc.cluster.local`**
- Nginx resolves the short name **`todo-backend`** because the frontend pod runs in the same namespace.

The **`proxy_pass`** in **`frontend/nginx.conf`** targets **`http://todo-backend:3401`**. If you rename the Service, update nginx and rebuild the frontend image.

## Storage and data lifecycle

- The PVC **`todo-data`** is bound to a **PersistentVolume** provided by your cluster’s storage class (default class if none is specified).
- Only the **backend** pod should need write access; the file **`/data/todo.json`** holds the same JSON structure as local development (**`{ "todos": [...] }`**).

To inspect after exec’ing into the backend pod (pod name will differ):

```bash
kubectl exec -it deployment/todo-backend -- cat /data/todo.json
```

Deleting the **Deployment** does not delete the PVC; deleting the **PVC** removes the persistent volume claim (and typically the data associated with it—behavior depends on reclaim policy and provisioner).

## Probes

- **Backend**: HTTP **`GET /health`** on port **3401** for readiness and liveness.
- **Frontend**: HTTP **`GET /`** on port **3402** (nginx serves the SPA).

If the backend is slow to start, readiness failures may occur briefly until **`/health`** returns **200**.

## Remove the workload

To delete the application resources (adjust if you use namespaces):

```bash
kubectl delete -f k8s/03-frontend.yaml
kubectl delete -f k8s/02-backend.yaml
kubectl delete -f k8s/01-pvc.yaml
```

If you delete the PVC, **todo data stored in the cluster is removed** according to your storage backend’s rules.

## Troubleshooting

### `ImagePullBackOff` or `ErrImageNeverPull`

The image is missing on the node or the name does not match. Rebuild, load into the cluster (minikube/kind), or push to a registry and update **`image`** and **`imagePullPolicy`**.

### Frontend loads but API calls fail (502 / connection errors)

1. Confirm the backend pod is running: **`kubectl get pods -l app=todo-backend`**
2. Verify the Service: **`kubectl get svc todo-backend`**
3. Test from a throwaway pod in the same namespace:

   ```bash
   kubectl run curl --rm -it --image=curlimages/curl -- \
     curl -s http://todo-backend:3401/health
   ```

### PVC stuck `Pending`

Your cluster may lack a default **`StorageClass`** or available volumes. Check **`kubectl describe pvc todo-data`** and consult your cluster administrator or cloud provider docs.

### NodePort not reachable

Firewall, cloud security groups, or Kubernetes port mapping (especially on **kind** or **minikube** drivers) may block access. Use **`kubectl port-forward`** to verify the app independently of NodePort.

### Minikube: `minikube image load` fails (`blob ... not found`, manifest errors)

Docker Desktop’s local image store (often BuildKit / multi-arch manifests) does not always export cleanly into Minikube’s cache on Windows. **Avoid `image load` for this workflow** and build **inside Minikube’s Docker daemon** so the image never leaves that daemon:

```powershell
minikube docker-env --shell powershell | Invoke-Expression
cd path\to\example-base-23
docker build -t example-base-23/todo-backend:latest ./backend
docker build -t example-base-23/todo-frontend:latest ./frontend
```

Leave this shell configured with Minikube’s Docker until you deploy (or run **`minikube docker-env --shell powershell | Invoke-Expression`** again in a new session before rebuilding).

Then:

```powershell
kubectl apply -f k8s
```

If you still see issues, clear the broken cache entry under **`%USERPROFILE%\.minikube\cache\images`** for the affected image name (or run **`minikube delete`** only if you accept resetting the Minikube VM).

**Alternative:** pipe a tarball instead of `image load`:

```powershell
docker save example-base-23/todo-backend:latest | minikube ssh docker load
docker save example-base-23/todo-frontend:latest | minikube ssh docker load
```
