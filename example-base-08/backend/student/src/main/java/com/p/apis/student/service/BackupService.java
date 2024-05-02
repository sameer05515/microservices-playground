// src/main/java/com/example/studentapp/service/BackupService.java
package com.p.apis.student.service;

import com.p.apis.student.entity.Student;
import com.p.apis.student.repository.StudentRepository;
import com.p.apis.student.util.FileUtil;
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
    private StudentRepository studentRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public void createBackup() throws IOException {
        List<Student> students = studentRepository.findAll();
        File backupFile = new File(backupFilePath);
        FileUtil.createFileIfNotExists(backupFile);
        objectMapper.writeValue(backupFile, students);
    }

    public void restoreBackup() {
        File backupFile = new File(backupFilePath);
        if (backupFile.exists()) {
            try {
                Student[] students = objectMapper.readValue(backupFile, Student[].class);
                if (students.length > 0) {
                    studentRepository.saveAll(Arrays.asList(students));
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
