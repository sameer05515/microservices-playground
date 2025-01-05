# can we send message of type other than String, say a json or object type

Yes, you can send messages of types other than `String`, such as JSON objects or custom Java objects, in Kafka. To achieve this, you need to configure appropriate serializers and deserializers for your producer and consumer. Here's how you can do it:

---

### **Sending JSON or Object Messages in Kafka**

### **1. Add Dependencies**
Add Jackson dependency to your `pom.xml` for JSON serialization and deserialization.

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

---

### **2. Define a Model Class**
Create a class representing the data structure you want to send.

```java
package com.example.kafka;

public class TripPlan {
    private String city;
    private String hotel;
    private double budget;

    // Constructors
    public TripPlan(String city, String hotel, double budget) {
        this.city = city;
        this.hotel = hotel;
        this.budget = budget;
    }

    public TripPlan() {}

    // Getters and Setters
    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getHotel() {
        return hotel;
    }

    public void setHotel(String hotel) {
        this.hotel = hotel;
    }

    public double getBudget() {
        return budget;
    }

    public void setBudget(double budget) {
        this.budget = budget;
    }

    @Override
    public String toString() {
        return "TripPlan{" +
                "city='" + city + '\'' +
                ", hotel='" + hotel + '\'' +
                ", budget=" + budget +
                '}';
    }
}
```

---

### **3. Configure JSON Serializer and Deserializer**

#### **3.1 Producer Config (JSON Serializer)**

