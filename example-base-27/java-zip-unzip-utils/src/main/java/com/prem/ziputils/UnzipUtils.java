package com.prem.ziputils;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public final class UnzipUtils {

    private static final int BUFFER_SIZE = 8192;

    private UnzipUtils() {
    }

    public static void unzip(Path zipFile, Path destinationDirectory)
            throws IOException {

        if (!Files.exists(zipFile)) {
            throw new IOException("ZIP file does not exist: " + zipFile);
        }

        if (!Files.isRegularFile(zipFile)) {
            throw new IOException("ZIP path is not a regular file: " + zipFile);
        }

        Path destinationRoot = destinationDirectory
                .toAbsolutePath()
                .normalize();

        Files.createDirectories(destinationRoot);

        try (InputStream inputStream = Files.newInputStream(zipFile);
             ZipInputStream zipInputStream =
                     new ZipInputStream(inputStream)) {

            ZipEntry entry;

            while ((entry = zipInputStream.getNextEntry()) != null) {

                Path targetPath = destinationRoot
                        .resolve(entry.getName())
                        .normalize();

                validateZipEntry(destinationRoot, targetPath);

                if (entry.isDirectory()) {
                    Files.createDirectories(targetPath);
                } else {
                    Path parent = targetPath.getParent();

                    if (parent != null) {
                        Files.createDirectories(parent);
                    }

                    extractFile(zipInputStream, targetPath);
                }

                zipInputStream.closeEntry();
            }
        }
    }

    private static void extractFile(
            ZipInputStream zipInputStream,
            Path targetPath) throws IOException {

        try (OutputStream outputStream = Files.newOutputStream(targetPath)) {

            byte[] buffer = new byte[BUFFER_SIZE];
            int bytesRead;

            while ((bytesRead = zipInputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        }
    }

    private static void validateZipEntry(
            Path destinationRoot,
            Path targetPath) throws IOException {

        if (!targetPath.startsWith(destinationRoot)) {
            throw new IOException(
                    "Blocked unsafe ZIP entry: " + targetPath);
        }
    }
}
