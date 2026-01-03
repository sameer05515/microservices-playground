package com.example.product;
import jakarta.persistence.*;
@Entity
public class Product {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 public String name; public double price; public int stock;
}