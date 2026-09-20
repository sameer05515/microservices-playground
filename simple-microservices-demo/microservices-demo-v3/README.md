# Simple Microservices Demo - V2

A runnable Spring Boot microservices playground with:

- Product Service
- Customer Service
- Order Service
- Notification Service
- Spring Cloud API Gateway
- Kafka event publishing/consuming
- Three isolated MySQL databases
- Docker Compose for infrastructure
- Health checks
- Consistent local ports
- Explicit Kafka serialization
- Improved README and Postman/curl examples

## Architecture

```text
                         +----------------------+
                         |     API Gateway      |
                         |       :8080          |
                         +----------+-----------+
                                    |
                 +------------------+------------------+
                 |                  |                  |
                 v                  v                  v
        +----------------+ +----------------+ +----------------+
        | Product        | | Customer       | | Order          |
        | Service :8081  | | Service :8082  | | Service :8083 |
        +-------+--------+ +-------+--------+ +-------+--------+
                |                  |                  |
                v                  v                  v
          productdb          customerdb           orderdb
            :3307               :3308               :3309
                                                     |
                                                     v
                                                +---------+
                                                |  Kafka  |
                                                |  :9092  |
                                                +----+----+
                                                     |
                                                     v
                                           +---------------------+
                                           | Notification        |
                                           | Service :8084       |
                                           +---------------------+
```

## Prerequisites

For local Maven execution:

- Java 17+
- Maven 3.8+
- Docker Desktop (recommended for MySQL + Kafka)

Verify:

```bash
java -version
mvn -version
docker --version
docker compose version
```

## 1. Start infrastructure

From this directory:

```bash
docker compose up -d
```

Check:

```bash
docker compose ps
```

Infrastructure:

| Component | Host port |
|---|---:|
| Product MySQL | 3307 |
| Customer MySQL | 3308 |
| Order MySQL | 3309 |
| Kafka | 9092 |
| Kafka UI | 8088 |

Kafka UI:

```text
http://localhost:8088
```

Stop infrastructure:

```bash
docker compose down
```

Delete databases/volumes too:

```bash
docker compose down -v
```

## 2. Start services

Open five terminals.

### Product

```bash
cd product-service
mvn spring-boot:run
```

Port: `8081`

### Customer

```bash
cd customer-service
mvn spring-boot:run
```

Port: `8082`

### Order

```bash
cd order-service
mvn spring-boot:run
```

Port: `8083`

### Notification

```bash
cd notification-service
mvn spring-boot:run
```

Port: `8084`

### Gateway

```bash
cd api-gateway
mvn spring-boot:run
```

Port: `8080`

## 3. Test directly

### Create product

```bash
curl -X POST http://localhost:8081/products ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Laptop\",\"price\":75000,\"stock\":10}"
```

### Create customer

```bash
curl -X POST http://localhost:8082/customers ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Prem\",\"email\":\"prem@example.com\"}"
```

### Create order

```bash
curl -X POST http://localhost:8083/orders ^
  -H "Content-Type: application/json" ^
  -d "{\"customerId\":1,\"productId\":1,\"quantity\":2}"
```

Expected notification-service log:

```text
Notification: Order created = 1
```

## 4. Test through Gateway

Product:

```text
GET http://localhost:8080/products
```

Customer:

```text
GET http://localhost:8080/customers
```

Orders:

```text
GET http://localhost:8080/orders
```

Create product:

```http
POST http://localhost:8080/products
Content-Type: application/json

{
  "name": "Laptop",
  "price": 75000,
  "stock": 10
}
```

Create customer:

```http
POST http://localhost:8080/customers
Content-Type: application/json

{
  "name": "Prem",
  "email": "prem@example.com"
}
```

Create order:

```http
POST http://localhost:8080/orders
Content-Type: application/json

{
  "customerId": 1,
  "productId": 1,
  "quantity": 2
}
```

## 5. Verify Kafka

Open:

```text
http://localhost:8088
```

Find topic:

```text
order-created
```

