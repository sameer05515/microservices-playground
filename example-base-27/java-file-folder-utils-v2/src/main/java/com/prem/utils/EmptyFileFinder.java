package com.prem.utils;

import java.io.IOException;
import java.nio.file.*;

public class EmptyFileFinder {
    public static void main(String[] args) {
        if (!FileUtils.validFolder(args)) return;
        Path root = Paths.get(args[0]);

        try {
            Files.walkFileTree(root, new SimpleFileVisitor<>() {
                public FileVisitResult preVisitDirectory(Path dir, java.nio.file.attribute.BasicFileAttributes a) {
                    return FileUtils.excluded(dir, root) ? FileVisitResult.SKIP_SUBTREE : FileVisitResult.CONTINUE;
                }
                public FileVisitResult visitFile(Path file, java.nio.file.attribute.BasicFileAttributes a) {
                    try {
                        if (Files.size(file) == 0) System.out.println(file);
                    } catch (IOException ignored) {}
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) { e.printStackTrace(); }
    }
}
