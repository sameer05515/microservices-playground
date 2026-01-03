package com.example.todo.todo;

import org.springframework.data.domain.Page;
import java.util.List;

public record TodoPageResponse(List<TodoDtos.TodoResponse> content,int number,int size,long totalElements,int totalPages,boolean first,boolean last){
    public static TodoPageResponse from(Page<TodoDtos.TodoResponse> p){return new TodoPageResponse(p.getContent(),p.getNumber(),p.getSize(),p.getTotalElements(),p.getTotalPages(),p.isFirst(),p.isLast());}
}
