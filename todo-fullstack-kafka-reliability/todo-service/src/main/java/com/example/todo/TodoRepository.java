package com.example.todo;
import org.springframework.data.jpa.repository.*;
public interface TodoRepository extends JpaRepository<Todo,Long>, JpaSpecificationExecutor<Todo>{}
