package com.example.order;
import jakarta.persistence.*;
@Entity @Table(name="orders")
public class Order {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 public Long customerId; public Long productId; public int quantity; public String status;
}