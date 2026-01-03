package com.prem.duplicatefinder.controller;

import com.prem.duplicatefinder.model.*;
import com.prem.duplicatefinder.service.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class DuplicateFileController {
    private final DuplicateScanService scan;
    private final FileOperationService files;

    public DuplicateFileController(DuplicateScanService scan, FileOperationService files) {
        this.scan = scan;
        this.files = files;
    }

    @PostMapping("/duplicates/scan")
    public Map<String, String> start(@Valid @RequestBody ScanRequest r) {
        return Map.of("jobId", scan.start(r.rootPath(), r.normalizedIgnoredFolders()));
    }

    @GetMapping("/duplicates/scan/{jobId}")
    public ScanStatus status(@PathVariable String jobId) {
        return scan.status(jobId);
    }

    @PostMapping("/duplicates/scan/{jobId}/cancel")
    public Map<String, String> cancel(@PathVariable String jobId) {
        scan.cancel(jobId);
        return Map.of("message", "Cancellation requested");
    }

    @GetMapping("/folders")
    public List<FolderEntry> browse(@RequestParam String path) throws Exception {
        return files.browse(path);
    }

    @DeleteMapping("/files")
    public Map<String, Object> delete(@RequestBody DeleteRequest r) {
        return files.delete(r.paths());
    }

    @PostMapping("/files/move")
    public Map<String, Object> move(
            @RequestBody MoveRequest r,
            @RequestParam List<String> paths) {
        return files.move(paths, r.targetDirectory());
    }
}
