// src/test/java/com/example/studentapp/service/StudentServiceTest.java
package com.p.apis.student.service;

//import com.example.studentapp.entity.Student;
//import com.example.studentapp.repository.StudentRepository;
import com.p.apis.student.entity.Student;
import com.p.apis.student.repository.StudentRepository;
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

public class StudentServiceTest {

    @InjectMocks
    private StudentService studentService;

    @Mock
    private StudentRepository studentRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllStudents() {
        Student student1 = new Student();
        student1.setId(1L);
        student1.setName("John Doe");
        student1.setEmail("john.doe@example.com");
        student1.setAge(20);

        Student student2 = new Student();
        student2.setId(2L);
        student2.setName("Jane Doe");
        student2.setEmail("jane.doe@example.com");
        student2.setAge(22);

        List<Student> students = Arrays.asList(student1, student2);
        when(studentRepository.findAll()).thenReturn(students);

        List<Student> result = studentService.getAll();
        assertEquals(2, result.size());
        assertEquals("John Doe", result.get(0).getName());
    }

    @Test
    public void testGetStudentById() {
        Student student = new Student();
        student.setId(1L);
        student.setName("John Doe");
        student.setEmail("john.doe@example.com");
        student.setAge(20);

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        Optional<Student> result = studentService.getById(1L);
        assertTrue(result.isPresent());
        assertEquals("John Doe", result.get().getName());
    }

    @Test
    public void testCreateStudent() {
        Student student = new Student();
        student.setId(1L);
        student.setName("John Doe");
        student.setEmail("john.doe@example.com");
        student.setAge(20);

        when(studentRepository.save(any(Student.class))).thenReturn(student);

        Student result = studentService.create(student);
        assertEquals("John Doe", result.getName());
    }

    @Test
    public void testUpdateStudent() {
        Student existingStudent = new Student();
        existingStudent.setId(1L);
        existingStudent.setName("John Doe");
        existingStudent.setEmail("john.doe@example.com");
        existingStudent.setAge(20);

        Student updatedStudent = new Student();
        updatedStudent.setName("John Smith");
        updatedStudent.setEmail("john.smith@example.com");
        updatedStudent.setAge(21);

        when(studentRepository.findById(1L)).thenReturn(Optional.of(existingStudent));
        when(studentRepository.save(any(Student.class))).thenReturn(updatedStudent);

        Student result = studentService.update(1L, updatedStudent);
        assertEquals("John Smith", result.getName());
    }

    @Test
    public void testDeleteStudent() {
        studentService.deleteById(1L);
        verify(studentRepository, times(1)).deleteById(1L);
    }
}
