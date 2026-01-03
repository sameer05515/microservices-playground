package com.prem.utils;

import java.io.IOException;
import java.nio.file.*;

public class FileSearch {
    public static void main(String[] args) {
        if (args.length < 2) {
            System.out.println("Usage: java -cp target/classes com.prem.utils.FileSearch <folder-path> <file-name-or-glob>");
            return;
        }
        Path root = Paths.get(args[0]);
        String pattern = args[1];
        PathMatcher matcher = FileSystems.getDefault().getPathMatcher("glob:" + pattern);

        try {
            Files.walkFileTree(root, new SimpleFileVisitor<>() {
                public FileVisitResult preVisitDirectory(Path dir, java.nio.file.attribute.BasicFileAttributes a) {
                    return FileUtils.excluded(dir, root) ? FileVisitResult.SKIP_SUBTREE : FileVisitResult.CONTINUE;
                }
                public FileVisitResult visitFile(Path file, java.nio.file.attribute.BasicFileAttributes a) {
                    if (matcher.matches(file.getFileName())) System.out.println(file);
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) { e.printStackTrace(); }
    }
}
