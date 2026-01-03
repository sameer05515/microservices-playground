package com.prem.ziputils;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public final class ZipUtils {

    private static final int BUFFER_SIZE = 8192;

    private ZipUtils() {
    }

    public static void zipDirectory(Path sourceDirectory, Path zipFile)
            throws IOException {

        if (!Files.exists(sourceDirectory)) {
            throw new IOException("Source directory does not exist: "
                    + sourceDirectory);
        }

        if (!Files.isDirectory(sourceDirectory)) {
            throw new IOException("Source is not a directory: "
                    + sourceDirectory);
        }

        Path zipParent = zipFile.toAbsolutePath().getParent();

        if (zipParent != null) {
            Files.createDirectories(zipParent);
        }

        Path sourceRoot = sourceDirectory.toAbsolutePath().normalize();

        try (OutputStream outputStream = Files.newOutputStream(zipFile);
             ZipOutputStream zipOutputStream =
                     new ZipOutputStream(outputStream)) {

            Files.walk(sourceRoot)
                    .forEach(path -> {
                        try {
                            addToZip(sourceRoot, path, zipOutputStream);
                        } catch (IOException e) {
                            throw new ZipRuntimeException(e);
                        }
                    });
        } catch (ZipRuntimeException e) {
            throw e.getCause();
        }
    }

    private static void addToZip(
            Path sourceRoot,
            Path path,
            ZipOutputStream zipOutputStream) throws IOException {

        if (path.equals(sourceRoot)) {
            return;
        }

        String entryName = sourceRoot
                .relativize(path)
                .toString()
                .replace('\\', '/');

        if (Files.isDirectory(path)) {
            if (!entryName.endsWith("/")) {
                entryName += "/";
            }

            zipOutputStream.putNextEntry(new ZipEntry(entryName));
            zipOutputStream.closeEntry();
            return;
        }

        if (Files.isRegularFile(path)) {
            zipOutputStream.putNextEntry(new ZipEntry(entryName));

            try (InputStream inputStream = Files.newInputStream(path)) {
                byte[] buffer = new byte[BUFFER_SIZE];
                int bytesRead;

                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    zipOutputStream.write(buffer, 0, bytesRead);
                }
            }

            zipOutputStream.closeEntry();
        }
    }

    private static class ZipRuntimeException extends RuntimeException {

        private final IOException cause;

        private ZipRuntimeException(IOException cause) {
            this.cause = cause;
        }

        @Override
        public IOException getCause() {
            return cause;
        }
    }
}
