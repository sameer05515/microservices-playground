# Microservices Learning Project

Small Spring Boot microservices playground for learning service discovery, API Gateway, OpenFeign and REST communication.

## Services

| Service | Port | Responsibility |
|---|---:|---|
| service-registry | 8761 | Eureka Server |
| api-gateway | 8080 | API Gateway |
| user-service | 8081 | User APIs |
| product-service | 8082 | Product APIs |
| order-service | 8083 | Order APIs |

## Tech

- Java 17
- Spring Boot 3.5.5
- Spring Cloud 2025.0.0
- Eureka
- Spring Cloud Gateway
- OpenFeign
- Spring Data MongoDB
- Maven

## Prerequisites

- JDK 17+
- Maven 3.9+
- MongoDB running on localhost:27017

## Run

Open five terminals.

```bash
cd service-registry
mvn spring-boot:run
```

```bash
cd user-service
mvn spring-boot:run
```

```bash
cd product-service
mvn spring-boot:run
```

```bash
cd order-service
mvn spring-boot:run
```

```bash
cd api-gateway
mvn spring-boot:run
```

Open:

http://localhost:8761

## Test through Gateway

Create user:

```http
POST http://localhost:8080/users
Content-Type: application/json

{
  "name": "Prem",
  "email": "prem@example.com"
}
```

Create product:

```http
POST http://localhost:8080/products
Content-Type: application/json

{
  "name": "Laptop",
  "price": 79990,
  "stock": 10
}
```

Get users:

```http
GET http://localhost:8080/users
```

Get products:

```http
GET http://localhost:8080/products
```

Create order using the returned IDs:

```http
POST http://localhost:8080/orders
Content-Type: application/json

{
  "userId": "<USER_ID>",
  "productId": "<PRODUCT_ID>",
  "quantity": 2
}
```

The order-service demonstrates synchronous service-to-service communication:

```text
Client
  |
  v
API Gateway
  |
  v
Order Service
  |          \
  | Feign     \ Feign
  v            v
User Service  Product Service
                  |
                  v
              stock update
```

Next learning steps can be added incrementally: Config Server, Resilience4j, Kafka, Saga, Docker and AWS.

## React + Vite Frontend

The `frontend` folder contains a small React UI for end-to-end testing.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The frontend calls only `http://localhost:8080` (API Gateway).

Features: Users create/list, Products create/list, Orders create/list. Creating an order exercises Order Service -> User Service and Order Service -> Product Service through OpenFeign and reduces product stock.
