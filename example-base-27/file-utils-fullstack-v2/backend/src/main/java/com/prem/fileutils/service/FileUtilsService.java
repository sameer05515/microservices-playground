package com.prem.fileutils.service;

import com.prem.fileutils.config.FileUtilsProperties;
import com.prem.fileutils.model.FileItem;
import com.prem.fileutils.model.JobInfo;
import com.prem.fileutils.model.PageResponse;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.security.MessageDigest;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

@Service
public class FileUtilsService {

    private final Path root;
    private final JobService jobService;

    public FileUtilsService(FileUtilsProperties properties, JobService jobService)
            throws IOException {
        this.root = Paths.get(properties.getRoot()).toAbsolutePath().normalize();
        this.jobService = jobService;
        Files.createDirectories(root);
    }

    public Path getRoot() {
        return root;
    }

    public PageResponse<FileItem> list(
            String relativePath,
            int page,
            int size,
            String sortBy,
            String direction) throws IOException {

        Path directory = resolve(relativePath);

        if (!Files.isDirectory(directory)) {
            throw new IllegalArgumentException("Not a directory: " + relativePath);
        }

        List<FileItem> all;

        try (var stream = Files.list(directory)) {
            all = stream.map(this::toFileItem).toList();
        }

        Comparator<FileItem> comparator = switch (sortBy) {
            case "size" -> Comparator.comparingLong(FileItem::size);
            case "modified" -> Comparator.comparingLong(FileItem::modified);
            case "type" -> Comparator.comparing(FileItem::type, String.CASE_INSENSITIVE_ORDER);
            default -> Comparator.comparing(FileItem::name, String.CASE_INSENSITIVE_ORDER);
        };

        if ("desc".equalsIgnoreCase(direction)) {
            comparator = comparator.reversed();
        }

        all = all.stream().sorted(comparator).toList();

        int safeSize = Math.max(1, Math.min(size, 500));
        int safePage = Math.max(0, page);
        int from = Math.min(safePage * safeSize, all.size());
        int to = Math.min(from + safeSize, all.size());

        List<FileItem> content = all.subList(from, to);
        int totalPages = all.isEmpty() ? 0 : (int) Math.ceil((double) all.size() / safeSize);

        return new PageResponse<>(
                content,
                safePage,
                safeSize,
                all.size(),
                totalPages,
                sortBy,
                direction
        );
    }

    public void createDirectory(String relativePath) throws IOException {
        Files.createDirectories(resolve(relativePath));
    }

