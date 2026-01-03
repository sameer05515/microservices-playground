package com.prem.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FileFolderCounter {

    public static void main(String[] args) {

        // Change this path to the folder you want to scan.
        Path rootPath = Paths.get("E:\\GIT\\microservices-playground");

        if (!Files.exists(rootPath)) {
            System.out.println("Folder does not exist: " + rootPath);
            return;
        }

        if (!Files.isDirectory(rootPath)) {
            System.out.println("Path is not a folder: " + rootPath);
            return;
        }

        long folderCount = 0;
        long fileCount = 0;

        try (var stream = Files.walk(rootPath)) {

            var iterator = stream.iterator();

            while (iterator.hasNext()) {
                Path path = iterator.next();

                if (Files.isDirectory(path)) {
                    folderCount++;
                } else if (Files.isRegularFile(path)) {
                    fileCount++;
                }
            }

        } catch (IOException e) {
            System.err.println("Error while scanning folder: " + rootPath);
            e.printStackTrace();
            return;
        }

        System.out.println("Root Folder : " + rootPath);
        System.out.println("Folders     : " + folderCount);
        System.out.println("Files       : " + fileCount);
        System.out.println("Total Items : " + (folderCount + fileCount));
    }
}
