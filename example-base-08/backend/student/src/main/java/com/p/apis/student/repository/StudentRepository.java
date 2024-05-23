// src/main/java/com/example/studentapp/repository/StudentRepository.java
package com.p.apis.student.repository;

import com.p.apis.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}
