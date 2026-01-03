# Microservices + Circuit Breaker Demo

Minimal Spring Boot microservice project demonstrating:

- product-service on port 8081
- order-service on port 8082
- synchronous REST communication
- Resilience4j Circuit Breaker
- fallback method
- Actuator circuit breaker metrics/events

## Prerequisites

- Java 21
- Maven 3.9+

## Run

From the project root:

```bash
mvn clean install
```

Terminal 1:

```bash
cd product-service
mvn spring-boot:run
```

Terminal 2:

```bash
cd order-service
mvn spring-boot:run
```

## Normal request

```http
GET http://localhost:8082/orders/100?productId=1
```

Expected:

```json
{
  "orderId": 100,
  "productId": 1,
  "productName": "Laptop",
  "price": 79990.0,
  "fallback": false
}
```

## Trigger failure

Product ID `999` intentionally makes product-service fail:

```http
GET http://localhost:8082/orders/100?productId=999
```

Expected fallback:

```json
{
  "orderId": 100,
  "productId": 999,
  "productName": "Fallback Product",
  "price": 0.0,
  "fallback": true
}
```

The circuit breaker is configured with:

- window size: 5 calls
- minimum calls: 3
- failure threshold: 50%
- OPEN duration: 10 seconds
- HALF_OPEN permitted calls: 2

## Observe circuit breaker

```http
GET http://localhost:8082/actuator/health
GET http://localhost:8082/actuator/metrics/resilience4j.circuitbreaker.calls
GET http://localhost:8082/actuator/circuitbreakerevents
```

## Failure flow

```text
Client
  |
  v
order-service
  |
  |  @CircuitBreaker
  v
product-service
  |
  X failure
  |
  v
Resilience4j
  |
  +---- fallback()
  |
  v
order response

Repeated failures
      |
      v
CLOSED -> OPEN -> HALF_OPEN -> CLOSED
                       |
                       +-> OPEN if failures continue
```

## Next recommended extensions

1. Service discovery with Eureka
2. API Gateway
3. Load-balanced WebClient
4. Retry + Circuit Breaker
5. TimeLimiter
6. Bulkhead
7. Distributed tracing
8. Docker Compose