An order creates an event:

```text
Order Service
     |
     v
Kafka topic: order-created
     |
     v
Notification Service
```

## 6. Run tests

From each service:

```bash
mvn test
```

Or build all services individually:

```bash
cd product-service && mvn clean package
cd ../customer-service && mvn clean package
cd ../order-service && mvn clean package
cd ../notification-service && mvn clean package
cd ../api-gateway && mvn clean package
```

## Configuration

### Product

```text
server.port=8081
MySQL=localhost:3307/productdb
```

### Customer

```text
server.port=8082
MySQL=localhost:3308/customerdb
```

### Order

```text
server.port=8083
MySQL=localhost:3309/orderdb
Kafka=localhost:9092
```

### Notification

```text
server.port=8084
Kafka=localhost:9092
```

### Gateway

```text
server.port=8080
```

Gateway routes:

```text
/products/**  -> http://localhost:8081
/customers/** -> http://localhost:8082
/orders/**    -> http://localhost:8083
```

## What changed from V1

1. Added Docker Compose for three MySQL instances.
2. Added Kafka infrastructure.
3. Added Kafka UI.
4. Added explicit Kafka producer serializers.
5. Added explicit Kafka consumer deserializers.
6. Added Kafka trusted package configuration.
7. Added Spring Cloud dependency management to Gateway.
8. Added gateway routing configuration.
9. Added Actuator health endpoints where appropriate.
10. Improved application configuration.
11. Added `.gitignore`.
12. Added a complete startup guide.
13. Added curl/Postman-style API examples.
14. Added architecture documentation.
15. Added troubleshooting guidance.

## Troubleshooting

### Port already in use

Windows:

```bash
netstat -ano | findstr :8080
netstat -ano | findstr :8081
netstat -ano | findstr :8082
netstat -ano | findstr :8083
netstat -ano | findstr :8084
```

### Infrastructure not running

```bash
docker compose ps
docker compose logs kafka
docker compose logs product-db
```

Restart:

```bash
docker compose down
docker compose up -d
```

### Kafka topic not visible

Create it manually if necessary:

```bash
docker exec -it microservices-kafka \
  kafka-topics --bootstrap-server localhost:9092 \
  --create --topic order-created \
  --partitions 3 \
  --replication-factor 1
```

### Clean reset

```bash
docker compose down -v
docker compose up -d
```

Then restart the Spring Boot services.

## V2 learning goals

This version is still intentionally simple. It is the base for future versions:

```text
V1  Basic microservices
V2  Docker + Kafka reliability baseline       <-- current
V3  Eureka + Service Discovery
V4  LoadBalancer + Gateway discovery
V5  Resilience4j
V6  Keycloak + OAuth2 + JWT + RBAC
V7  Kafka Retry + DLQ + Idempotency
V8  Saga Pattern
V9  Outbox Pattern
V10 Docker/Kubernetes production deployment
V11 Observability
V12 Production-grade microservices
```


# V3 - Eureka + Service Discovery + LoadBalancer

V3 replaces hard-coded backend URLs in the Gateway with Eureka service discovery.

## V3 architecture

```text
                         +----------------------+
                         |     API Gateway      |
                         |       :8080          |
                         +----------+-----------+
                                    |
                              lb://service-id
                                    |
                                    v
                         +----------------------+
                         |  Spring Cloud        |
                         |  LoadBalancer        |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |   Eureka Server      |
                         |       :8761          |
                         +----------+-----------+
                                    ^
              +---------------------+----------------------+
              |                     |                      |
              | register            | register             | register
              v                     v                      v
       Product Service       Customer Service        Order Service
           :8081                  :8082                  :8083
              ^                                            |
              |                                            v
       Notification Service :8084                    Kafka :9092
```

## V3 startup order

### 1. Start infrastructure

```bash
docker compose up -d
```

### 2. Start Eureka

```bash
cd eureka-server
mvn spring-boot:run
```

Open:

```text
http://localhost:8761
```

### 3. Start application services

