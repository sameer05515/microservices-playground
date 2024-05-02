// src/main/java/com/example/studentapp/dto/StudentDto.java
package com.p.apis.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class StudentDto {
    private Long id;
    private String name;
    private String email;
    private int age;
}
