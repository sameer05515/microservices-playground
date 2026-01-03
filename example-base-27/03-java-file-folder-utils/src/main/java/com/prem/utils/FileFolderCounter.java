package com.prem.utils;

import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Set;

public class FileFolderCounter {

    private static final Set<String> EXCLUDED_FOLDERS = Set.of(
            ".node_modules",
            ".git",
            "node_modules",
            ".idea"
    );

    public static void main(String[] args) {

        if (args.length == 0) {
            printUsage();
            return;
        }

        Path rootPath = Paths.get(args[0]);

        if (!Files.exists(rootPath)) {
            System.out.println("Folder does not exist: " + rootPath);
            return;
        }

        if (!Files.isDirectory(rootPath)) {
            System.out.println("Path is not a folder: " + rootPath);
            return;
        }

        Counter counter = new Counter(rootPath);

        try {
            Files.walkFileTree(rootPath, counter);

        } catch (IOException e) {
            System.err.println("Error while scanning folder: " + rootPath);
            e.printStackTrace();
            return;
        }

        System.out.println();
        System.out.println("Root Folder : " + rootPath);
        System.out.println("Folders     : " + counter.getFolderCount());
        System.out.println("Files       : " + counter.getFileCount());
        System.out.println("Total Items : "
                + (counter.getFolderCount() + counter.getFileCount()));
    }

    private static void printUsage() {
        System.out.println("Usage:");
        System.out.println(
                "java -cp target/classes com.prem.utils.FileFolderCounter <folder-path>"
        );
        System.out.println();
        System.out.println("Example:");
        System.out.println(
                "java -cp target/classes com.prem.utils.FileFolderCounter \"D:\\Projects\""
        );
    }

    static class Counter extends SimpleFileVisitor<Path> {

        private final Path rootPath;

        private long folderCount;
        private long fileCount;

        public long getFolderCount() {
            return folderCount;
        }

        public long getFileCount() {
            return fileCount;
        }

        Counter(Path rootPath) {
            this.rootPath = rootPath;
        }

        @Override
        public FileVisitResult preVisitDirectory(
                Path dir,
                BasicFileAttributes attrs) {

            String folderName = dir.getFileName().toString();

            if (EXCLUDED_FOLDERS.contains(folderName)) {
                System.out.println("Skipping: " + dir);
                return FileVisitResult.SKIP_SUBTREE;
            }

            // Do not count the supplied root folder itself.
            if (!dir.equals(rootPath)) {
                folderCount++;
            }

            return FileVisitResult.CONTINUE;
        }

        @Override
        public FileVisitResult visitFile(
                Path file,
                BasicFileAttributes attrs) {

            fileCount++;

            return FileVisitResult.CONTINUE;
        }
    }
}
