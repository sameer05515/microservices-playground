# Kubernetes

Build images:

```bash
docker build -t todo-platform/auth-service:1.0.0 ./auth-service
docker build -t todo-platform/todo-service:1.0.0 ./todo-service
docker build -t todo-platform/api-gateway:1.0.0 ./api-gateway
```

For Minikube:

```bash
minikube image load todo-platform/auth-service:1.0.0
minikube image load todo-platform/todo-service:1.0.0
minikube image load todo-platform/api-gateway:1.0.0
```

Apply:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/infrastructure.yaml
kubectl apply -f k8s/eureka-server.yaml
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/todo-service.yaml
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/api-gateway-ingress.yaml
```

The Spring services expose Kubernetes-compatible:

- `/actuator/health/liveness`
- `/actuator/health/readiness`

Config is in ConfigMap; credentials/JWT secret are in Secret.

For real production, use an external managed MySQL/Redis/Kafka and a proper secret manager rather than plain `stringData`.
