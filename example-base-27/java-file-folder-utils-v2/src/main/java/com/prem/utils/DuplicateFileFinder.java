package com.prem.utils;

import java.io.*;
import java.nio.file.*;
import java.security.MessageDigest;
import java.util.*;

public class DuplicateFileFinder {
    public static void main(String[] args) {
        if (!FileUtils.validFolder(args)) return;
        Path root = Paths.get(args[0]);
        Map<String, List<Path>> groups = new HashMap<>();

        try {
            Files.walkFileTree(root, new SimpleFileVisitor<>() {
                public FileVisitResult preVisitDirectory(Path dir, java.nio.file.attribute.BasicFileAttributes a) {
                    return FileUtils.excluded(dir, root) ? FileVisitResult.SKIP_SUBTREE : FileVisitResult.CONTINUE;
                }
                public FileVisitResult visitFile(Path file, java.nio.file.attribute.BasicFileAttributes a) {
                    try {
                        String key = Files.size(file) + ":" + sha256(file);
                        groups.computeIfAbsent(key, k -> new ArrayList<>()).add(file);
                    } catch (Exception e) {
                        System.err.println("Cannot hash: " + file);
                    }
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) { e.printStackTrace(); return; }

        int n = 0;
        for (List<Path> list : groups.values()) if (list.size() > 1) {
            System.out.println("\nDuplicate Group " + (++n) + ":");
            list.forEach(p -> System.out.println("  " + p));
        }
        if (n == 0) System.out.println("No duplicate files found.");
    }

    static String sha256(Path file) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        try (InputStream in = Files.newInputStream(file)) {
            byte[] b = new byte[8192]; int read;
            while ((read = in.read(b)) != -1) md.update(b, 0, read);
        }
        StringBuilder s = new StringBuilder();
        for (byte b : md.digest()) s.append(String.format("%02x", b));
        return s.toString();
    }
}
