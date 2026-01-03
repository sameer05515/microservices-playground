# V3 Test Checklist

## 1. Infrastructure

```bash
docker compose up -d
docker compose ps
```

## 2. Eureka

Start `eureka-server`.

Open:

```text
http://localhost:8761
```

Expected: Eureka dashboard.

## 3. Services

Start:

- product-service :8081
- customer-service :8082
- order-service :8083
- notification-service :8084
- api-gateway :8080

## 4. Verify registry

Eureka should list:

```text
API-GATEWAY
PRODUCT-SERVICE
CUSTOMER-SERVICE
ORDER-SERVICE
NOTIFICATION-SERVICE
```

## 5. Test Gateway

```text
GET http://localhost:8080/products
GET http://localhost:8080/customers
GET http://localhost:8080/orders
```

## 6. Test load balancing

Start a second product instance:

```bash
java -jar product-service/target/product-service-0.0.1-SNAPSHOT.jar --server.port=8091
```

Verify two `PRODUCT-SERVICE` instances in Eureka.

Call:

```text
GET http://localhost:8080/products
```

The Gateway resolves `product-service` through discovery rather than using a fixed URL.
