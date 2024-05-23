// src/main/java/com/example/studentapp/repository/StudentRepository.java
package com.p.apis.book.repository;

import com.p.apis.book.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}
