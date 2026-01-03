package com.example.todo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
@Component @RequiredArgsConstructor @Slf4j
public class OutboxPublisher {
 private final OutboxEventRepository outbox; private final KafkaTemplate<String,String> kafka;
 @Scheduled(fixedDelayString="${app.outbox.poll-ms:1000}")
 public void publishPendingEvents() {
   for(OutboxEvent e:outbox.findPending()) {
     try {
       kafka.send("todo-events",e.getAggregateId(),e.getPayload()).get();
       markPublished(e.getId());
       log.info("outbox_event_published eventId={} eventType={}",e.getId(),e.getEventType());
     } catch(Exception ex){log.error("outbox_event_publish_failed eventId={} eventType={}",e.getId(),e.getEventType(),ex);}
   }
 }
 @Transactional protected void markPublished(String id) {
   outbox.findById(id).ifPresent(e->{e.setStatus(OutboxStatus.PUBLISHED);e.setPublishedAt(Instant.now());});
 }
}
