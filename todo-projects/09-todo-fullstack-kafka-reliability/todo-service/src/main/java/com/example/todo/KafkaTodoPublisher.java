package com.example.todo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.time.Instant;
import java.util.UUID;
@Component @RequiredArgsConstructor
public class KafkaTodoPublisher {
 private final OutboxEventRepository outbox; private final ObjectMapper mapper;
 public void enqueue(String type,Todo todo,String username) {
   TodoEvent e=new TodoEvent(UUID.randomUUID().toString(),type,todo.getId(),username,todo.getTitle(),todo.isCompleted());
   try {
     outbox.save(OutboxEvent.builder().id(e.eventId()).aggregateType("TODO").aggregateId(String.valueOf(todo.getId()))
       .eventType(type).payload(mapper.writeValueAsString(e)).status(OutboxStatus.PENDING).createdAt(Instant.now()).build());
   } catch(JsonProcessingException ex){throw new IllegalStateException("Could not serialize Todo event",ex);}
 }
}
