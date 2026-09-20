# V3 Architecture Notes

## Core mechanism

```text
Client
  |
  v
API Gateway :8080
  |
  | lb://product-service
  v
Spring Cloud LoadBalancer
  |
  v
Eureka Server :8761
  |
  v
PRODUCT-SERVICE instances
```

## Service registration

Every application service has:

```properties
spring.application.name=<service-id>
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

## Gateway

Gateway uses:

```properties
spring.cloud.gateway.routes[0].uri=lb://product-service
```

The `lb://` scheme delegates service resolution to the discovery/load-balancing infrastructure.

## Why this is different from V2

V2:

```text
Gateway -> http://localhost:8081
```

V3:

```text
Gateway -> lb://product-service -> Eureka -> instance(s)
```

This removes fixed backend host/port knowledge from the Gateway.
