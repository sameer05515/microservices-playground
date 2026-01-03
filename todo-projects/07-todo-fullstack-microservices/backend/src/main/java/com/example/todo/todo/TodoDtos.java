package com.example.todo.todo;
import jakarta.validation.constraints.NotBlank;
public final class TodoDtos {
 public record TodoRequest(@NotBlank String title,String description,Boolean completed){}
 public record TodoResponse(Long id,String title,String description,boolean completed,Long version){}
 public static TodoResponse out(Todo t){return new TodoResponse(t.getId(),t.getTitle(),t.getDescription(),t.isCompleted(),t.getVersion());}
}
