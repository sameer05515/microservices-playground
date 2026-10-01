package com.iagent.db.controller;

import com.iagent.db.dto.ConnectionTestResponse;
import com.iagent.db.dto.DbConnectionRequest;
import com.iagent.db.dto.DbConnectionResponse;
import com.iagent.db.service.DbConnectionManager;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/db-connections")
public class DbConnectionController {

    private final DbConnectionManager manager;

    public DbConnectionController(DbConnectionManager manager) {
        this.manager = manager;
    }

    @PostMapping("/test")
    public ConnectionTestResponse test(
            @Valid @RequestBody DbConnectionRequest request) {
        return manager.test(request);
    }

    @PostMapping
    public DbConnectionResponse create(
            @Valid @RequestBody DbConnectionRequest request) {
        return manager.create(request);
    }

    @GetMapping
    public List<DbConnectionResponse> list() {
        return manager.list();
    }
}
