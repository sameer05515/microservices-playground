package com.p.kafka.stream.processing.goa.common;

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
