package com.p.ques.service;

import com.p.ques.dto.QuestionRequest;
import com.p.ques.exception.ResourceNotFoundException;
import com.p.ques.model.Question;
import com.p.ques.repository.QuestionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class QuestionService {

    private final QuestionRepository repository;

    public QuestionService(QuestionRepository repository) {
        this.repository = repository;
    }

    public Question create(QuestionRequest request) {

        Question question = new Question();

        question.setQuestion(
                request.getQuestion().trim()
        );

        question.setAnswers(
                request.getAnswers()
        );

        question.setTags(
                request.getTags() != null
                        ? new ArrayList<>(request.getTags())
                        : new ArrayList<>()
        );

        return repository.save(question);
    }

    public Page<Question> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    /*
     * Search questions.
     *
     * If search text is empty, return all questions.
     */
    public Page<Question> search(
            String search,
            Pageable pageable) {

        if (search == null || search.isBlank()) {

            return repository.findAll(pageable);
        }

        return repository.findByQuestionContainingIgnoreCase(
                search.trim(),
                pageable
        );
    }

    public Question getById(String id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Question not found with id: " + id
                        )
                );
    }

    public Question update(
            String id,
            QuestionRequest request) {

        Question question = getById(id);

        question.setQuestion(
                request.getQuestion().trim()
        );

        question.setAnswers(
                request.getAnswers()
        );

        question.setTags(
                request.getTags() != null
                        ? new ArrayList<>(request.getTags())
                        : new ArrayList<>()
        );

        return repository.save(question);
    }

    public void delete(String id) {

        Question question = getById(id);

        repository.delete(question);
    }
}