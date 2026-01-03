# Production-Style Spring Cloud Microservices Demo

## Architecture

```text
                         +------------------+
                         |      Client      |
                         +--------+---------+
                                  |
                                  v
                         +------------------+
                         |   API Gateway    |
                         |     :8080        |
                         +--------+---------+
                                  |
                    +-------------+-------------+
                    |                           |
                    v                           v
             lb://ORDER-SERVICE        lb://PRODUCT-SERVICE
                    |                           |
                    v                           v
             +-------------+             +-------------+
             | Order       |             | Product     |
             | Service     |------------>| Service     |
             | :8082       |  LB + CB    | :8081       |
             +-------------+             +-------------+
                    |
                    +-- Retry
                    +-- Circuit Breaker
                    +-- Timeout

                         ^
                         |
                  +------+------+
                  |   Eureka    |
                  |   :8761     |
                  +-------------+
```

## Components

| Component | Port | Responsibility |
|---|---:|---|
| Eureka Server | 8761 | Service discovery |
| API Gateway | 8080 | Single entry point + routing |
| Order Service | 8082 | Order API + service-to-service call |
| Product Service | 8081 | Product API |

## Important concepts demonstrated

### 1. Eureka

Services register themselves:

```text
ORDER-SERVICE
PRODUCT-SERVICE
API-GATEWAY
       |
       v
Eureka Server
```

No hard-coded service IP is required.

### 2. API Gateway

Client calls:

```http
GET http://localhost:8080/api/orders/100?productId=1
```

Gateway routes to:

```text
lb://ORDER-SERVICE
```

### 3. LoadBalancer

Order service uses:

```java
@LoadBalanced
@Bean
RestClient restClient(RestClient.Builder builder) {
    return builder.build();
}
```

and:

```java
http://PRODUCT-SERVICE/products/{id}
```

The logical service name is resolved through Eureka + Spring Cloud LoadBalancer.

### 4. Retry

Order service:

```java
@Retry(name = "productService")
@CircuitBreaker(
    name = "productService",
    fallbackMethod = "productFallback"
)
public Product getProduct(Long productId) {
    ...
}
```

Configuration:

```yaml
resilience4j:
  retry:
    instances:
      productService:
        maxAttempts: 3
        waitDuration: 500ms
        enableExponentialBackoff: true
        exponentialBackoffMultiplier: 2
```

### 5. Circuit Breaker

```text
CLOSED
   |
   | failure rate >= 50%
   v
 OPEN
   |
   | after 10 sec
   v
HALF_OPEN
   |
   +-- success --> CLOSED
   |
   +-- failure --> OPEN
```

### 6. Timeout

Order service has:

```yaml
resilience4j:
  timelimiter:
    instances:
      productService:
        timeoutDuration: 2s
```

Product ID `888` intentionally sleeps for 5 seconds so timeout behavior can be tested.

> Note: Resilience4j TimeLimiter is primarily designed around async/reactive execution. The demo keeps the synchronous RestClient path simple and includes the timeout configuration for the next reactive/WebClient step.

Gateway also has an HTTP response timeout:

```yaml
spring:
  cloud:
    gateway:
      httpclient:
        connect-timeout: 2000
        response-timeout: 3s
```

## Build

From root:

```bash
mvn clean install
```

## Start services

Start in this order.

### 1. Eureka

```bash
cd eureka-server
mvn spring-boot:run
```

Open:

```text
http://localhost:8761
```

### 2. Product Service

```bash
cd product-service
mvn spring-boot:run
```

### 3. Order Service

```bash
cd order-service
mvn spring-boot:run
```

### 4. API Gateway

```bash
cd api-gateway
mvn spring-boot:run
```

## Test through Gateway

### Successful request

```http
GET http://localhost:8080/api/orders/100?productId=1
```

### Trigger product failure

```http
GET http://localhost:8080/api/products/999
```

or:

```http
GET http://localhost:8080/api/orders/100?productId=999
```

### Trigger timeout

```http
GET http://localhost:8080/api/products/888
```

Product service sleeps for 5 seconds while Gateway has a 3 second HTTP response timeout.

## Actuator

Gateway:

```http
GET http://localhost:8080/actuator/health
GET http://localhost:8080/actuator/circuitbreakers
GET http://localhost:8080/actuator/circuitbreakerevents
```

Order service:

```http
GET http://localhost:8082/actuator/health
GET http://localhost:8082/actuator/circuitbreakers
GET http://localhost:8082/actuator/circuitbreakerevents
```

## Production discussion

This project intentionally demonstrates the core architecture without adding unnecessary infrastructure.

A real production system would normally add:

```text
API Gateway
   |
   +-- Authentication / OAuth2 / Keycloak
   +-- Rate Limiting
   +-- Correlation ID
   +-- Centralized Logging
   |
   v
Eureka / Kubernetes Service Discovery
   |
   +-- Order Service
   |      +-- Retry
   |      +-- Timeout
   |      +-- Circuit Breaker
   |
   +-- Product Service
   |
   +-- Other services

Observability:
   +-- Micrometer
   +-- Prometheus
   +-- Grafana
   +-- Distributed tracing
```

## Recommended next implementation

The next version can replace the synchronous `RestClient` call with:

```text
WebClient
   |
   +-- LoadBalancer
   +-- Timeout
   +-- Retry
   +-- CircuitBreaker
   +-- Bulkhead
```

and then add:

```text
Keycloak
    |
    v
API Gateway
    |
    v
OAuth2 Resource Server
    |
    +--> Order Service
    +--> Product Service
```

This gives a complete interview-ready Spring Cloud architecture.
