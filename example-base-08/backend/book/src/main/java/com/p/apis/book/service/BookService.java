// src/main/java/com/example/studentapp/service/BookService.java
package com.p.apis.book.service;

import com.p.apis.book.entity.Book;
import com.p.apis.book.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAll() {
        System.out.println("[BookService][getAll]:- check if live update is working");
        return bookRepository.findAll();
    }

    public Optional<Book> getById(Long id) {
        return bookRepository.findById(id);
    }

    public Book create(Book student) {
        return bookRepository.save(student);
    }

    public Book update(Long id, Book studentDetails) {
        Book student = bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
        student.setName(studentDetails.getName());
        student.setAuthor(studentDetails.getAuthor());
        student.setPrice(studentDetails.getPrice());
        return bookRepository.save(student);
    }

    public void deleteById(Long id) {
        bookRepository.deleteById(id);
    }
}