    public void upload(String directory, MultipartFile[] files) throws IOException {
        Path targetDirectory = resolve(directory);
        Files.createDirectories(targetDirectory);

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String original = Optional.ofNullable(file.getOriginalFilename())
                    .orElse("upload.bin");

            String safeName = Paths.get(original).getFileName().toString();
            Path target = targetDirectory.resolve(safeName).normalize();

            if (!target.startsWith(root)) {
                throw new IllegalArgumentException("Invalid upload filename");
            }

            try (InputStream in = file.getInputStream();
                 OutputStream out = Files.newOutputStream(target)) {
                in.transferTo(out);
            }
        }
    }

    public Resource resource(String relativePath) throws IOException {
        Path path = existing(relativePath);

        if (Files.isDirectory(path)) {
            throw new IllegalArgumentException("Directories cannot be downloaded/previews");
        }

        return new FileSystemResource(path);
    }

    public String contentType(String relativePath) throws IOException {
        Path path = existing(relativePath);
        String type = Files.probeContentType(path);
        return type == null ? "application/octet-stream" : type;
    }

    public void copy(String source, String destination) throws IOException {
        Path src = existing(source);
        Path dest = resolve(destination);

        if (src.equals(dest)) {
            throw new IllegalArgumentException("Source and destination are identical");
        }

        if (Files.isDirectory(src)) {
            if (dest.startsWith(src)) {
                throw new IllegalArgumentException("Destination cannot be inside source");
            }
            try (var stream = Files.walk(src)) {
                for (Path p : stream.toList()) {
                    Path target = dest.resolve(src.relativize(p));
                    if (Files.isDirectory(p)) {
                        Files.createDirectories(target);
                    } else {
                        Files.createDirectories(target.getParent());
                        Files.copy(p, target, StandardCopyOption.REPLACE_EXISTING);
                    }
                }
            }
        } else {
            Files.createDirectories(Optional.ofNullable(dest.getParent()).orElse(root));
            Files.copy(src, dest, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    public void move(String source, String destination) throws IOException {
        Path src = existing(source);
        Path dest = resolve(destination);
        Files.createDirectories(Optional.ofNullable(dest.getParent()).orElse(root));
        Files.move(src, dest, StandardCopyOption.REPLACE_EXISTING);
    }

    public void delete(String relativePath) throws IOException {
        Path target = existing(relativePath);

        if (target.equals(root)) {
            throw new IllegalArgumentException("Deleting root is not allowed");
        }

        try (var stream = Files.walk(target)) {
            for (Path p : stream.sorted(Comparator.reverseOrder()).toList()) {
                Files.delete(p);
            }
        }
    }

    public JobInfo zip(String source, String destination) throws IOException {
        Path sourcePath = existing(source);
        Path zipPath = resolve(destination);
        JobInfo job = jobService.create("ZIP");

        CompletableFuture.runAsync(() -> runZip(job, sourcePath, zipPath));

        return job;
    }

    public JobInfo unzip(String source, String destination) throws IOException {
        Path zipPath = existing(source);
        Path destinationPath = resolve(destination);
        JobInfo job = jobService.create("UNZIP");

        CompletableFuture.runAsync(() -> runUnzip(job, zipPath, destinationPath));

        return job;
    }

    private void runZip(JobInfo job, Path source, Path destination) {
        try {
            Files.createDirectories(Optional.ofNullable(destination.getParent()).orElse(root));

            long total;
            try (var stream = Files.walk(source)) {
                total = stream.filter(Files::isRegularFile).count();
            }

            job.running(total, "Zipping files");

            long processed = 0;

            try (OutputStream out = Files.newOutputStream(destination);
                 ZipOutputStream zos = new ZipOutputStream(out)) {

                try (var stream = Files.walk(source)) {
                    for (Path p : stream.filter(Files::isRegularFile).toList()) {
                        String entry = Files.isDirectory(source)
                                ? source.relativize(p).toString().replace('\\', '/')
                                : p.getFileName().toString();

                        zos.putNextEntry(new ZipEntry(entry));

                        try (InputStream in = Files.newInputStream(p)) {
                            in.transferTo(zos);
                        }

                        zos.closeEntry();
                        processed++;
                        job.progress(processed, "Zipping " + p.getFileName());
                    }
                }
            }

            job.completed();
        } catch (Exception e) {
            job.failed(e);
        }
    }

    private void runUnzip(JobInfo job, Path zip, Path destination) {
        try {
            Files.createDirectories(destination);

            long total = 0;
            try (ZipInputStream zis = new ZipInputStream(Files.newInputStream(zip))) {
                while (zis.getNextEntry() != null) {
                    total++;
                    zis.closeEntry();
                }
            }

            job.running(total, "Extracting files");

            long processed = 0;

            try (ZipInputStream zis = new ZipInputStream(Files.newInputStream(zip))) {
                ZipEntry entry;

                while ((entry = zis.getNextEntry()) != null) {
                    Path target = destination.resolve(entry.getName()).normalize();

                    if (!target.startsWith(destination)) {
                        throw new IllegalArgumentException(
                                "Blocked unsafe ZIP entry: " + entry.getName());
                    }

                    if (entry.isDirectory()) {
                        Files.createDirectories(target);
                    } else {
                        Files.createDirectories(target.getParent());
                        try (OutputStream out = Files.newOutputStream(target)) {
                            zis.transferTo(out);
                        }
                    }

                    processed++;
                    job.progress(processed, "Extracting " + entry.getName());
                    zis.closeEntry();
                }
            }

            job.completed();
        } catch (Exception e) {
            job.failed(e);
        }
    }

    public List<FileItem> find(String query, String path) throws IOException {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("Query is required");
        }

        Path start = resolve(path);

        try (var stream = Files.walk(start)) {
            return stream
                    .filter(p -> p.getFileName() != null)
                    .filter(p -> p.getFileName().toString()
                            .toLowerCase().contains(query.toLowerCase()))
                    .map(this::toFileItem)
                    .toList();
        }
    }

    public Map<String, Object> count(String path) throws IOException {
        Path start = resolve(path);

        try (var stream = Files.walk(start)) {
            List<Path> all = stream.toList();

            return Map.of(
                    "path", relative(start),
                    "files", all.stream().filter(Files::isRegularFile).count(),
                    "directories", all.stream().filter(Files::isDirectory).count()
            );
        }
    }

    public List<String> emptyFolders(String path) throws IOException {
        Path start = resolve(path);

        try (var stream = Files.walk(start)) {
            return stream.filter(Files::isDirectory)
                    .filter(p -> !p.equals(start))
                    .filter(this::isEmpty)
                    .map(this::relative)
                    .sorted()
                    .toList();
        }
    }

    public List<Map<String, Object>> duplicates(String path) throws IOException {
        Path start = resolve(path);
        Map<String, List<Path>> hashes = new HashMap<>();

        try (var stream = Files.walk(start)) {
            for (Path p : stream.filter(Files::isRegularFile).toList()) {
                hashes.computeIfAbsent(sha256(p), k -> new ArrayList<>()).add(p);
            }
        }

        return hashes.entrySet().stream()
                .filter(e -> e.getValue().size() > 1)
                .map(e -> Map.<String, Object>of(
                        "hash", e.getKey(),
                        "files", e.getValue().stream().map(this::relative).sorted().toList()
                ))
                .toList();
    }

    private Path resolve(String value) {
        Path result = root.resolve(value == null ? "" : value).normalize();

        if (!result.startsWith(root)) {
            throw new IllegalArgumentException("Path escapes configured root");
        }

        return result;
    }

    private Path existing(String value) throws IOException {
        Path p = resolve(value);
        if (!Files.exists(p)) {
            throw new NoSuchFileException(value);
        }
        return p;
    }

    private FileItem toFileItem(Path p) {
        try {
            boolean dir = Files.isDirectory(p);
            return new FileItem(
                    p.getFileName().toString(),
                    relative(p),
                    dir ? "DIRECTORY" : extension(p),
                    dir ? 0 : Files.size(p),
                    dir,
                    Files.getLastModifiedTime(p).toMillis()
            );
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private String relative(Path p) {
        return root.relativize(p).toString().replace('\\', '/');
    }

    private String extension(Path p) {
        String n = p.getFileName().toString();
        int i = n.lastIndexOf('.');
        return i > 0 ? n.substring(i + 1).toUpperCase() : "FILE";
    }

    private boolean isEmpty(Path p) {
        try (var s = Files.list(p)) {
            return s.findAny().isEmpty();
        } catch (IOException e) {
            return false;
        }
    }

    private String sha256(Path p) throws IOException {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            try (InputStream in = Files.newInputStream(p)) {
                byte[] buffer = new byte[8192];
                int read;
                while ((read = in.read(buffer)) != -1) {
                    md.update(buffer, 0, read);
                }
            }
            return HexFormat.of().formatHex(md.digest());
        } catch (Exception e) {
            throw new IOException("Unable to hash " + p, e);
        }
    }
}
