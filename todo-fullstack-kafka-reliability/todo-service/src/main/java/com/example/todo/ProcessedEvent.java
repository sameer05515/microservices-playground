package com.example.todo;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
@Entity
@Table(name="processed_events",uniqueConstraints=@UniqueConstraint(name="uk_processed_event_id",columnNames="eventId"))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ProcessedEvent {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=36) private String eventId;
 @Column(nullable=false,length=100) private String eventType;
 @Column(nullable=false) private Instant processedAt;
}
