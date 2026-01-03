package com.iagent.jar.controller;

import com.iagent.jar.dto.*;
import com.iagent.jar.service.JarService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/jars")
public class JarController {
    private final JarService service;

    public JarController(JarService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<JarUploadResponse> upload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(service.upload(file));
    }

    @GetMapping("/{jarId}/classes")
    public ResponseEntity<ClassListResponse> classes(@PathVariable String jarId) {
        return ResponseEntity.ok(service.getPublicClasses(jarId));
    }

    @GetMapping("/{jarId}/methods")
    public ResponseEntity<MethodListResponse> methods(@PathVariable String jarId, @RequestParam String className) {
        return ResponseEntity.ok(service.getPublicMethods(jarId, className));
    }
}
