# Reactive Production-Style Microservices

## Stack
- Spring Boot 3.5.x
- Spring Cloud 2025.x
- Java 21
- Eureka
- API Gateway
- Spring Cloud LoadBalancer
- WebClient/WebFlux
- Resilience4j Circuit Breaker
- Resilience4j Retry
- Reactive timeout

## Architecture

Client -> API Gateway :8080 -> Eureka/LoadBalancer -> Order :8082
                                                     |
                                                     | WebClient
                                                     v
                                            Retry -> Timeout -> CircuitBreaker
                                                     |
                                                     v
                                            Product :8081

## Start

```bash
mvn clean install
```

Start in this order:

```bash
cd eureka-server && mvn spring-boot:run
cd product-service && mvn spring-boot:run
cd order-service && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run
```

Eureka UI:
`http://localhost:8761`

## Test

Success:
`GET http://localhost:8080/api/orders/100?productId=1`

Intentional failure:
`GET http://localhost:8080/api/orders/100?productId=999`

Intentional timeout:
`GET http://localhost:8080/api/orders/100?productId=888`

Product `888` sleeps for 5 seconds while the Order WebClient timeout is 2 seconds.

## Load balancing

Run another Product Service instance:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8083"
```

Both instances register as `PRODUCT-SERVICE`.

Order Service calls:

```text
http://PRODUCT-SERVICE/products/{id}
```

The `@LoadBalanced WebClient.Builder` resolves the logical service name through Eureka + LoadBalancer.

## Resilience

```text
WebClient
   |
   v
Timeout 2s
   |
Retry (3 attempts)
   |
Circuit Breaker
   |
Fallback
```

Circuit breaker:

```text
CLOSED -> OPEN -> HALF_OPEN -> CLOSED
                  |
                  +----------> OPEN
```

## Actuator

```text
GET http://localhost:8082/actuator/health
GET http://localhost:8082/actuator/circuitbreakers
GET http://localhost:8082/actuator/circuitbreakerevents
GET http://localhost:8082/actuator/retryevents
```

## Note

The WebClient pipeline intentionally uses explicit reactive operators for timeout/retry/circuit-breaker so the behavior is visible and easy to debug in an interview/demo project.
