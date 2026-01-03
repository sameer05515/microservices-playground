package com.prem.duplicatefinder.service;

import com.prem.duplicatefinder.model.*;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.*;

@Service
public class DuplicateFileService {

    private static final int BUFFER_SIZE = 8192;

    public DuplicateScanResponse findDuplicates(String rootPath) throws Exception {
        long started = System.currentTimeMillis();
        Path root = Paths.get(rootPath).toAbsolutePath().normalize();

        if (!Files.exists(root) || !Files.isDirectory(root)) {
            throw new IllegalArgumentException("Folder does not exist or is not a directory: " + root);
        }

        // First group by file size. This avoids hashing files whose sizes are unique.
        Map<Long, List<Path>> bySize = new HashMap<>();

        Files.walkFileTree(root, new SimpleFileVisitor<>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                if (attrs.isRegularFile()) {
                    bySize.computeIfAbsent(attrs.size(), k -> new ArrayList<>()).add(file);
                }
                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult visitFileFailed(Path file, IOException exc) {
                return FileVisitResult.CONTINUE;
            }
        });

        Map<String, List<Path>> groups = new HashMap<>();

        for (Map.Entry<Long, List<Path>> entry : bySize.entrySet()) {
            if (entry.getValue().size() < 2) continue;

            for (Path file : entry.getValue()) {
                try {
                    String key = entry.getKey() + ":" + sha256(file);
                    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(file);
                } catch (Exception ignored) {
                    // Continue scanning if an individual file cannot be read.
                }
            }
        }

        List<DuplicateGroup> result = new ArrayList<>();
        int groupNumber = 1;
        int duplicateFiles = 0;
        long wastedBytes = 0;

        for (Map.Entry<String, List<Path>> entry : groups.entrySet()) {
            List<Path> paths = entry.getValue();
            if (paths.size() < 2) continue;

            long size = Files.size(paths.get(0));
            List<DuplicateFile> files = new ArrayList<>();

            for (Path path : paths) {
                BasicFileAttributes attrs = Files.readAttributes(path, BasicFileAttributes.class);
                files.add(new DuplicateFile(
                        path.toString(),
                        path.getFileName().toString(),
                        attrs.size(),
                        Instant.ofEpochMilli(attrs.lastModifiedTime().toMillis()).toString()
                ));
            }

            long wasted = size * (paths.size() - 1L);
            result.add(new DuplicateGroup(
                    groupNumber++,
                    size,
                    entry.getKey().substring(entry.getKey().indexOf(':') + 1),
                    wasted,
                    files
            ));
            duplicateFiles += paths.size();
            wastedBytes += wasted;
        }

        result.sort(Comparator.comparingLong(DuplicateGroup::wastedBytes).reversed());

        return new DuplicateScanResponse(
                root.toString(),
                result.size(),
                duplicateFiles,
                wastedBytes,
                System.currentTimeMillis() - started,
                result
        );
    }

    private String sha256(Path file) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        try (InputStream in = Files.newInputStream(file)) {
            byte[] buffer = new byte[BUFFER_SIZE];
            int read;
            while ((read = in.read(buffer)) != -1) {
                md.update(buffer, 0, read);
            }
        }
        StringBuilder result = new StringBuilder();
        for (byte b : md.digest()) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}
