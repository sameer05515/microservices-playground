package com.prem.utils;

import java.io.IOException;
import java.nio.file.*;
import java.util.Comparator;

public class LargestFileFinder {
    public static void main(String[] args) {
        if (!FileUtils.validFolder(args)) return;
        Path root = Paths.get(args[0]);
        final Path[] largest = {null};
        final long[] max = {-1};

        try {
            Files.walkFileTree(root, new SimpleFileVisitor<>() {
                public FileVisitResult preVisitDirectory(Path dir, java.nio.file.attribute.BasicFileAttributes a) {
                    return FileUtils.excluded(dir, root) ? FileVisitResult.SKIP_SUBTREE : FileVisitResult.CONTINUE;
                }
                public FileVisitResult visitFile(Path file, java.nio.file.attribute.BasicFileAttributes a) {
                    try {
                        long size = Files.size(file);
                        if (size > max[0]) { max[0] = size; largest[0] = file; }
                    } catch (IOException ignored) {}
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) { e.printStackTrace(); return; }

        if (largest[0] == null) System.out.println("No files found.");
        else {
            System.out.println("Largest File : " + largest[0]);
            System.out.println("Size         : " + format(max[0]));
        }
    }

    static String format(long bytes) {
        if (bytes < 1024) return bytes + " B";
        double v = bytes; String[] u = {"KB","MB","GB","TB"}; int i = -1;
        while (v >= 1024 && i < u.length-1) { v /= 1024; i++; }
        return String.format("%.2f %s", v, u[i]);
    }
}
