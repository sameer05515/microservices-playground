// src/main/java/com/example/studentapp/dto/StudentDto.java
package com.p.apis.course.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class CourseDto {
    private Long id;
    private String name;
    private int price;
}
