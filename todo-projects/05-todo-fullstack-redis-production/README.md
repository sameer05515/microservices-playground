# 05 — Todo Fullstack Redis Production

## Focus
Introduce Redis for distributed, low-latency infrastructure concerns.

### Added
- Redis-backed Todo caching
- Cache invalidation on writes
- Distributed locking for protected operations
- Distributed rate limiting
- Docker Compose support for Redis
- Production-oriented JWT/MySQL foundation from version 04

## What changed from previous version
- Added Redis instead of relying only on in-memory state.
- Added cache-aside behavior for Todo reads and invalidation after mutations.
- Added distributed locking so coordination can work across application instances.
- Added distributed rate limiting suitable for a horizontally scaled service.

## Learning goal
Understand when to use a relational database versus Redis, and why distributed application state should not depend on a single JVM instance.
