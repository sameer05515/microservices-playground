package com.p.ques.repository;

import com.p.ques.model.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuestionRepository
        extends MongoRepository<Question, String> {

    Page<Question> findByQuestionContainingIgnoreCase(
            String question,
            Pageable pageable
    );
}