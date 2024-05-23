// src/main/java/com/example/studentapp/dto/StudentDto.java
package com.p.apis.book.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class BookDto {
    private Long id;
    private String name;
    private String author;
    private int price;
}
