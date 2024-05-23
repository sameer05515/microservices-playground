package com.p.kafka.stream.processing.custom.object.controller;

import com.p.kafka.stream.processing.custom.object.common.TripPlan;
import com.p.kafka.stream.processing.custom.object.common.TripProducer;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/kafka")
public class KafkaController {
    private final TripProducer tripProducer;

    public KafkaController(TripProducer tripProducer) {
        this.tripProducer = tripProducer;
    }

    @PostMapping("plan")
    public String publish(@RequestParam(name = "place", defaultValue = "Sonagachi") String place) {
////        kafkaProducerService.sendMessage(message);
//        tripProducer.sendIdea("Let's go to "+place+" !!");
//        return "Tour plan started for place: " + place;
        TripPlan tripPlan = new TripPlan(place, "XYZ Resort", 20000);
        tripProducer.sendTripPlan(tripPlan);
        return "Tour plan started for place: " + place;
    }


}
