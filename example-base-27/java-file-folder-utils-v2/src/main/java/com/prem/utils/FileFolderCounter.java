package com.prem.utils;

import java.io.IOException;
import java.nio.file.*;

public class FileFolderCounter {
    public static void main(String[] args) {
        if (!FileUtils.validFolder(args)) return;
        Path root = Paths.get(args[0]);
        long[] count = {0, 0};

        try {
            Files.walkFileTree(root, new SimpleFileVisitor<>() {
                public FileVisitResult preVisitDirectory(Path dir, java.nio.file.attribute.BasicFileAttributes a) {
                    if (FileUtils.excluded(dir, root)) return FileVisitResult.SKIP_SUBTREE;
                    if (!dir.equals(root)) count[0]++;
                    return FileVisitResult.CONTINUE;
                }
                public FileVisitResult visitFile(Path file, java.nio.file.attribute.BasicFileAttributes a) {
                    count[1]++;
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) { e.printStackTrace(); return; }

        System.out.println("Root Folder : " + root);
        System.out.println("Folders     : " + count[0]);
        System.out.println("Files       : " + count[1]);
        System.out.println("Total Items : " + (count[0] + count[1]));
    }
}
