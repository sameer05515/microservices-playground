package com.p.ques.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "todos")
public class Todo {

    @Id
    private String id;

    private String title;

    private boolean completed;

    /*
     * Owner of this Todo.
     *
     * We are using email for now because it is
     * available from Spring Security authentication.
     */
    private String userEmail;

    private Instant createdAt;

    private Instant updatedAt;
}