package com.prem.duplicatefinder.controller;

import com.prem.duplicatefinder.model.DuplicateScanResponse;
import com.prem.duplicatefinder.model.ScanRequest;
import com.prem.duplicatefinder.service.DuplicateFileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/duplicates")
public class DuplicateFileController {

    private final DuplicateFileService service;

    public DuplicateFileController(DuplicateFileService service) {
        this.service = service;
    }

    @PostMapping("/scan")
    public ResponseEntity<DuplicateScanResponse> scan(@Valid @RequestBody ScanRequest request)
            throws Exception {
        return ResponseEntity.ok(service.findDuplicates(request.rootPath()));
    }
}
