// src/main/java/com/example/book/service/BackupService.java
package com.p.apis.book.service;

import com.p.apis.book.entity.Book;
import com.p.apis.book.repository.BookRepository;
import com.p.apis.book.util.FileUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class BackupService {

    @Value("${backup.file.path}")
    private String backupFilePath;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public void createBackup() throws IOException {
        List<Book> students = bookRepository.findAll();
        File backupFile = new File(backupFilePath);
        FileUtil.createFileIfNotExists(backupFile);
        objectMapper.writeValue(backupFile, students);
    }

    public void restoreBackup() {
        File backupFile = new File(backupFilePath);
        if (backupFile.exists()) {
            try {
                Book[] books = objectMapper.readValue(backupFile, Book[].class);
                if (books.length > 0) {
                    bookRepository.saveAll(Arrays.asList(books));
                    System.out.println("Backup restored successfully.");
                } else {
                    System.out.println("No valid data in: " + backupFile.getPath());
                }
            } catch (IOException e) {
                System.out.println("Failed to read backup file: " + e.getMessage());
            }
        } else {
            System.out.println("File not found: " + backupFile.getPath());
        }
    }
}
