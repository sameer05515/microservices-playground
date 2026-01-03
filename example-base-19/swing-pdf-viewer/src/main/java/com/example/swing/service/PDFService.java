package com.example.swing.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for PDF file operations
 */
public class PDFService {
    
    /**
     * Get all PDF files from a folder
     * @param folderPath Path to the folder
     * @return List of PDF files sorted by name
     * @throws IOException If folder cannot be read
     */
    public static List<File> getPDFFilesFromFolder(String folderPath) throws IOException {
        Path path = Paths.get(folderPath);
        
        if (!Files.exists(path) || !Files.isDirectory(path)) {
            throw new IOException("Folder does not exist or is not a directory: " + folderPath);
        }
        
        return Files.list(path)
                .filter(Files::isRegularFile)
                .map(Path::toFile)
                .filter(file -> file.getName().toLowerCase().endsWith(".pdf"))
                .sorted(Comparator.comparing(File::getName))
                .collect(Collectors.toList());
    }
    
    /**
     * Check if a folder exists and is a directory
     * @param folderPath Path to check
     * @return true if folder exists and is a directory
     */
    public static boolean isValidFolder(String folderPath) {
        Path path = Paths.get(folderPath);
        return Files.exists(path) && Files.isDirectory(path);
    }
    
    /**
     * Truncate path for display
     * @param path Full path
     * @param maxLength Maximum display length
     * @return Truncated path
     */
    public static String truncatePath(String path, int maxLength) {
        if (path.length() <= maxLength) {
            return path;
        }
        return "..." + path.substring(path.length() - maxLength + 3);
    }
}

