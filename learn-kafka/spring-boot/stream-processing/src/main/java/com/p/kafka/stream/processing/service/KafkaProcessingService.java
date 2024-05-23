package com.p.kafka.stream.processing.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProcessingService {

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${spring.kafka.topic.output}")
    private String outputTopic;

    public KafkaProcessingService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "${spring.kafka.topic.input}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeAndProduce(String message) {
        System.out.println("Consumed message: " + message);

        // Transform or process the message if needed
        String processedMessage = message.toUpperCase();

        // Publish to a new topic
        kafkaTemplate.send(outputTopic, processedMessage);
        System.out.println("Produced message to topic '" + outputTopic + "': " + processedMessage);
    }
}
