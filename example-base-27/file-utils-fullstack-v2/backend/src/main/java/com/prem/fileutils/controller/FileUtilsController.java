package com.prem.fileutils.controller;

import com.prem.fileutils.model.FileItem;
import com.prem.fileutils.model.JobInfo;
import com.prem.fileutils.model.OperationRequest;
import com.prem.fileutils.model.PageResponse;
import com.prem.fileutils.service.FileUtilsService;
import com.prem.fileutils.service.JobService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileUtilsController {

    private final FileUtilsService service;
    private final JobService jobService;

    public FileUtilsController(FileUtilsService service, JobService jobService) {
        this.service = service;
        this.jobService = jobService;
    }

    @GetMapping("/root")
    public Map<String, String> root() {
        return Map.of("root", service.getRoot().toString());
    }

    @GetMapping("/list")
    public PageResponse<FileItem> list(
            @RequestParam(defaultValue = "") String path,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction)
            throws IOException {
        return service.list(path, page, size, sortBy, direction);
    }

    @PostMapping("/directory")
    public Map<String, String> directory(@RequestBody Map<String, String> body)
            throws IOException {
        service.createDirectory(body.get("path"));
        return Map.of("message", "Directory created");
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> upload(
            @RequestParam(defaultValue = "") String path,
            @RequestParam("files") MultipartFile[] files) throws IOException {
        service.upload(path, files);
        return Map.of("message", "Upload completed", "files", files.length);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> download(@RequestParam @NotBlank String path)
            throws IOException {
        Resource resource = service.resource(path);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(service.contentType(path)))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/preview")
    public ResponseEntity<Resource> preview(@RequestParam @NotBlank String path)
            throws IOException {
        Resource resource = service.resource(path);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(service.contentType(path)))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping("/copy")
    public Map<String, String> copy(@Valid @RequestBody OperationRequest request)
            throws IOException {
        service.copy(request.source(), request.destination());
        return Map.of("message", "Copy completed");
    }

    @PostMapping("/move")
    public Map<String, String> move(@Valid @RequestBody OperationRequest request)
            throws IOException {
        service.move(request.source(), request.destination());
        return Map.of("message", "Move completed");
    }

    @DeleteMapping
    public Map<String, String> delete(@RequestParam @NotBlank String path)
            throws IOException {
        service.delete(path);
        return Map.of("message", "Delete completed");
    }

    @PostMapping("/zip")
    public JobInfo zip(@Valid @RequestBody OperationRequest request)
            throws IOException {
        return service.zip(request.source(), request.destination());
    }

    @PostMapping("/unzip")
    public JobInfo unzip(@Valid @RequestBody OperationRequest request)
            throws IOException {
        return service.unzip(request.source(), request.destination());
    }

    @GetMapping("/jobs/{jobId}")
    public JobInfo job(@PathVariable String jobId) {
        return jobService.get(jobId);
    }

    @GetMapping("/find")
    public List<FileItem> find(
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
}
