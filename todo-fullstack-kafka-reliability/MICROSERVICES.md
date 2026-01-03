# Microservices Layer

```text
React/Vite
    |
    v
API Gateway :8088
    |
    | Eureka + Spring Cloud LoadBalancer
    v
+---------------------+
| TODO-SERVICE x2     |
+---------------------+
    |             |
    +------+------+
           |
       MySQL + Redis

Eureka Server :8761

Gateway -> Resilience4j CircuitBreaker + TimeLimiter -> fallback 503

Observability -> Actuator/Micrometer -> Prometheus :9090 -> Grafana :3000
```

## Run

Build each Spring Boot application:

```bash
cd eureka-server && mvn clean package
cd ../api-gateway && mvn clean package
cd ../backend && mvn clean package
cd ..
docker compose up --build
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The browser calls the Gateway at `http://localhost:8088/api`.

## What to observe

1. Open Eureka: `http://localhost:8761`
2. You should see `TODO-SERVICE` registered with two instances.
3. Gateway: `http://localhost:8088`
4. API calls use `lb://TODO-SERVICE`, so the Gateway resolves instances through Eureka/LoadBalancer.
5. Stop one Todo instance and calls can continue through the remaining instance.
6. Stop both Todo instances and the Gateway circuit breaker can return the fallback 503 response.
7. Prometheus: `http://localhost:9090`
8. Grafana: `http://localhost:3000`

## Next step

Now extract authentication and Todo into separate bounded services, then add Kafka domain events. Kubernetes should come after the service boundaries and health/readiness probes are stable.
