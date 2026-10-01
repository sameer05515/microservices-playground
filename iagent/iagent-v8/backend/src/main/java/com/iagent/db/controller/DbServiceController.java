package com.iagent.db.controller;

import com.iagent.db.dto.CreateDbServiceRequest;
import com.iagent.db.dto.DbQueryResponse;
import com.iagent.db.dto.DbServiceResponse;
import com.iagent.db.service.DbServiceManager;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public List<DbServiceResponse> list() {
        return manager.list();
    }

    @PostMapping("/{serviceId}/execute")
    public DbQueryResponse execute(@PathVariable String serviceId) {
        return manager.execute(serviceId);
    }
}
