// src/main/java/com/example/studentapp/repository/StudentRepository.java
package com.p.apis.course.repository;


import com.p.apis.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
