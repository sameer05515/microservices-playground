package com.p.backend.controller;

import com.p.backend.dto.TopicRequest;
import com.p.backend.dto.TopicResponse;
import com.p.backend.dto.UpdateTopicRequest;
import com.p.backend.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@Tag(name = "Topic Management", description = "APIs for managing topics under directories")
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    @Operation(summary = "Create a new topic", description = "Create a topic under a directory or sub-directory")
    public ResponseEntity<TopicResponse> createTopic(@Valid @RequestBody TopicRequest request) {
        TopicResponse response = topicService.createTopic(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get topic by ID")
    public ResponseEntity<TopicResponse> getTopicById(@PathVariable String id) {
        TopicResponse response = topicService.getTopicById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/directory/{directoryId}")
    @Operation(summary = "Get topics by directory", description = "Get all topics under a specific directory")
    public ResponseEntity<List<TopicResponse>> getTopicsByDirectory(@PathVariable String directoryId) {
        List<TopicResponse> responses = topicService.getTopicsByDirectory(directoryId);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update topic", description = "Update topic title and/or content")
    public ResponseEntity<TopicResponse> updateTopic(
            @PathVariable String id,
            @Valid @RequestBody UpdateTopicRequest request) {
        TopicResponse response = topicService.updateTopic(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete topic", description = "Soft delete a topic")
    public ResponseEntity<Void> deleteTopic(@PathVariable String id) {
        topicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }
}

