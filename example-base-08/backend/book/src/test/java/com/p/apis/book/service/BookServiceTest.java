// src/test/java/com/example/studentapp/service/BookServiceTest.java
package com.p.apis.book.service;

//import com.example.studentapp.entity.Book;
//import com.example.studentapp.repository.BookRepository;
import com.p.apis.book.repository.BookRepository;
import com.p.apis.book.entity.Book;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class BookServiceTest {

    @InjectMocks
    private BookService bookService;

    @Mock
    private BookRepository bookRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllBooks() {
        Book student1 = new Book();
        student1.setId(1L);
        student1.setName("Core Java");
        student1.setAuthor("Premendra Kumar");
        student1.setPrice(20);

        Book student2 = new Book();
        student2.setId(2L);
        student2.setName("Jane Doe");
        student2.setAuthor("jane.doe@example.com");
        student2.setPrice(22);

        List<Book> students = Arrays.asList(student1, student2);
        when(bookRepository.findAll()).thenReturn(students);

        List<Book> result = bookService.getAll();
        assertEquals(2, result.size());
        assertEquals("John Doe", result.get(0).getName());
    }

    @Test
    public void testGetBookById() {
        Book student = new Book();
        student.setId(1L);
        student.setName("John Doe");
        student.setAuthor("john.doe@example.com");
        student.setPrice(20);

        when(bookRepository.findById(1L)).thenReturn(Optional.of(student));

        Optional<Book> result = bookService.getById(1L);
        assertTrue(result.isPresent());
        assertEquals("John Doe", result.get().getName());
    }

    @Test
    public void testCreateBook() {
        Book student = new Book();
        student.setId(1L);
        student.setName("John Doe");
        student.setAuthor("john.doe@example.com");
        student.setPrice(20);

        when(bookRepository.save(any(Book.class))).thenReturn(student);

        Book result = bookService.create(student);
        assertEquals("John Doe", result.getName());
    }

    @Test
    public void testUpdateBook() {
        Book existingBook = new Book();
        existingBook.setId(1L);
        existingBook.setName("John Doe");
        existingBook.setAuthor("john.doe@example.com");
        existingBook.setPrice(20);

        Book updatedBook = new Book();
        updatedBook.setName("John Smith");
        updatedBook.setAuthor("john.smith@example.com");
        updatedBook.setPrice(21);

        when(bookRepository.findById(1L)).thenReturn(Optional.of(existingBook));
        when(bookRepository.save(any(Book.class))).thenReturn(updatedBook);

        Book result = bookService.update(1L, updatedBook);
        assertEquals("John Smith", result.getName());
    }

    @Test
    public void testDeleteBook() {
        bookService.deleteById(1L);
        verify(bookRepository, times(1)).deleteById(1L);
    }
}
