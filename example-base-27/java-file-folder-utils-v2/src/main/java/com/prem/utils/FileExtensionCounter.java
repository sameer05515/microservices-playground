package com.prem.utils;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

public class FileExtensionCounter {
    public static void main(String[] args) {
        if (!FileUtils.validFolder(args)) return;
        Path root = Paths.get(args[0]);
        Map<String, Long> counts = new TreeMap<>();

        try {
            Files.walkFileTree(root, new SimpleFileVisitor<>() {
                public FileVisitResult preVisitDirectory(Path dir, java.nio.file.attribute.BasicFileAttributes a) {
                    return FileUtils.excluded(dir, root) ? FileVisitResult.SKIP_SUBTREE : FileVisitResult.CONTINUE;
                }
                public FileVisitResult visitFile(Path file, java.nio.file.attribute.BasicFileAttributes a) {
                    String name = file.getFileName().toString();
                    int dot = name.lastIndexOf('.');
                    String ext = dot > 0 && dot < name.length()-1
                            ? name.substring(dot + 1).toLowerCase() : "[no extension]";
                    counts.merge(ext, 1L, Long::sum);
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) { e.printStackTrace(); return; }

        counts.forEach((ext, n) -> System.out.printf("%-20s %d%n", ext, n));
    }
}
