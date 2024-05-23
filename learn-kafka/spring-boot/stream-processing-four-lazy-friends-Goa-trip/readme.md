# Simulation for Kafka topics: For `stream processing` or `message routing`: The Great Goa Plan: Lazy Friends' Epic Holiday

Here’s the story of **four lazy friends** planning a holiday in Goa. Each friend lives in a different city (Delhi, Mumbai, Kolkata, and Chennai). The story is divided into phases of communication that can later be mapped to **Kafka topics** for simulation.

---

### **The Story**

#### **Characters**
1. **Rohan** (Delhi) - The *Initiator*: Comes up with the Goa plan but doesn't follow up.
2. **Arjun** (Mumbai) - The *Researcher*: Finds accommodations and activities but delays sharing.
3. **Priya** (Kolkata) - The *Budgeter*: Calculates costs but keeps procrastinating on finalizing.
4. **Sneha** (Chennai) - The *Coordinator*: Coordinates dates but forgets to confirm bookings.

---

#### **Act 1: The Goa Idea (Topic: `plan-idea`)**

- One lazy evening, **Rohan** sends a message to the group chat:
  > "Hey, let's go to Goa next month! 😎"
- Everyone gets excited but doesn’t respond for two days.
- Finally, **Arjun** replies:
  > "Sounds great. I’ll look into hotels."
- The others agree in principle but don’t take further action.

---

#### **Act 2: Accommodation Research (Topic: `hotel-research`)**

- After another week, **Arjun** finds a few hotels but doesn’t share the details immediately.
- **Priya** pokes him in the chat:
  > "Arjun, any updates on the hotels? 🏨"
- Arjun replies:
  > "Oh, yeah. I found some options. Will send them tomorrow."
- "Tomorrow" turns into three more days.

---

#### **Act 3: Budget Discussions (Topic: `budget-planning`)**

- **Priya** eventually starts calculating the budget:
  - Travel: Flights/train tickets
  - Accommodation: Based on Arjun’s half-shared list
  - Food and activities
- She posts a rough estimate in the group:
  > "Guys, I think it'll cost ₹15,000 per person."
- The others reply with thumbs-up emojis but don’t discuss how to split expenses or who will book tickets.

---

#### **Act 4: Dates and Coordination (Topic: `trip-coordination`)**

- **Sneha** steps in to decide on the dates.
  > "Okay, let’s finalize: 15th to 20th next month. Does that work?"
- After a 5-day delay, everyone agrees on the dates.

---

#### **Act 5: Last-Minute Panic (Topic: `final-bookings`)**

- With only a week left, **Sneha** realizes no one has booked anything.
  > "Guys, did anyone book flights or hotels? 😬"
- A flurry of messages ensues, with everyone blaming each other.
- Finally, Sneha books the flights, Priya books the hotel, and Arjun sends the list of activities.

---

#### **Act 6: The Goa Holiday**

- The four friends make it to Goa, slightly over budget and a little late but still have an amazing time.
- They promise to be more organized next time—but never are.

---

### **Kafka Topics Simulation**

The story can be simulated using **Kafka topics** to represent different stages of planning. Here’s a mapping:

| **Topic Name**          | **Purpose**                                                    | **Producer**       | **Consumer**           |
|--------------------------|---------------------------------------------------------------|---------------------|-------------------------|
| `plan-idea`             | Rohan announces the trip idea                                 | Rohan              | Arjun, Priya, Sneha     |
| `hotel-research`        | Arjun shares hotel options                                    | Arjun              | Priya, Sneha           |
| `budget-planning`       | Priya shares budget details                                   | Priya              | Rohan, Arjun, Sneha     |
| `trip-coordination`     | Sneha coordinates dates                                       | Sneha              | Rohan, Arjun, Priya     |
| `final-bookings`        | Last-minute panic messages and final booking confirmations    | All                | All                     |

---

### **Simulating with Kafka**

1. **Produce Messages**: 
   - Each character produces messages on the relevant topic. For example:
     - Rohan produces a message to `plan-idea`: *"Let's go to Goa!"*.
     - Arjun produces to `hotel-research`: *"Found XYZ hotel."*.
   
2. **Consume Messages**:
   - Consumers subscribe to relevant topics to simulate the flow of information between friends.
   
3. **Processing**:
   - Use a Spring Boot Kafka application where:
     - Each friend is a **consumer** of specific topics.
     - Messages from one topic trigger actions that produce messages to another topic.

---

### **Implementation Example**

#### Kafka Topics
```bash
# Create topics
docker-compose exec kafka kafka-topics --create --topic plan-idea --bootstrap-server localhost:9092
docker-compose exec kafka kafka-topics --create --topic hotel-research --bootstrap-server localhost:9092
docker-compose exec kafka kafka-topics --create --topic budget-planning --bootstrap-server localhost:9092
docker-compose exec kafka kafka-topics --create --topic trip-coordination --bootstrap-server localhost:9092
docker-compose exec kafka kafka-topics --create --topic final-bookings --bootstrap-server localhost:9092
```

#### Sample Kafka Message Flow
- **`plan-idea`**:
  ```json
  { "from": "Rohan", "message": "Let's go to Goa!" }
  ```
- **`hotel-research`**:
  ```json
  { "from": "Arjun", "message": "Found XYZ hotel." }
  ```
