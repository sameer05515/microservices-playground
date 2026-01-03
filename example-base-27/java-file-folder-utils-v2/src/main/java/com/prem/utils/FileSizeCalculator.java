package com.prem.utils;

import java.io.IOException;
import java.nio.file.*;

public class FileSizeCalculator {
    public static void main(String[] args) {
        if (!FileUtils.validFolder(args)) return;
        Path root = Paths.get(args[0]);
        long[] total = {0, 0};

        try {
            Files.walkFileTree(root, new SimpleFileVisitor<>() {
                public FileVisitResult preVisitDirectory(Path dir, java.nio.file.attribute.BasicFileAttributes a) {
                    return FileUtils.excluded(dir, root) ? FileVisitResult.SKIP_SUBTREE : FileVisitResult.CONTINUE;
                }
                public FileVisitResult visitFile(Path file, java.nio.file.attribute.BasicFileAttributes a) {
                    try { total[0] += Files.size(file); total[1]++; } catch (IOException ignored) {}
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) { e.printStackTrace(); return; }

        System.out.println("Root Folder : " + root);
        System.out.println("Files       : " + total[1]);
        System.out.println("Total Size  : " + format(total[0]));
    }

    static String format(long bytes) {
        if (bytes < 1024) return bytes + " B";
        double v = bytes; String[] u = {"KB","MB","GB","TB"}; int i = -1;
        while (v >= 1024 && i < u.length-1) { v /= 1024; i++; }
        return String.format("%.2f %s", v, u[i]);
    }
}
