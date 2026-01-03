package com.example.todo.dto; import jakarta.validation.constraints.*; public record TodoRequest(@NotBlank @Size(max=200) String title,@Size(max=2000) String description){}
