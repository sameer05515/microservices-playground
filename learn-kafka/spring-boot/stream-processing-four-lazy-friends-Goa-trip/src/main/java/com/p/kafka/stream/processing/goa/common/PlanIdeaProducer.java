package com.p.kafka.stream.processing.goa.common;

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
