package com.example.todo;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProcessedEventRepository extends JpaRepository<ProcessedEvent,Long> {
 boolean existsByEventId(String eventId);
}
