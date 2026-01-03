package com.example.todo;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
@Entity
@Table(name="outbox_events", indexes=@Index(name="idx_outbox_status_created",columnList="status,created_at"))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class OutboxEvent {
 @Id @Column(length=36) private String id;
 @Column(nullable=false,length=100) private String aggregateType;
 @Column(nullable=false,length=100) private String aggregateId;
 @Column(nullable=false,length=100) private String eventType;
 @Lob @Column(nullable=false,columnDefinition="LONGTEXT") private String payload;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private OutboxStatus status;
 @Column(nullable=false) private Instant createdAt;
 private Instant publishedAt;
 @Version private Long version;
}
