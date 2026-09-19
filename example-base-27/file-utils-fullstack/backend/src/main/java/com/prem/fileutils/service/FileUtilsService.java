package com.prem.fileutils.service;

import com.prem.fileutils.config.FileUtilsProperties;
import com.prem.fileutils.model.FileItem;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

@Service
public class FileUtilsService {

    private final Path root;

    public FileUtilsService(FileUtilsProperties properties) throws IOException {
        this.root = Paths.get(properties.getRoot()).toAbsolutePath().normalize();
        Files.createDirectories(root);
    }

    public Path getRoot() {
        return root;
    }

    public List<FileItem> list(String relativePath) throws IOException {
        Path directory = resolve(relativePath);

        if (!Files.isDirectory(directory)) {
            throw new IllegalArgumentException("Not a directory: " + relativePath);
        }

        try (var stream = Files.list(directory)) {
            return stream
                    .sorted(Comparator.comparing(p -> p.getFileName().toString().toLowerCase()))
                    .map(this::toFileItem)
                    .toList();
        }
    }

    public void createDirectory(String relativePath) throws IOException {
        if (relativePath == null || relativePath.isBlank()) {
            throw new IllegalArgumentException("Directory path is required");
        }
        Files.createDirectories(resolve(relativePath));
    }

    public void copy(String source, String destination) throws IOException {
        Path src = existing(source);
        Path dest = resolve(destination);

        if (src.equals(dest)) {
            throw new IllegalArgumentException("Source and destination are identical");
        }

        if (Files.isDirectory(src)) {
            copyDirectory(src, dest);
        } else {
            Files.createDirectories(Optional.ofNullable(dest.getParent()).orElse(root));
            Files.copy(src, dest, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    public void move(String source, String destination) throws IOException {
        Path src = existing(source);
        Path dest = resolve(destination);

        if (src.equals(dest)) {
            throw new IllegalArgumentException("Source and destination are identical");
        }

        Files.createDirectories(Optional.ofNullable(dest.getParent()).orElse(root));
        Files.move(src, dest, StandardCopyOption.REPLACE_EXISTING);
    }

    public void delete(String relativePath) throws IOException {
        Path target = existing(relativePath);

        if (target.equals(root)) {
            throw new IllegalArgumentException("Deleting the configured root is not allowed");
        }

        deleteRecursively(target);
    }

    public void zip(String source, String destination) throws IOException {
        Path sourcePath = existing(source);
        Path zipPath = resolve(destination);

        if (sourcePath.equals(zipPath)) {
            throw new IllegalArgumentException("Source and ZIP destination are identical");
        }

        Files.createDirectories(Optional.ofNullable(zipPath.getParent()).orElse(root));

        if (Files.isDirectory(sourcePath)) {
            zipDirectory(sourcePath, zipPath);
        } else {
            try (OutputStream out = Files.newOutputStream(zipPath);
                 ZipOutputStream zos = new ZipOutputStream(out)) {
                addFileToZip(sourcePath, sourcePath.getFileName().toString(), zos);
            }
        }
    }

    public void unzip(String source, String destination) throws IOException {
        Path zipPath = existing(source);
        Path destinationPath = resolve(destination);

        if (!Files.isRegularFile(zipPath)) {
            throw new IllegalArgumentException("ZIP source must be a file");
        }

        Files.createDirectories(destinationPath);

        try (InputStream in = Files.newInputStream(zipPath);
             ZipInputStream zis = new ZipInputStream(in)) {

            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                Path target = destinationPath.resolve(entry.getName()).normalize();

                if (!target.startsWith(destinationPath)) {
                    throw new IllegalArgumentException("Blocked unsafe ZIP entry: " + entry.getName());
                }

                if (entry.isDirectory()) {
                    Files.createDirectories(target);
                } else {
                    Files.createDirectories(target.getParent());
                    try (OutputStream out = Files.newOutputStream(target)) {
                        zis.transferTo(out);
                    }
                }
                zis.closeEntry();
            }
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
                    .filter(p -> p.getFileName().toString().toLowerCase()
                            .contains(query.toLowerCase()))
                    .map(this::toFileItem)
                    .toList();
        }
    }

    public Map<String, Object> count(String path) throws IOException {
        Path start = resolve(path);

        try (var stream = Files.walk(start)) {
            long files = stream.filter(Files::isRegularFile).count();
            return Map.of(
                    "path", normalizeRelative(start),
                    "files", files,
                    "directories", countDirectories(start)
            );
        }
    }

    public List<String> emptyFolders(String path) throws IOException {
        Path start = resolve(path);

        try (var stream = Files.walk(start)) {
            return stream
                    .filter(Files::isDirectory)
                    .filter(p -> !p.equals(start))
                    .filter(this::isEmpty)
                    .map(this::normalizeRelative)
                    .sorted()
                    .toList();
        }
    }

    public List<Map<String, Object>> duplicates(String path) throws IOException {
        Path start = resolve(path);

        Map<String, List<Path>> byHash = new HashMap<>();

        try (var stream = Files.walk(start)) {
            for (Path p : stream.filter(Files::isRegularFile).toList()) {
                String hash = sha256(p);
                byHash.computeIfAbsent(hash, k -> new ArrayList<>()).add(p);
            }
        }

        return byHash.entrySet().stream()
                .filter(e -> e.getValue().size() > 1)
                .map(e -> Map.<String, Object>of(
                        "hash", e.getKey(),
                        "files", e.getValue().stream()
                                .map(this::normalizeRelative)
                                .sorted()
                                .toList()
                ))
                .sorted(Comparator.comparing(e -> (String) e.get("hash")))
                .toList();
    }

    private Path resolve(String relativePath) {
        String value = relativePath == null ? "" : relativePath.trim();
        Path path = root.resolve(value).normalize();

        if (!path.startsWith(root)) {
            throw new IllegalArgumentException("Path escapes configured root: " + relativePath);
        }

        return path;
    }

    private Path existing(String relativePath) throws IOException {
        Path path = resolve(relativePath);
        if (!Files.exists(path)) {
            throw new NoSuchFileException(relativePath);
        }
        return path;
    }

    private FileItem toFileItem(Path path) {
        try {
            boolean directory = Files.isDirectory(path);
            return new FileItem(
                    path.getFileName().toString(),
                    normalizeRelative(path),
                    directory ? "DIRECTORY" : extension(path),
                    directory ? 0 : Files.size(path),
                    directory
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String extension(Path path) {
        String name = path.getFileName().toString();
        int dot = name.lastIndexOf('.');
        return dot > 0 ? name.substring(dot + 1).toUpperCase() : "FILE";
    }

    private String normalizeRelative(Path path) {
        Path relative = root.relativize(path);
        return relative.toString().replace('\\', '/');
    }

    private void copyDirectory(Path source, Path destination) throws IOException {
        if (destination.startsWith(source)) {
            throw new IllegalArgumentException("Destination cannot be inside source directory");
        }

        try (var stream = Files.walk(source)) {
            for (Path path : stream.toList()) {
                Path target = destination.resolve(source.relativize(path));
                if (Files.isDirectory(path)) {
                    Files.createDirectories(target);
                } else {
                    Files.createDirectories(target.getParent());
                    Files.copy(path, target, StandardCopyOption.REPLACE_EXISTING);
                }
            }
        }
    }

    private void deleteRecursively(Path path) throws IOException {
        try (var stream = Files.walk(path)) {
            List<Path> paths = stream.sorted(Comparator.reverseOrder()).toList();
            for (Path p : paths) {
                Files.delete(p);
            }
        }
    }

    private void zipDirectory(Path source, Path zipPath) throws IOException {
        try (OutputStream out = Files.newOutputStream(zipPath);
             ZipOutputStream zos = new ZipOutputStream(out)) {

            try (var stream = Files.walk(source)) {
                for (Path path : stream.filter(Files::isRegularFile).toList()) {
                    String entryName = source.relativize(path)
                            .toString()
                            .replace('\\', '/');
                    addFileToZip(path, entryName, zos);
                }
            }
        }
    }

    private void addFileToZip(Path file, String entryName, ZipOutputStream zos)
            throws IOException {
        zos.putNextEntry(new ZipEntry(entryName));
        try (InputStream in = Files.newInputStream(file)) {
            in.transferTo(zos);
        }
        zos.closeEntry();
    }

    private long countDirectories(Path start) throws IOException {
        try (var stream = Files.walk(start)) {
            return stream.filter(Files::isDirectory).count() - 1;
        }
    }

    private boolean isEmpty(Path directory) {
        try (var stream = Files.list(directory)) {
            return stream.findAny().isEmpty();
        } catch (IOException e) {
            return false;
        }
    }

    private String sha256(Path path) throws IOException {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            try (InputStream in = Files.newInputStream(path)) {
                byte[] buffer = new byte[8192];
                int read;
                while ((read = in.read(buffer)) != -1) {
                    digest.update(buffer, 0, read);
                }
            }
            return HexFormat.of().formatHex(digest.digest());
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
