Here’s how to create a **Spring Boot project** to consume messages from an **Apache Kafka** topic. The project will use Spring Boot's `spring-kafka` dependency to create a Kafka consumer.

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
    consumer:
      group-id: kafka-consumer-group
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      auto-offset-reset: earliest
    topic:
      name: my-topic
```

---

#### 3. **Consumer Configuration**

Create a `KafkaConsumerConfig` class to define the Kafka consumer.

```java
package com.example.kafka.config;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "kafka-consumer-group");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        return new DefaultKafkaConsumerFactory<>(config);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }
}
```

---

#### 4. **Consumer Service**

Create a service to handle message consumption using the `@KafkaListener` annotation.

```java
package com.example.kafka.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "${spring.kafka.topic.name}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeMessage(String message) {
        System.out.println("Consumed message: " + message);
    }
}
```

---

#### 5. **Test the Consumer**

1. **Start the Kafka Producer**: Use the project you created earlier to send messages to the Kafka topic `my-topic`.
2. **Run the Consumer Application**:
   Start the Spring Boot consumer application:
   ```bash
   mvn spring-boot:run
   ```

3. **Send Messages to Kafka**:
   Use the Kafka producer or REST API created earlier to publish messages to the topic.

   For example:
   ```bash
   curl -X POST "http://localhost:8080/api/v1/kafka/publish?message=HelloKafka"
   ```

4. **Check the Consumer Logs**:
   The consumer application will log the consumed messages:
   ```
   Consumed message: HelloKafka
   ```

---

### Notes:

- **Auto Offset Reset**: The `earliest` setting ensures the consumer starts reading from the beginning of the topic if no previous offset is committed.
- **Consumer Group**: Multiple consumers in the same group share the workload of consuming messages from partitions.

This project can be extended with error handling, message acknowledgment, or consuming JSON messages using custom deserializers. Let me know if you need additional features!