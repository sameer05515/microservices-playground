package com.p.ques.service;

public class TodoNotFoundException
        extends RuntimeException {

    public TodoNotFoundException(String message) {
        super(message);
    }
}