Use Kafka's `JsonSerializer` for the producer.

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, TripPlan> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(org.apache.kafka.clients.producer.ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(org.apache.kafka.clients.producer.ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, org.apache.kafka.common.serialization.StringSerializer.class);
        config.put(org.apache.kafka.clients.producer.ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, TripPlan> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
```

---

#### **3.2 Consumer Config (JSON Deserializer)**

Use Kafka's `JsonDeserializer` for the consumer.

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, TripPlan> consumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(org.apache.kafka.clients.consumer.ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(org.apache.kafka.clients.consumer.ConsumerConfig.GROUP_ID_CONFIG, "json-group");
        config.put(org.apache.kafka.clients.consumer.ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, org.apache.kafka.common.serialization.StringDeserializer.class);
        config.put(org.apache.kafka.clients.consumer.ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        config.put(org.apache.kafka.clients.consumer.ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        JsonDeserializer<TripPlan> deserializer = new JsonDeserializer<>(TripPlan.class);
        deserializer.addTrustedPackages("*");
        config.put(JsonDeserializer.TRUSTED_PACKAGES, "*");

        return new DefaultKafkaConsumerFactory<>(config, new org.apache.kafka.common.serialization.StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, TripPlan> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, TripPlan> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }
}
```

---

### **4. Modify Producer and Consumer**

#### **4.1 Producer**
Modify the producer to send an object of type `TripPlan`.

```java
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class TripProducer {
    private final KafkaTemplate<String, TripPlan> kafkaTemplate;

    public TripProducer(KafkaTemplate<String, TripPlan> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendTripPlan(TripPlan tripPlan) {
        kafkaTemplate.send("trip-plans", tripPlan);
        System.out.println("Sent to trip-plans: " + tripPlan);
    }
}
```

#### **4.2 Consumer**
Modify the consumer to receive objects of type `TripPlan`.

```java
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class TripConsumer {

    @KafkaListener(topics = "trip-plans", groupId = "json-group", containerFactory = "kafkaListenerContainerFactory")
    public void consumeTripPlan(TripPlan tripPlan) {
        System.out.println("Consumed from trip-plans: " + tripPlan);
    }
}
```

---

### **5. Testing**
1. Start Kafka.
2. Run the Spring Boot application.
3. Create and send a `TripPlan` object in the main application:

```java
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KafkaJsonDemoApplication implements CommandLineRunner {

    private final TripProducer tripProducer;

    public KafkaJsonDemoApplication(TripProducer tripProducer) {
        this.tripProducer = tripProducer;
    }

    public static void main(String[] args) {
        SpringApplication.run(KafkaJsonDemoApplication.class, args);
    }

    @Override
    public void run(String... args) {
        TripPlan tripPlan = new TripPlan("Goa", "XYZ Resort", 20000);
        tripProducer.sendTripPlan(tripPlan);
    }
}
```

---

### **6. Console Output**
You will see the producer sending the `TripPlan` object as JSON, and the consumer receiving and printing it:

```plaintext
Sent to trip-plans: TripPlan{city='Goa', hotel='XYZ Resort', budget=20000.0}
Consumed from trip-plans: TripPlan{city='Goa', hotel='XYZ Resort', budget=20000.0}
```

This demonstrates how to work with JSON or custom objects in Kafka using Spring Boot!

# Some error resolution

```
tMessageApplication.java:10) ~[classes/:na]      
Caused by: java.lang.IllegalStateException: JsonDeserializer must be configured with property setters, or via configuration properties; not both
        at org.springframework.util.Assert.state(Assert.java:79) ~[spring-core-6.2.0.jar:6.2.0]
        at org.springframework.kafka.support.serializer.JsonDeserializer.configure(JsonDeserializer.java:404) ~[spring-kafka-3.3.0.jar:3.3.0]
        at org.springframework.kafka.core.DefaultKafkaConsumerFactory.valueDeserializer(DefaultKafkaConsumerFactory.java:488) ~[spring-kafka-3.3.0.jar:3.3.0]
        at org.springframework.kafka.core.DefaultKafkaConsumerFactory$ExtendedKafkaConsumer.<init>(DefaultKafkaConsumerFactory.java:498) ~[spring-kafka-3.3.0.jar:3.3.0]
        at org.springframework.kafka.core.DefaultKafkaConsumerFactory.createRawConsumer(DefaultKafkaConsumerFactory.java:453) ~[spring-kafka-3.3.0.jar:3.3.0]
        at org.springframework.kafka.core.DefaultKafkaConsumerFactory.createKafkaConsumer(DefaultKafkaConsumerFactory.java:430) ~[spring-kafka-3.3.0.jar:3.3.0]
        at org.springframework.kafka.core.DefaultKafkaConsumerFactory.createConsumerWithAdjustedProperties(DefaultKafkaConsumerFactory.java:407) ~[spring-kafka-3.3.0.jar:3.3.0]   
        at org.springframework.kafka.core.DefaultKafkaConsumerFactory.createKafkaConsumer(DefaultKafkaConsumerFactory.java:374) ~[spring-kafka-3.3.0.jar:3.3.0]
        at org.springframework.kafka.core.DefaultKafkaConsumerFactory.createConsumer(DefaultKafkaConsumerFactory.java:335) ~[spring-kafka-3.3.0.jar:3.3.0]
        at org.springframework.kafka.listener.KafkaMessageListenerContainer$ListenerConsumer.<init>(KafkaMessageListenerContainer.java:874) ~[spring-kafka-3.3.0.jar:3.3.0]        
        at org.springframework.kafka.listener.KafkaMessageListenerContainer.doStart(KafkaMessageListenerContainer.java:385) ~[spring-kafka-3.3.0.jar:3.3.0]
        at org.springframework.kafka.listener.AbstractMessageListenerContainer.start(AbstractMessageListenerContainer.java:520) ~[spring-kafka-3.3.0.jar:3.3.0]
        at org.springframework.kafka.listener.ConcurrentMessageListenerContainer.doStart(ConcurrentMessageListenerContainer.java:264) ~[spring-kafka-3.3.0.jar:3.3.0]
        at org.springframework.kafka.listener.AbstractMessageListenerContainer.start(AbstractMessageListenerContainer.java:520) ~[spring-kafka-3.3.0.jar:3.3.0]
        at org.springframework.kafka.config.KafkaListenerEndpointRegistry.startIfNecessary(KafkaListenerEndpointRegistry.java:436) ~[spring-kafka-3.3.0.jar:3.3.0]
        at org.springframework.kafka.config.KafkaListenerEndpointRegistry.start(KafkaListenerEndpointRegistry.java:382) ~[spring-kafka-3.3.0.jar:3.3.0]
        at org.springframework.context.support.DefaultLifecycleProcessor.doStart(DefaultLifecycleProcessor.java:323) ~[spring-context-6.2.0.jar:6.2.0]
        ... 13 common frames omitted


```


The error indicates a conflict in the configuration of `JsonDeserializer`. This typically happens when the deserializer is set both programmatically and through properties (e.g., `spring.kafka.consumer.value-deserializer` in `application.yml` or programmatically via code). 

To resolve this issue, you need to pick **one approach** to configure the deserializer: either use **code-based configuration** or use **application properties**. Below are the corrected approaches.

---

### **Solution 1: Fully Programmatic Configuration**

If you're setting up the deserializer programmatically, ensure you don't mix it with properties. Remove `spring.kafka.consumer.value-deserializer` or any related configuration from `application.yml`.

```java
@Bean
public ConsumerFactory<String, TripPlan> consumerFactory() {
    Map<String, Object> config = new HashMap<>();
    config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
    config.put(ConsumerConfig.GROUP_ID_CONFIG, "json-group");
    config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
    config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);

    JsonDeserializer<TripPlan> deserializer = new JsonDeserializer<>(TripPlan.class);
    deserializer.addTrustedPackages("*");
    
    return new DefaultKafkaConsumerFactory<>(config, new StringDeserializer(), deserializer);
}
```

---

### **Solution 2: Fully Properties-Based Configuration**

If you prefer to configure via `application.yml`, remove any programmatic deserializer setup and configure `JsonDeserializer` directly through properties.

#### Update `application.yml`:

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: json-group
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "*"
```

#### Simplify the Consumer Config:

```java
@Bean
public ConcurrentKafkaListenerContainerFactory<String, TripPlan> kafkaListenerContainerFactory(ConsumerFactory<String, TripPlan> consumerFactory) {
    ConcurrentKafkaListenerContainerFactory<String, TripPlan> factory = new ConcurrentKafkaListenerContainerFactory<>();
    factory.setConsumerFactory(consumerFactory);
    return factory;
}
```

---

### **Solution 3: Hybrid Approach (Recommended for Fine-Grained Control)**

You can use a mix of properties and programmatic configuration but avoid duplicating the same settings. Set general configurations in `application.yml` while programmatically adding advanced settings, like trusted packages.

#### Update `application.yml`:

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: json-group
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
```

#### Update the Config Class:

```java
@Bean
public ConsumerFactory<String, TripPlan> consumerFactory() {
    JsonDeserializer<TripPlan> deserializer = new JsonDeserializer<>(TripPlan.class);
    deserializer.addTrustedPackages("*");
    return new DefaultKafkaConsumerFactory<>(
        Map.of(
            ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092",
            ConsumerConfig.GROUP_ID_CONFIG, "json-group",
            ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest",
            ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class
        ),
        new StringDeserializer(),
        deserializer
    );
}
```

---

### Common Pitfalls to Avoid

1. **Mixing Configuration Styles**:
   - Avoid defining `JsonDeserializer` both in `application.yml` and in the Java configuration.
   
2. **Trusted Packages Not Set**:
   - Always set the trusted packages for `JsonDeserializer` to avoid security issues. Use `*` for development, but in production, restrict it to your package(s).

3. **Ensure Matching Serializers/Deserializers**:
   - If the producer sends a JSON object using `JsonSerializer`, ensure the consumer uses `JsonDeserializer`.

---

### Validation
After applying the fix:
1. Restart Kafka brokers.
2. Run the application.
3. Ensure that both producer and consumer properly handle the custom `TripPlan` object. 

If you encounter any further issues, let me know! 🚀