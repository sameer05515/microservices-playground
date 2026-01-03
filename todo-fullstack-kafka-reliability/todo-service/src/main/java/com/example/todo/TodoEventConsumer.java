package com.example.todo;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
@Component @RequiredArgsConstructor @Slf4j
public class TodoEventConsumer {
 private final ObjectMapper mapper; private final ProcessedEventRepository processed;
 @RetryableTopic(attempts="4",backoff=@Backoff(delay=1000,multiplier=2.0,maxDelay=10000),dltTopicSuffix="-dlt")
 @KafkaListener(topics="todo-events",groupId="todo-audit-consumer")
 @Transactional
 public void consume(String payload)throws Exception {
   TodoEvent e=mapper.readValue(payload,TodoEvent.class);
   if(processed.existsByEventId(e.eventId())){log.info("duplicate_event_ignored eventId={}",e.eventId());return;}
   log.info("todo_event_processed eventId={} type={} todoId={}",e.eventId(),e.type(),e.todoId());
   try{processed.save(ProcessedEvent.builder().eventId(e.eventId()).eventType(e.type()).processedAt(Instant.now()).build());}
   catch(DataIntegrityViolationException ex){log.info("duplicate_event_race_ignored eventId={}",e.eventId());}
 }
 @DltHandler public void handleDlt(String payload){log.error("todo_event_sent_to_dlt payload={}",payload);}
}
