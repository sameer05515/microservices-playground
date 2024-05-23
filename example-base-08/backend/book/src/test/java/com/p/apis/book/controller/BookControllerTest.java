// src/test/java/com/p/apis/controller/BookControllerTest.java
package com.p.apis.book.controller;

import com.p.apis.book.contoller.BookController;
import com.p.apis.book.entity.Book;
import com.p.apis.book.service.BookService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import com.fasterxml.jackson.databind.ObjectMapper;

public class BookControllerTest {

    @InjectMocks
    private BookController studentController;

    @Mock
    private BookService studentService;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(studentController).build();
    }

    @Test
    public void testGetAllBooks() throws Exception {
        Book student1 = new Book();
        student1.setId(1L);
        student1.setName("John Doe");
        student1.setAuthor("john.doe@example.com");
        student1.setPrice(20);

        Book student2 = new Book();
        student2.setId(2L);
        student2.setName("Jane Doe");
        student2.setAuthor("jane.doe@example.com");
        student2.setPrice(22);

        when(studentService.getAll()).thenReturn(Arrays.asList(student1, student2));

        mockMvc.perform(get("/api/students")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("John Doe"))
                .andExpect(jsonPath("$[1].name").value("Jane Doe"));
    }

    @Test
    public void testGetBookById() throws Exception {
        Book student = new Book();
        student.setId(1L);
        student.setName("John Doe");
        student.setAuthor("john.doe@example.com");
        student.setPrice(20);

        when(studentService.getById(1L)).thenReturn(Optional.of(student));

        mockMvc.perform(get("/api/students/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    public void testCreateBook() throws Exception {
        Book student = new Book();
        student.setId(1L);
        student.setName("John Doe");
        student.setAuthor("john.doe@example.com");
        student.setPrice(20);

        when(studentService.create(any(Book.class))).thenReturn(student);

        mockMvc.perform(post("/api/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(student)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    public void testUpdateBook() throws Exception {
        Book student = new Book();
        student.setId(1L);
        student.setName("John Doe");
        student.setAuthor("john.doe@example.com");
        student.setPrice(20);

        when(studentService.update(anyLong(), any(Book.class))).thenReturn(student);

        mockMvc.perform(put("/api/students/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(student)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    public void testDeleteBook() throws Exception {
        mockMvc.perform(delete("/api/students/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(studentService, times(1)).deleteById(1L);
    }
}