- **`budget-planning`**:
  ```json
  { "from": "Priya", "message": "Estimated cost: ₹15,000." }
  ```
- **`trip-coordination`**:
  ```json
  { "from": "Sneha", "message": "Finalized dates: 15th-20th next month." }
  ```
- **`final-bookings`**:
  ```json
  { "from": "Sneha", "message": "Flights and hotel booked." }
  ```

This framework can be expanded into a **Spring Boot Kafka producer-consumer setup**, where each stage corresponds to a different Kafka topic and message exchange simulates the story.


#  The complete implementation code for simulating the four lazy friends' Goa trip planning using Kafka and Spring Boot.

Here's the complete implementation code for simulating the **four lazy friends' Goa trip planning** using **Kafka** and **Spring Boot**. Each stage of the plan corresponds to a Kafka topic. The messages flow between Kafka producers and consumers to mimic the story.

---

### **Project Structure**

```
src/main/java/com/example/kafka
├── KafkaConfig.java          # Common Kafka configuration
├── PlanIdeaProducer.java     # Produces messages to `plan-idea`
├── HotelResearchConsumer.java # Consumes from `plan-idea` and produces to `hotel-research`
├── BudgetPlanningConsumer.java # Consumes from `hotel-research` and produces to `budget-planning`
├── TripCoordinationConsumer.java # Consumes from `budget-planning` and produces to `trip-coordination`
├── FinalBookingConsumer.java # Consumes from `trip-coordination` to finalize the trip
├── KafkaDemoApplication.java # Main application
```

---

### **1. Add Dependencies**

Update your `pom.xml`:

```xml
<dependencies>
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

### **2. Common Kafka Configuration**

```java
package com.example.kafka;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
public class KafkaConfig {

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

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "planning-group");
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

### **3. Producer and Consumers**

#### 3.1 `PlanIdeaProducer`
Produces messages to the `plan-idea` topic.

```java
package com.example.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PlanIdeaProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;

    public PlanIdeaProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendIdea(String message) {
        kafkaTemplate.send("plan-idea", message);
        System.out.println("Sent to plan-idea: " + message);
    }
}
```

#### 3.2 `HotelResearchConsumer`
Consumes messages from `plan-idea` and produces to `hotel-research`.

```java
package com.example.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class HotelResearchConsumer {
    private final KafkaTemplate<String, String> kafkaTemplate;

    public HotelResearchConsumer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "plan-idea", groupId = "planning-group")
    public void consumeIdea(String message) {
        System.out.println("Consumed from plan-idea: " + message);
        String hotelMessage = "Hotel research: Found XYZ hotel based on Rohan's plan.";
        kafkaTemplate.send("hotel-research", hotelMessage);
        System.out.println("Sent to hotel-research: " + hotelMessage);
    }
}
```

#### 3.3 `BudgetPlanningConsumer`
Consumes messages from `hotel-research` and produces to `budget-planning`.

```java
package com.example.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class BudgetPlanningConsumer {
    private final KafkaTemplate<String, String> kafkaTemplate;

    public BudgetPlanningConsumer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "hotel-research", groupId = "planning-group")
    public void consumeHotelResearch(String message) {
        System.out.println("Consumed from hotel-research: " + message);
        String budgetMessage = "Budget: Estimated cost is ₹15,000 per person.";
        kafkaTemplate.send("budget-planning", budgetMessage);
        System.out.println("Sent to budget-planning: " + budgetMessage);
    }
}
```

#### 3.4 `TripCoordinationConsumer`
Consumes messages from `budget-planning` and produces to `trip-coordination`.

```java
package com.example.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class TripCoordinationConsumer {
    private final KafkaTemplate<String, String> kafkaTemplate;

    public TripCoordinationConsumer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "budget-planning", groupId = "planning-group")
    public void consumeBudget(String message) {
        System.out.println("Consumed from budget-planning: " + message);
        String coordinationMessage = "Dates finalized: 15th to 20th next month.";
        kafkaTemplate.send("trip-coordination", coordinationMessage);
        System.out.println("Sent to trip-coordination: " + coordinationMessage);
    }
}
```

#### 3.5 `FinalBookingConsumer`
Consumes messages from `trip-coordination`.

```java
package com.example.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class FinalBookingConsumer {

    @KafkaListener(topics = "trip-coordination", groupId = "planning-group")
    public void consumeTripCoordination(String message) {
        System.out.println("Consumed from trip-coordination: " + message);
        System.out.println("Finalized bookings: Flights and hotels booked!");
    }
}
```

---

### **4. Main Application**

```java
package com.example.kafka;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KafkaDemoApplication implements CommandLineRunner {

    private final PlanIdeaProducer planIdeaProducer;

    public KafkaDemoApplication(PlanIdeaProducer planIdeaProducer) {
        this.planIdeaProducer = planIdeaProducer;
    }

    public static void main(String[] args) {
        SpringApplication.run(KafkaDemoApplication.class, args);
    }

    @Override
    public void run(String... args) {
        planIdeaProducer.sendIdea("Let's go to Goa!");
    }
}
```

---

### **5. Running the Application**

1. Start Kafka (using Docker or other methods).
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```
3. Observe the logs as messages flow through the topics:
   - `plan-idea` → `hotel-research` → `budget-planning` → `trip-coordination` → **final bookings**.

Each consumer processes its topic and produces a new message to the next stage!