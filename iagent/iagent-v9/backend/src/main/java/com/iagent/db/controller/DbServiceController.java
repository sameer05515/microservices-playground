package com.iagent.db.controller;

import com.iagent.db.dto.CreateDbServiceRequest;
import com.iagent.db.dto.DbQueryResponse;
import com.iagent.db.dto.DbServiceResponse;
import com.iagent.db.dto.TestDbServiceRequest;
import com.iagent.db.service.DbServiceManager;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/db-services")
public class DbServiceController {

    private final DbServiceManager manager;

    public DbServiceController(DbServiceManager manager) {
        this.manager = manager;
    }

    @PostMapping
    public DbServiceResponse create(
            @Valid @RequestBody CreateDbServiceRequest request) {
        return manager.create(request);
    }

    @PostMapping("/test")
    public DbQueryResponse test(
            @Valid @RequestBody TestDbServiceRequest request) {
        return manager.test(request);
    }

    @GetMapping
    public List<DbServiceResponse> list() {
        return manager.list();
    }

    @GetMapping("/{serviceId}")
    public DbServiceResponse details(@PathVariable String serviceId) {
        return manager.details(serviceId);
    }

    @PostMapping("/{serviceId}/execute")
    public DbQueryResponse execute(
            @PathVariable String serviceId,
            @RequestBody(required = false) Map<String, Object> parameters) {
        return manager.execute(serviceId, parameters);
    }
}
