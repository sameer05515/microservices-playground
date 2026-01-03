package com.p.ques.config;

import com.p.ques.entity.SecurityQuestion;
import com.p.ques.repository.SecurityQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SecurityQuestionInitializer implements CommandLineRunner {
    private final SecurityQuestionRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        repository.saveAll(List.of(
                new SecurityQuestion("SQ1", "What was the name of your first school?"),
                new SecurityQuestion("SQ2", "What was the name of your first pet?"),
                new SecurityQuestion("SQ3", "What is your favorite childhood nickname?"),
                new SecurityQuestion("SQ4", "What city were you born in?"),
                new SecurityQuestion("SQ5", "What was the name of your favorite teacher?")
        ));
    }
}
