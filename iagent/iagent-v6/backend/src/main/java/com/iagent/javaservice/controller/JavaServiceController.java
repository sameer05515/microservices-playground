package com.iagent.javaservice.controller;

import com.iagent.javaservice.dto.CreateJavaServiceRequest;
import com.iagent.javaservice.dto.ExecuteJavaServiceRequest;
import com.iagent.javaservice.dto.ExecuteJavaServiceResponse;
import com.iagent.javaservice.dto.JavaServiceResponse;
import com.iagent.javaservice.service.JavaServiceExecutor;
import com.iagent.javaservice.model.JavaService;
import com.iagent.javaservice.repository.JavaServiceRepository;
import com.iagent.javaservice.service.JavaServiceManager;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/java-services")
public class JavaServiceController {
    private final JavaServiceManager manager;
    private final JavaServiceExecutor executor;
    private final JavaServiceRepository repository;

    public JavaServiceController(JavaServiceManager manager, JavaServiceExecutor executor, JavaServiceRepository repository) {
        this.manager = manager;
        this.executor = executor;
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<JavaServiceResponse> create(@Valid @RequestBody CreateJavaServiceRequest request) {
        return ResponseEntity.ok(manager.create(request));
    }

    @GetMapping
    public ResponseEntity<List<JavaServiceResponse>> getAll() {
        return ResponseEntity.ok(manager.getAll());
    }

    @PostMapping("/runtime/{servicePath}")
    public ResponseEntity<ExecuteJavaServiceResponse> executeByEndpoint(
            @PathVariable String servicePath,
            @RequestBody(required = false) ExecuteJavaServiceRequest request) {

        String endpoint = "/" + servicePath;
        JavaService service = repository.findAll().stream()
                .filter(JavaService::isEnabled)
                .filter(item -> endpoint.equals(item.getEndpointPath()))
                .findFirst()
                .orElseThrow(() -> new com.iagent.common.ResourceNotFoundException(
                        "No enabled JavaService found for endpoint: " + endpoint));

        return ResponseEntity.ok(executor.execute(service.getId(), request));
    }

    @PostMapping("/{serviceId}/execute")
    public ResponseEntity<ExecuteJavaServiceResponse> execute(
            @PathVariable String serviceId,
            @RequestBody(required = false) ExecuteJavaServiceRequest request) {
        return ResponseEntity.ok(executor.execute(serviceId, request));
    }
}
