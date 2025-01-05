Below is an example of a **Spring Boot project** to produce messages to an **Apache Kafka** topic. It uses Spring Boot’s Kafka support, provided by the `spring-kafka` dependency.

---

### Steps to Create the Project

#### 1. **Add Dependencies in `pom.xml`**
```xml
<dependencies>
    <!-- Spring Boot Starter for Kafka -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.kafka</groupId>
        <artifactId>spring-kafka</artifactId>
    </dependency>
</dependencies>
```

---

#### 2. **Kafka Configuration**

Create a file named `application.yml` in the `src/main/resources` directory:

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
    topic:
      name: my-topic
```

---

#### 3. **Producer Configuration**

Create a `KafkaProducerConfig` class to define the Kafka producer.

```java
package com.example.kafka.config;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
```

---

#### 4. **Producer Service**

Create a service to handle message production.

```java
package com.example.kafka.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${spring.kafka.topic.name}")
    private String topicName;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String message) {
        kafkaTemplate.send(topicName, message);
        System.out.println("Produced message: " + message);
    }
}
```

---

#### 5. **REST Controller**

Create a REST endpoint to produce messages.

```java
package com.example.kafka.controller;

import com.example.kafka.service.KafkaProducerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/kafka")
public class KafkaController {

    private final KafkaProducerService kafkaProducerService;

    public KafkaController(KafkaProducerService kafkaProducerService) {
        this.kafkaProducerService = kafkaProducerService;
    }

    @PostMapping("/publish")
    public String publish(@RequestParam("message") String message) {
        kafkaProducerService.sendMessage(message);
        return "Message sent to Kafka: " + message;
    }
}
```

---

#### 6. **Run Kafka Locally**

Use the **Docker Compose** setup from the earlier section to start Kafka on your local machine.

---

#### 7. **Run the Spring Boot Application**

Start the Spring Boot application:
```bash
mvn spring-boot:run
```

---

#### 8. **Test the Producer**

Use tools like `curl` or Postman to test the REST endpoint:

```bash
curl -X POST "http://localhost:8080/api/v1/kafka/publish?message=HelloKafka"
```

You should see the output:
```
Produced message: HelloKafka
```

The message will be sent to the Kafka topic named `my-topic`.

---

This project serves as a basic producer. You can extend it to handle more advanced use cases like sending complex messages, using custom serializers, or handling Kafka-specific configurations.