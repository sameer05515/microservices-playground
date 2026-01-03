package com.p.ques.controller;

import com.p.ques.entity.SecurityQuestion;
import com.p.ques.repository.SecurityQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/security-questions")
@RequiredArgsConstructor
public class SecurityQuestionController {
    private final SecurityQuestionRepository repository;

    @GetMapping
    public List<SecurityQuestion> getAll() {
        return repository.findAll();
    }
}
