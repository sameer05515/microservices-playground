# Spring Boot Microservices Coding Question :1
 
## Scenario:  
You're building a microservices-based application for an e-commerce platform. One microservice is responsible for managing product information (Product Service), another manages orders (Order Service). 
 
## Tasks:  
Create a Spring Boot application for the Product Service:  
The service should expose a REST API endpoint /products that returns a list of all available products.  
Each product should have properties like id, name, description, price, and imageUrl.  
Add a /products/{id} endpoint to retrieve a specific product by its ID. Include proper error handling and documentation for the API.   
 
Create Order Service:  
The service should expose a REST API endpoint /orders that allows creating new orders.  
Each order should have properties like id, customerName, products (list of product IDs), and orderDate.  
Implement a mechanism to call the Product Service /products/{id} endpoint to retrieve product details when creating an order.  
 
Include proper error handling and logging for failed calls to the Product Service."  
Write SQL for creating the corresponding  database tables
Add the repository to read from database tables  