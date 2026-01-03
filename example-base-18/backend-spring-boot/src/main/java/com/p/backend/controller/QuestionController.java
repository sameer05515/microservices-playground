package com.p.backend.controller;

import com.p.backend.dto.QuestionRequest;
import com.p.backend.dto.QuestionResponse;
import com.p.backend.dto.UpdateQuestionRequest;
import com.p.backend.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@Tag(name = "Question Management", description = "APIs for managing questions under directories and topics")
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    @Operation(summary = "Create a new question", description = "Create a question under a directory or topic")
    public ResponseEntity<QuestionResponse> createQuestion(@Valid @RequestBody QuestionRequest request) {
        QuestionResponse response = questionService.createQuestion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get question by ID")
    public ResponseEntity<QuestionResponse> getQuestionById(@PathVariable String id) {
        QuestionResponse response = questionService.getQuestionById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/directory/{directoryId}")
    @Operation(summary = "Get questions by directory", description = "Get all questions under a specific directory")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByDirectory(@PathVariable String directoryId) {
        List<QuestionResponse> responses = questionService.getQuestionsByDirectory(directoryId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/topic/{topicId}")
    @Operation(summary = "Get questions by topic", description = "Get all questions under a specific topic")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByTopic(@PathVariable String topicId) {
        List<QuestionResponse> responses = questionService.getQuestionsByTopic(topicId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/parent/{parentId}")
    @Operation(summary = "Get questions by parent", description = "Get all questions under a parent (directory or topic)")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByParent(@PathVariable String parentId) {
        List<QuestionResponse> responses = questionService.getQuestionsByParent(parentId);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update question", description = "Update question text, description, answer, or tags")
    public ResponseEntity<QuestionResponse> updateQuestion(
            @PathVariable String id,
            @Valid @RequestBody UpdateQuestionRequest request) {
        QuestionResponse response = questionService.updateQuestion(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete question", description = "Soft delete a question")
    public ResponseEntity<Void> deleteQuestion(@PathVariable String id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}

