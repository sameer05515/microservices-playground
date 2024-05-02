// src/main/java/com/example/studentapp/service/CourseService.java
package com.p.apis.course.service;

import com.p.apis.course.entity.Course;
import com.p.apis.course.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    @Autowired
    private CourseRepository bookRepository;

    public List<Course> getAll() {
        System.out.println("[CourseService][getAll]:- check if live update is working");
        return bookRepository.findAll();
    }

    public Optional<Course> getById(Long id) {
        return bookRepository.findById(id);
    }

    public Course create(Course student) {
        return bookRepository.save(student);
    }

    public Course update(Long id, Course studentDetails) {
        Course student = bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        student.setName(studentDetails.getName());
        student.setPrice(studentDetails.getPrice());
        return bookRepository.save(student);
    }

    public void deleteById(Long id) {
        bookRepository.deleteById(id);
    }
}
