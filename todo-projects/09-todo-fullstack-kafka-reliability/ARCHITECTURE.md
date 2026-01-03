# Final architecture

```text
React/Vite
    |
    v
API Gateway :8088
    |
    +---- /api/auth/**  --> AUTH-SERVICE
    |
    +---- /api/todos/** --> TODO-SERVICE
                              |
                 +------------+------------+
                 |            |            |
               MySQL        Redis        Kafka
                 |                         |
             todo_db                  todo-events

AUTH-SERVICE
    |
 auth_db (separate database)

Eureka :8761
    |
    +---- AUTH-SERVICE
    +---- TODO-SERVICE (multiple instances)
    +---- API-GATEWAY

Resilience4j
    |
    +---- Todo service circuit breaker
    +---- TimeLimiter + fallback

Kubernetes
    |
    +---- ConfigMap
    +---- Secret
    +---- readinessProbe
    +---- livenessProbe
```

## Kafka event flow

Todo mutations publish to:

```text
todo-events
```

Events:
- TODO_CREATED
- TODO_UPDATED
- TODO_COMPLETED_CHANGED
- TODO_DELETED

The event contains:
- event type
- todo id
- username
- title
- completed

This establishes the event-driven foundation. The next step is adding a real consumer (notification/audit/search service) and an outbox pattern so database changes and Kafka publishing become reliably coordinated.
