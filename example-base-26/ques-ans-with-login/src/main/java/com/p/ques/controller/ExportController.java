package com.p.ques.controller;

import com.p.ques.dto.ExportData;
import com.p.ques.service.ExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    private final ExportService exportService;

    public ExportController(
            ExportService exportService) {

        this.exportService = exportService;
    }

    @GetMapping
    public ResponseEntity<ExportData> exportAll() {

        ExportData data =
                exportService.exportAll();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=question-bank.json"
                )
                .contentType(
                        MediaType.APPLICATION_JSON
                )
                .body(data);
    }
}