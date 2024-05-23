package com.p.kafka.stream.processing.goa.common;

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
