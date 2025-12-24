package com.p.backend.controller;

import com.p.backend.dto.DirectoryRequest;
import com.p.backend.dto.DirectoryResponse;
import com.p.backend.dto.UpdateDirectoryRequest;
import com.p.backend.service.DirectoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/directories")
@RequiredArgsConstructor
@Tag(name = "Directory Management", description = "APIs for managing directories and sub-directories")
public class DirectoryController {

    private final DirectoryService directoryService;

    @PostMapping
    @Operation(summary = "Create a new directory", description = "Create a root directory or sub-directory under a parent")
    public ResponseEntity<DirectoryResponse> createDirectory(@Valid @RequestBody DirectoryRequest request) {
        DirectoryResponse response = directoryService.createDirectory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get directory by ID")
    public ResponseEntity<DirectoryResponse> getDirectoryById(@PathVariable String id) {
        DirectoryResponse response = directoryService.getDirectoryById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/roots")
    @Operation(summary = "Get all root directories", description = "Get all directories that have no parent")
    public ResponseEntity<List<DirectoryResponse>> getRootDirectories() {
        List<DirectoryResponse> responses = directoryService.getRootDirectories();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{parentId}/children")
    @Operation(summary = "Get sub-directories", description = "Get all sub-directories under a parent directory")
    public ResponseEntity<List<DirectoryResponse>> getSubDirectories(@PathVariable String parentId) {
        List<DirectoryResponse> responses = directoryService.getSubDirectories(parentId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}/hierarchy")
    @Operation(summary = "Get directory hierarchy", description = "Get directory with full nested children structure")
    public ResponseEntity<DirectoryResponse> getHierarchy(@PathVariable String id) {
        DirectoryResponse response = directoryService.getHierarchy(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/hierarchy/all")
    @Operation(summary = "Get full hierarchy", description = "Get all root directories with complete nested structure")
    public ResponseEntity<List<DirectoryResponse>> getFullHierarchy() {
        List<DirectoryResponse> responses = directoryService.getFullHierarchy();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update directory", description = "Update directory name and/or description")
    public ResponseEntity<DirectoryResponse> updateDirectory(
            @PathVariable String id,
            @Valid @RequestBody UpdateDirectoryRequest request) {
        DirectoryResponse response = directoryService.updateDirectory(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete directory", description = "Soft delete directory and all its children and topics")
    public ResponseEntity<Void> deleteDirectory(@PathVariable String id) {
        directoryService.deleteDirectory(id);
        return ResponseEntity.noContent().build();
    }
}

