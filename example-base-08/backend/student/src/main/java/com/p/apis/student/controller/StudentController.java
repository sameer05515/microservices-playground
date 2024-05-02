// src/main/java/com/example/studentapp/controller/StudentController.java
package com.p.apis.student.controller;

//import com.example.studentapp.entity.Student;
//import com.example.studentapp.service.StudentService;

import com.p.apis.student.entity.Student;
import com.p.apis.student.service.BackupService;
import com.p.apis.student.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/")
public class StudentController {
    @Autowired
    private StudentService studentService;

    @Autowired
    private BackupService backupService;

    @GetMapping
    public List<Student> getAll() {
        return studentService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getById(@PathVariable Long id) {
        return studentService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Student create(@RequestBody Student student) throws IOException {

        Student savedStudent = studentService.create(student);
        backupService.createBackup();
        return savedStudent;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> update(@PathVariable Long id, @RequestBody Student studentDetails) throws IOException {
        Student upadatedStudent = studentService.update(id, studentDetails);
        backupService.createBackup();
        return ResponseEntity.ok(upadatedStudent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) throws IOException {
        studentService.deleteById(id);
        backupService.createBackup();
        return ResponseEntity.noContent().build();
    }
}
