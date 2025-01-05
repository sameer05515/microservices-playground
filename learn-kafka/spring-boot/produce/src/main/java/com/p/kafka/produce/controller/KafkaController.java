package com.p.kafka.produce.controller;

import com.p.kafka.produce.service.KafkaProducerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/kafka")
public class KafkaController {

    private final KafkaProducerService kafkaProducerService;

    public KafkaController(KafkaProducerService kafkaProducerService) {
        this.kafkaProducerService = kafkaProducerService;
    }

    @PostMapping("/publish")
    public String publish(@RequestParam("message") String message) {
        kafkaProducerService.sendMessage(message);
        return "Message sent to Kafka: " + message;
    }
}
