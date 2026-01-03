package com.iagent.javaservice.controller;

import com.iagent.javaservice.dto.CreateJavaServiceRequest;
import com.iagent.javaservice.dto.JavaServiceResponse;
import com.iagent.javaservice.service.JavaServiceManager;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/java-services")
public class JavaServiceController {
    private final JavaServiceManager manager;
    public JavaServiceController(JavaServiceManager manager) { this.manager = manager; }

    @PostMapping
    public ResponseEntity<JavaServiceResponse> create(@Valid @RequestBody CreateJavaServiceRequest request) {
        return ResponseEntity.ok(manager.create(request));
    }

    @GetMapping
    public ResponseEntity<List<JavaServiceResponse>> getAll() {
        return ResponseEntity.ok(manager.getAll());
    }
}
