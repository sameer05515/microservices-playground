package com.example.todo;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
@Component @RequiredArgsConstructor
public class KafkaTodoPublisher{
 private final KafkaTemplate<String,Object> kafka;
 public void publish(String event, Todo t, String username){
   kafka.send("todo-events",String.valueOf(t.getId()),
     new TodoEvent(event,t.getId(),username,t.getTitle(),t.isCompleted()));
 }
 public record TodoEvent(String type,Long todoId,String username,String title,boolean completed){}
}
