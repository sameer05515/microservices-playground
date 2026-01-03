package com.p.backend.controller;

import com.p.backend.dto.SearchResponse;
import com.p.backend.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "Search directories and topics by name/title")
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    @Operation(summary = "Search all", description = "Search both directories and topics by query string")
    public ResponseEntity<SearchResponse> searchAll(@RequestParam String q) {
        SearchResponse response = searchService.searchAll(q);
        return ResponseEntity.ok(response);
    }
}

