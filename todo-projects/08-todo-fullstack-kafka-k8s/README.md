# 08 — Todo Fullstack Kafka + Kubernetes

## Focus
Introduce event-driven communication and container orchestration.

### Added
- Kafka event publishing
- `todo-events` topic
- Microservices architecture from version 07
- Kubernetes manifests
- ConfigMap / Secret configuration
- Liveness and readiness probes
- Containerized deployment flow

## What changed from previous version
- Added Kafka for asynchronous event-driven communication.
- Todo operations can publish domain events without making consumers synchronous dependencies.
- Added Kubernetes deployment manifests and health probes.
- Extended the architecture from a locally orchestrated microservice setup toward cluster deployment.

## Learning goal
Understand synchronous REST versus asynchronous Kafka communication and the Kubernetes primitives required to run the services.
