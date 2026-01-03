package com.prem.duplicatefinder.service;

import com.prem.duplicatefinder.model.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;

@Service
public class DuplicateScanService {
    private final Map<String, ScanJob> jobs = new ConcurrentHashMap<>();

    public String start(String rootPath, List<String> ignoredFolders) {
        String jobId = UUID.randomUUID().toString();
        ScanJob job = new ScanJob(jobId, rootPath, normalizeIgnored(ignoredFolders));
        jobs.put(jobId, job);
        runAsync(job);
        return jobId;
    }

    public ScanStatus status(String jobId) {
        ScanJob j = jobs.get(jobId);
        if (j == null) throw new IllegalArgumentException("Unknown job: " + jobId);
        return j.snapshot();
    }

    public void cancel(String jobId) {
        ScanJob j = jobs.get(jobId);
        if (j == null) throw new IllegalArgumentException("Unknown job: " + jobId);
        j.cancelled = true;
        j.message = "Cancellation requested";
        if (j.future != null) j.future.cancel(true);
    }

    private List<String> normalizeIgnored(List<String> folders) {
        if (folders == null) return List.of();
        return folders.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .distinct()
                .toList();
    }

    @Async
    protected void runAsync(ScanJob j) {
        j.future = CompletableFuture.runAsync(() -> {
            try {
                Path root = Paths.get(j.rootPath).toAbsolutePath().normalize();
                if (!Files.isDirectory(root))
                    throw new IllegalArgumentException("Not a directory: " + root);

                j.status = "DISCOVERING";
                List<Path> all = new ArrayList<>();

                Files.walkFileTree(root, new SimpleFileVisitor<>() {
                    @Override
                    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
                        if (j.cancelled || Thread.currentThread().isInterrupted())
                            return FileVisitResult.TERMINATE;

                        if (!dir.equals(root) && j.ignoredFolders.contains(
                                dir.getFileName().toString().toLowerCase())) {
                            j.ignoredDirectoryCount++;
                            return FileVisitResult.SKIP_SUBTREE;
                        }
                        return FileVisitResult.CONTINUE;
                    }

                    @Override
                    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                        if (j.cancelled || Thread.currentThread().isInterrupted())
                            return FileVisitResult.TERMINATE;

                        if (attrs.isRegularFile()) {
                            all.add(file);
                            j.filesDiscovered = all.size();
                        }
                        return FileVisitResult.CONTINUE;
                    }

                    @Override
                    public FileVisitResult visitFileFailed(Path file, IOException e) {
                        j.skippedFileCount++;
                        return FileVisitResult.CONTINUE;
                    }
                });

                if (j.cancelled) {
                    j.status = "CANCELLED";
                    j.message = "Scan cancelled";
                    return;
                }

                j.status = "HASHING";

                Map<Long, List<Path>> bySize = new HashMap<>();
                for (Path p : all) {
                    try {
                        bySize.computeIfAbsent(Files.size(p), x -> new ArrayList<>()).add(p);
                    } catch (Exception ignored) {
                        j.skippedFileCount++;
                    }
                }

                Map<String, List<Path>> grouped = new HashMap<>();
                List<Path> candidates = new ArrayList<>();
                bySize.values().forEach(list -> {
                    if (list.size() > 1) candidates.addAll(list);
                });

                for (Path p : candidates) {
                    if (j.cancelled || Thread.currentThread().isInterrupted()) {
                        j.status = "CANCELLED";
                        j.message = "Scan cancelled";
                        return;
                    }

                    try {
                        long size = Files.size(p);
                        String key = size + ":" + sha256(p);
                        grouped.computeIfAbsent(key, x -> new ArrayList<>()).add(p);
                    } catch (Exception ignored) {
                        j.skippedFileCount++;
                    }

                    j.filesProcessed++;
                    j.percent = candidates.isEmpty()
                            ? 100
                            : (int) ((j.filesProcessed * 100.0) / candidates.size());
                }

                List<DuplicateGroup> result = new ArrayList<>();
                int n = 1;

                for (Map.Entry<String, List<Path>> e : grouped.entrySet()) {
                    if (e.getValue().size() < 2) continue;

                    long size = Files.size(e.getValue().get(0));
                    List<DuplicateFile> fs = new ArrayList<>();

                    for (Path p : e.getValue()) {
                        BasicFileAttributes a = Files.readAttributes(p, BasicFileAttributes.class);
                        fs.add(new DuplicateFile(
                                p.toString(),
                                p.getFileName().toString(),
                                a.size(),
                                Instant.ofEpochMilli(
                                        a.lastModifiedTime().toMillis()).toString()
                        ));
                    }

                    result.add(new DuplicateGroup(
                            n++,
                            size,
                            e.getKey().substring(e.getKey().indexOf(':') + 1),
                            size * (e.getValue().size() - 1L),
                            fs
                    ));
                }

                result.sort(Comparator.comparingLong(DuplicateGroup::wastedBytes).reversed());

                j.groups = result;
                j.status = "COMPLETED";
                j.percent = 100;
                j.message = "Scan completed";
            } catch (Exception e) {
                if (!j.cancelled) {
                    j.status = "FAILED";
                    j.message = e.getMessage();
                }
            }
        });
    }

    private String sha256(Path p) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");

        try (InputStream in = Files.newInputStream(p)) {
            byte[] b = new byte[8192];
            int r;
            while ((r = in.read(b)) != -1) {
                md.update(b, 0, r);
            }
        }

        StringBuilder s = new StringBuilder();
        for (byte b : md.digest()) {
            s.append(String.format("%02x", b));
        }
        return s.toString();
    }

    private static class ScanJob {
        final String jobId;
        final String rootPath;
        final List<String> ignoredFolders;

        volatile String status = "QUEUED";
        volatile String message = "Scan queued";
        volatile int percent = 0;
        volatile long filesDiscovered = 0;
        volatile long filesProcessed = 0;
        volatile long ignoredDirectoryCount = 0;
        volatile long skippedFileCount = 0;
        volatile List<DuplicateGroup> groups = List.of();
        volatile boolean cancelled = false;
        volatile CompletableFuture<?> future;

        ScanJob(String id, String root, List<String> ignored) {
            jobId = id;
            rootPath = root;
            ignoredFolders = ignored;
        }

        ScanStatus snapshot() {
            return new ScanStatus(
                    jobId,
                    status,
                    percent,
                    filesDiscovered,
                    filesProcessed,
                    groups.size(),
                    message,
                    groups
            );
        }
    }
}
