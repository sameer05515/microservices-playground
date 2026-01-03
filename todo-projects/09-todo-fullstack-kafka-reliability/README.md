# 09 — Todo Fullstack Kafka Reliability

## Focus
Make Kafka event processing reliable using the Outbox Pattern, idempotent consumers, retry and DLT.

### Added
- Transactional Outbox table: `outbox_events`
- Background Outbox publisher
- `processed_events` idempotency table
- Event IDs for duplicate detection
- Kafka retry topics
- Exponential backoff
- Dead Letter Topic (`-dlt`)
- Kafka producer idempotence configuration
- Testcontainers Kafka dependency

## What changed from previous version
- Replaced direct database-to-Kafka dual writes with the **Outbox Pattern**.
- Todo database changes and outbox event creation happen in the same database transaction.
- Added a publisher that retries pending outbox records until they are published.
- Added an idempotent consumer so redelivered events do not repeat business processing.
- Added retry topics and exponential backoff for transient consumer failures.
- Added a DLT path for events that continue to fail.

## Reliability flow

```text
Todo transaction
      |
      +--> todos
      |
      +--> outbox_events (PENDING)
                 |
                 v
          Outbox Publisher
                 |
                 v
               Kafka
                 |
                 v
             Consumer
                 |
          processed_events
             /        \
       already seen   new event
          ignore        process
                 |
              failure
                 v
          Retry Topics
                 |
          repeated failure
                 v
                DLT
```

## Important delivery semantics
The design is intended around **at-least-once delivery**. The Outbox reduces the chance of losing an event between the database transaction and Kafka publication, while `processed_events` makes the consumer idempotent against duplicate delivery.

See `KAFKA-PATTERNS.md` for the detailed explanation.
