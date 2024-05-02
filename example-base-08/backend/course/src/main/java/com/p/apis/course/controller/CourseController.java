// src/main/java/com/example/studentapp/controller/CourseController.java
//package com.p.apis.book.controller;
package com.p.apis.course.controller;

import com.p.apis.course.entity.Course;
import com.p.apis.course.service.BackupService;
import com.p.apis.course.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/")
public class CourseController {
    @Autowired
    private CourseService studentService;

    @Autowired
    private BackupService backupService;

    @GetMapping
    public List<Course> getAll() {
        return studentService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getById(@PathVariable Long id) {
        return studentService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Course create(@RequestBody Course student) throws IOException {

        Course savedCourse = studentService.create(student);
        backupService.createBackup();
        return savedCourse;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable Long id, @RequestBody Course studentDetails) throws IOException {
        Course upadatedCourse = studentService.update(id, studentDetails);
        backupService.createBackup();
        return ResponseEntity.ok(upadatedCourse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) throws IOException {
        studentService.deleteById(id);
        backupService.createBackup();
        return ResponseEntity.noContent().build();
    }
}
