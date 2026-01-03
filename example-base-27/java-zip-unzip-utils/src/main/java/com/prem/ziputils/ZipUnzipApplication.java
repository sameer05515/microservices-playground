package com.prem.ziputils;

import java.nio.file.Path;
import java.nio.file.Paths;

public class ZipUnzipApplication {

    public static void main(String[] args) {

        if (args.length != 3) {
            printUsage();
            return;
        }

        String operation = args[0].toLowerCase();
        Path source = Paths.get(args[1]);
        Path destination = Paths.get(args[2]);

        try {
            switch (operation) {
                case "zip" -> {
                    ZipUtils.zipDirectory(source, destination);
                    System.out.println("ZIP created successfully: "
                            + destination.toAbsolutePath());
                }
                case "unzip" -> {
                    UnzipUtils.unzip(source, destination);
                    System.out.println("ZIP extracted successfully to: "
                            + destination.toAbsolutePath());
                }
                default -> {
                    System.err.println("Unknown operation: " + operation);
                    printUsage();
                }
            }
        } catch (Exception e) {
            System.err.println("Operation failed: " + e.getMessage());
        }
    }

    private static void printUsage() {
        System.out.println("""
                Usage:

                Zip a folder:
                  mvn exec:java -Dexec.args="zip <folder> <zip-file>"

                Unzip a file:
                  mvn exec:java -Dexec.args="unzip <zip-file> <destination-folder>"

                Examples:

                  mvn exec:java -Dexec.args="zip C:/data/input C:/data/input.zip"

                  mvn exec:java -Dexec.args="unzip C:/data/input.zip C:/data/output"
                """);
    }
}
