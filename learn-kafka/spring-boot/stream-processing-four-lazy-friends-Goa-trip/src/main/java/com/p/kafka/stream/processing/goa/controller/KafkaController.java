package com.p.kafka.stream.processing.goa.controller;

import com.p.kafka.stream.processing.goa.common.PlanIdeaProducer;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/kafka")
public class KafkaController {
    private final PlanIdeaProducer planIdeaProducer;

    public KafkaController(PlanIdeaProducer planIdeaProducer) {
        this.planIdeaProducer = planIdeaProducer;
    }

    @PostMapping("plan")
    public String publish(@RequestParam(name = "place", defaultValue = "Sonagachi") String place) {
//        kafkaProducerService.sendMessage(message);
        planIdeaProducer.sendIdea("Let's go to "+place+" !!");
        return "Tour plan started for place: " + place;
    }

}
