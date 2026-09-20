package com.example.order;
import org.springframework.web.bind.annotation.*;
import org.springframework.kafka.core.KafkaTemplate;
import java.util.*;
@RestController @RequestMapping("/orders")
public class OrderController {
 private final OrderRepository repo; private final KafkaTemplate<String,Object> kafka;
 public OrderController(OrderRepository repo,KafkaTemplate<String,Object> kafka){this.repo=repo;this.kafka=kafka;}
 @GetMapping public List<Order> all(){return repo.findAll();}
 @PostMapping public Order create(@RequestBody Order o){
  o.status="CREATED"; Order saved=repo.save(o);
  kafka.send("order-created", String.valueOf(saved.id), saved.id);
  return saved;
 }
}