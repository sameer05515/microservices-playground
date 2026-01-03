# Kafka Reliability Patterns

## Transactional Outbox
Todo and its `outbox_events` row are committed in the same MySQL transaction. A scheduled relay publishes pending rows to `todo-events`. If Kafka is unavailable, the row stays `PENDING` and is retried.

## At-least-once
The relay can publish and crash before marking the row published, so duplicates are possible.

## Idempotent Consumer
`processed_events.event_id` is unique. A consumer ignores an event ID already processed; the DB constraint also protects against concurrent duplicate delivery.

## Retry + DLT
The consumer uses Spring Kafka retry topics with exponential backoff. After four attempts the record is sent to `todo-events-dlt`.

```text
DB transaction
  ├── Todo change
  └── Outbox PENDING
          |
          v
     Outbox relay
          |
          v
      todo-events
          |
       consumer
       /         success   failure
     |        |
processed   retries
 events       |
              v
             DLT
```

For hardened multi-instance production, add row claiming/`FOR UPDATE SKIP LOCKED`, retry metadata, replay tooling, schema versioning, and consumer lag monitoring.