```bash
cd product-service
mvn spring-boot:run
```

```bash
cd customer-service
mvn spring-boot:run
```

```bash
cd order-service
mvn spring-boot:run
```

```bash
cd notification-service
mvn spring-boot:run
```

### 4. Start Gateway

```bash
cd api-gateway
mvn spring-boot:run
```

## Verify service registration

Open:

```text
http://localhost:8761
```

You should see:

```text
API-GATEWAY
PRODUCT-SERVICE
CUSTOMER-SERVICE
ORDER-SERVICE
NOTIFICATION-SERVICE
```

The exact displayed instance IDs vary.

## Gateway request flow

V2:

```text
Gateway
   |
   +--> http://localhost:8081
```

V3:

```text
Gateway
   |
   +--> lb://product-service
              |
              v
        Eureka Registry
              |
              v
        Product instance
```

For example:

```text
GET http://localhost:8080/products
```

Gateway resolves:

```text
product-service
```

through Eureka and Spring Cloud LoadBalancer selects an available instance.

## Dynamic service discovery

The Gateway no longer needs to know:

```text
localhost:8081
localhost:8082
localhost:8083
```

It knows service IDs:

```text
product-service
customer-service
order-service
```

This allows multiple instances.

Example:

```text
PRODUCT-SERVICE
    ├── instance :8081
    └── instance :8091

Gateway
    |
    v
Spring Cloud LoadBalancer
    |
    +----> :8081
    |
    +----> :8091
```

## Run a second Product Service instance

Build:

```bash
cd product-service
mvn clean package
```

Run another instance:

```bash
java -jar target/product-service-0.0.1-SNAPSHOT.jar --server.port=8091
```

Both instances should register with Eureka:

```text
PRODUCT-SERVICE
    ├── 8081
    └── 8091
```

Then repeatedly call:

```text
GET http://localhost:8080/products
```

The Gateway can distribute requests through Spring Cloud LoadBalancer.

## Important V3 concepts

### Eureka Server

Central service registry:

```text
Service -> register -> Eureka
Gateway -> lookup -> Eureka
```

### Eureka Client

Each microservice becomes a Eureka client:

```properties
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

### Service ID

Example:

```properties
spring.application.name=product-service
```

Eureka registers it as:

```text
PRODUCT-SERVICE
```

### LoadBalancer URI

Instead of:

```text
http://localhost:8081
```

Gateway uses:

```text
lb://product-service
```

`lb://` tells Spring Cloud Gateway to resolve the service through the discovery/load-balancing mechanism.

## What changed from V2

- Added dedicated `eureka-server`.
- Added `@EnableEurekaServer`.
- Added Eureka client to all application services.
- Added Eureka client to API Gateway.
- Added Spring Cloud LoadBalancer to Gateway.
- Replaced Gateway hard-coded service URLs with `lb://service-id`.
- Enabled Gateway discovery locator.
- Added service registration configuration.
- Added Eureka dashboard instructions.
- Added multiple-instance/load-balancing experiment.
- Kept MySQL, Kafka, Kafka UI and existing V2 APIs unchanged.

## V3 troubleshooting

### Eureka dashboard is empty

Make sure Eureka is running first:

```text
http://localhost:8761
```

Then restart the clients.

### Gateway returns 503

Check:

```text
http://localhost:8761
```

and verify the target service is registered.

For example:

```text
PRODUCT-SERVICE
```

must be present before:

```text
GET http://localhost:8080/products
```

### Gateway cannot resolve lb://product-service

Verify Gateway has:

```xml
<artifactId>spring-cloud-starter-loadbalancer</artifactId>
```

and:

```properties
spring.cloud.gateway.routes[0].uri=lb://product-service
```

### Service does not register

Verify:

```properties
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

and:

```properties
spring.application.name=product-service
```

## Next version

V4 can add:

```text
Eureka
   +
API Gateway
   +
LoadBalancer
   +
Resilience4j
   ├── Circuit Breaker
   ├── Retry
   ├── Timeout
   └── Fallback
```
