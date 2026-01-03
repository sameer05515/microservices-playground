package com.example.todo.todo;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.domain.Specification;
public interface TodoRepository extends JpaRepository<Todo,Long>, JpaSpecificationExecutor<Todo> {}
