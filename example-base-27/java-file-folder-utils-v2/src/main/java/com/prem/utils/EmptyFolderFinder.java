package com.prem.utils;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;

public class EmptyFolderFinder {

    public static void main(String[] args) {

        if (!FileUtils.validFolder(args)) {
            return;
        }

        Path root = Paths.get(args[0]);

        try {

            Files.walkFileTree(
                    root,
                    new SimpleFileVisitor<Path>() {

                        @Override
                        public FileVisitResult preVisitDirectory(
                                Path dir,
                                BasicFileAttributes attrs) {

                            if (FileUtils.excluded(dir, root)) {
                                return FileVisitResult.SKIP_SUBTREE;
                            }

                            return FileVisitResult.CONTINUE;
                        }

                        @Override
                        public FileVisitResult postVisitDirectory(
                                Path dir,
                                IOException exc) throws IOException {

                            if (!dir.equals(root) && isEmpty(dir)) {
                                System.out.println(dir);
                            }

                            return FileVisitResult.CONTINUE;
                        }
                    }
            );

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static boolean isEmpty(Path directory) throws IOException {

        try (DirectoryStream<Path> stream =
                     Files.newDirectoryStream(directory)) {

            return !stream.iterator().hasNext();
        }
    }
}