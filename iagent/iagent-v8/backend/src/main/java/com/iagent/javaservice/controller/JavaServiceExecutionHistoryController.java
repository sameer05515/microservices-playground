package com.iagent.javaservice.controller;

import com.iagent.javaservice.history.JavaServiceExecutionLog;
import com.iagent.javaservice.history.JavaServiceExecutionLogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/java-services")
public class JavaServiceExecutionHistoryController {

    private final JavaServiceExecutionLogRepository repository;

    public JavaServiceExecutionHistoryController(
            JavaServiceExecutionLogRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/execution-history")
    public List<JavaServiceExecutionLog> getAll() {
        return repository.findTop100ByOrderByExecutedAtDesc();
    }

    @GetMapping("/{serviceId}/execution-history")
    public List<JavaServiceExecutionLog> getByService(
            @PathVariable String serviceId) {

        return repository.findTop100ByServiceIdOrderByExecutedAtDesc(serviceId);
    }
}
