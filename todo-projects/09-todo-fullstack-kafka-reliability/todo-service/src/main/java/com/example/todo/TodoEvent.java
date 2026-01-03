package com.example.todo;
public record TodoEvent(String eventId,String type,Long todoId,String username,String title,boolean completed) {}
