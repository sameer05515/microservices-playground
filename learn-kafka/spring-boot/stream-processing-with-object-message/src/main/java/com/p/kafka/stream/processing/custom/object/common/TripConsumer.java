package com.p.kafka.stream.processing.custom.object.common;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class TripConsumer {

    @KafkaListener(topics = "trip-plans", groupId = "json-group", containerFactory = "kafkaListenerContainerFactory")
    public void consumeTripPlan(TripPlan tripPlan) {
        System.out.println("Consumed from trip-plans: " + tripPlan);
    }
}
