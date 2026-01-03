CREATE TABLE outbox_events(
 id VARCHAR(36) NOT NULL, aggregate_type VARCHAR(100) NOT NULL, aggregate_id VARCHAR(100) NOT NULL,
 event_type VARCHAR(100) NOT NULL, payload LONGTEXT NOT NULL, status VARCHAR(20) NOT NULL,
 created_at TIMESTAMP(6) NOT NULL, published_at TIMESTAMP(6) NULL, version BIGINT NULL, PRIMARY KEY(id)
);
CREATE INDEX idx_outbox_status_created ON outbox_events(status,created_at);
CREATE TABLE processed_events(
 id BIGINT NOT NULL AUTO_INCREMENT, event_id VARCHAR(36) NOT NULL, event_type VARCHAR(100) NOT NULL,
 processed_at TIMESTAMP(6) NOT NULL, PRIMARY KEY(id),
 CONSTRAINT uk_processed_event_id UNIQUE(event_id)
);
