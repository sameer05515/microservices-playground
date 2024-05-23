package com.p.kafka.stream.processing.custom.object.common;

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
