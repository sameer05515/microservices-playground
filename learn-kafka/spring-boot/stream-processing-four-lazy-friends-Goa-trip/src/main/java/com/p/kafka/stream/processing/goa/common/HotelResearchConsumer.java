package com.p.kafka.stream.processing.goa.common;

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
