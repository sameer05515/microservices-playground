package com.prem.fileutils.controller;

import com.prem.fileutils.service.FileUtilsService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileUtilsController {

    private final FileUtilsService service;

    public FileUtilsController(FileUtilsService service) {
        this.service = service;
    }

    @GetMapping("/root")
    public Map<String, String> root() {
        return Map.of("root", service.getRoot().toString());
    }

    @GetMapping("/list")
    public List<?> list(@RequestParam(defaultValue = "") String path)
            throws IOException {
        return service.list(path);
    }

    @PostMapping("/directory")
    public ResponseEntity<?> createDirectory(@RequestBody Map<String, String> body)
            throws IOException {
        service.createDirectory(body.get("path"));
        return ResponseEntity.ok(Map.of("message", "Directory created"));
    }

    @PostMapping("/copy")
    public ResponseEntity<?> copy(@Valid @RequestBody OperationRequest request)
            throws IOException {
        service.copy(request.source(), request.destination());
        return ResponseEntity.ok(Map.of("message", "Copy completed"));
    }

    @PostMapping("/move")
    public ResponseEntity<?> move(@Valid @RequestBody OperationRequest request)
            throws IOException {
        service.move(request.source(), request.destination());
        return ResponseEntity.ok(Map.of("message", "Move completed"));
    }

    @DeleteMapping
    public ResponseEntity<?> delete(@RequestParam @NotBlank String path)
            throws IOException {
        service.delete(path);
        return ResponseEntity.ok(Map.of("message", "Delete completed"));
    }

    @PostMapping("/zip")
    public ResponseEntity<?> zip(@Valid @RequestBody ArchiveRequest request)
            throws IOException {
        service.zip(request.source(), request.destination());
        return ResponseEntity.ok(Map.of("message", "ZIP created"));
    }

    @PostMapping("/unzip")
    public ResponseEntity<?> unzip(@Valid @RequestBody ArchiveRequest request)
            throws IOException {
        service.unzip(request.source(), request.destination());
        return ResponseEntity.ok(Map.of("message", "ZIP extracted"));
    }

    @GetMapping("/find")
    public List<?> find(
            @RequestParam String query,
            @RequestParam(defaultValue = "") String path)
            throws IOException {
        return service.find(query, path);
    }

    @GetMapping("/count")
    public Map<String, Object> count(
            @RequestParam(defaultValue = "") String path)
            throws IOException {
        return service.count(path);
    }

    @GetMapping("/empty-folders")
    public List<String> emptyFolders(
            @RequestParam(defaultValue = "") String path)
            throws IOException {
        return service.emptyFolders(path);
    }

    @GetMapping("/duplicates")
    public List<Map<String, Object>> duplicates(
            @RequestParam(defaultValue = "") String path)
            throws IOException {
        return service.duplicates(path);
    }

    private record OperationRequest(
            @NotBlank String source,
            @NotBlank String destination) {
    }

    private record ArchiveRequest(
            @NotBlank String source,
            @NotBlank String destination) {
    }
}
