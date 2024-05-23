// src/main/java/com/example/studentapp/controller/BookController.java
//package com.p.apis.book.controller;
package com.p.apis.book.contoller;

import com.p.apis.book.entity.Book;
import com.p.apis.book.service.BackupService;
import com.p.apis.book.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/")
public class BookController {
    @Autowired
    private BookService studentService;

    @Autowired
    private BackupService backupService;

    @GetMapping("/h2-console-url")
    public ResponseEntity<String> getH2ConsoleUrl() {
        String h2ConsoleUrl = "http://localhost:8089/h2-console";
        return ResponseEntity.ok(h2ConsoleUrl);
    }

    @GetMapping
    public List<Book> getAll() {
        return studentService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getById(@PathVariable Long id) {
        return studentService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Book create(@RequestBody Book student) throws IOException {

        Book savedBook = studentService.create(student);
        backupService.createBackup();
        return savedBook;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> update(@PathVariable Long id, @RequestBody Book studentDetails) throws IOException {
        Book upadatedBook = studentService.update(id, studentDetails);
        backupService.createBackup();
        return ResponseEntity.ok(upadatedBook);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) throws IOException {
        studentService.deleteById(id);
        backupService.createBackup();
        return ResponseEntity.noContent().build();
    }
}
