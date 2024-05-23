Here’s how to set up **Apache Kafka** using Docker for local development or testing.

---

### Prerequisites:
1. **Install Docker**: Make sure Docker is installed and running on your machine.
2. **Docker Compose**: You’ll need `docker-compose` to orchestrate multiple containers.

---

### Step-by-Step Guide

1. **Create a `docker-compose.yml` File**
   Save the following configuration in a file named `docker-compose.yml`.

   ```yaml
   version: '3.8'
   services:
     zookeeper:
       image: confluentinc/cp-zookeeper:7.5.0
       container_name: zookeeper
       ports:
         - "2181:2181"
       environment:
         ZOOKEEPER_CLIENT_PORT: 2181
         ZOOKEEPER_TICK_TIME: 2000

     kafka:
       image: confluentinc/cp-kafka:7.5.0
       container_name: kafka
       ports:
         - "9092:9092"
       environment:
         KAFKA_BROKER_ID: 1
         KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
         KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
         KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
       depends_on:
         - zookeeper
   ```

2. **Start Kafka and Zookeeper**
   Run the following command in the same directory as your `docker-compose.yml`:

   ```bash
   docker-compose up -d
   ```

   This will:
   - Start **Zookeeper** (port 2181)
   - Start **Kafka** (port 9092)

3. **Verify Kafka is Running**
   You can check the running containers:

   ```bash
   docker ps
   ```

   You should see `zookeeper` and `kafka` containers running.

4. **Interact with Kafka**
   Use Kafka CLI tools to produce and consume messages.

   **Enter Kafka container:**
   ```bash
   docker exec -it kafka bash
   ```

   **Create a topic:**
   ```bash
   kafka-topics --create \
     --topic test-topic \
     --bootstrap-server localhost:9092 \
     --partitions 1 \
     --replication-factor 1
   ```

   **List topics:**
   ```bash
   kafka-topics --list --bootstrap-server localhost:9092
   ```

   **Produce a message:**
   ```bash
   kafka-console-producer --topic test-topic --bootstrap-server localhost:9092
   ```
   Type some messages and press `Enter`.

   **Consume messages:**
   ```bash
   kafka-console-consumer --topic test-topic --bootstrap-server localhost:9092 --from-beginning
   ```

5. **Stop the Environment**
   To stop and clean up:

   ```bash
   docker-compose down
   ```

---

### Notes:
- **Kafka UI Tools**: You can add a Kafka management UI like **Kafdrop** or **Kafka UI** to visualize topics and messages.
- **Persistence**: To make Kafka data persistent, add volumes to the `docker-compose.yml` file.

---

Let me know if you need additional setup for advanced configurations or integrations!