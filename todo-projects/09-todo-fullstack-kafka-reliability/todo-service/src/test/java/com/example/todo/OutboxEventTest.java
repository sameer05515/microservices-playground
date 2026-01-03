package com.example.todo;
import org.junit.jupiter.api.Test;
import java.time.Instant;
import static org.assertj.core.api.Assertions.assertThat;
class OutboxEventTest {
 @Test void newEventIsPending(){
  OutboxEvent e=OutboxEvent.builder().id("e1").aggregateType("TODO").aggregateId("1")
   .eventType("TODO_CREATED").payload("{}").status(OutboxStatus.PENDING).createdAt(Instant.now()).build();
  assertThat(e.getStatus()).isEqualTo(OutboxStatus.PENDING);
 }
}
