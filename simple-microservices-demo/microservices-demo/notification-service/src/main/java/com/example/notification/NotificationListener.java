package com.example.notification;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
@Service
public class NotificationListener {
 @KafkaListener(topics="order-created",groupId="notification-service")
 public void receive(Long orderId){System.out.println("Notification: Order created = "+orderId);}
}