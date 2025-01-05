package com.p.kafka.stream.processing.goa.common;

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
